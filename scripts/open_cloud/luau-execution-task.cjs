const axios = require('axios');
const fs = require('fs');
const crypto = require('crypto');
const process = require('process');

const API_KEY_ENV = process.env.ROBLOX_OC_API_KEY;
const MAX_RETRIES = 3;

function parseArgs() {
    const args = require('minimist')(process.argv.slice(2), {
        string: ['api-key', 'script-file', 'output', 'log-output'],
        boolean: ['continuous'],
        alias: {
            k: 'api-key',
            u: 'universe',
            p: 'place',
            v: 'place-version',
            f: 'script-file',
            c: 'continuous',
            o: 'output',
            l: 'log-output'
        },
        demand: ['universe', 'place', 'script-file']
    });
    return args;
}

function makeRequest(url, headers, body = null) {
    const options = {
        method: body ? 'POST' : 'GET',
        url,
        headers,
        data: body ? JSON.stringify(body) : null
    };

    let attempts = 0;
    const makeRequestWithRetry = async () => {
        try {
            return await axios(options);
        } catch (error) {
            if (attempts >= MAX_RETRIES) {
                throw error;
            }
            attempts++;
            console.log(`Retrying ${url}, error: ${error.message} ${JSON.stringify(error.response?.data) || ''}`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            return makeRequestWithRetry();
        }
    };

    return makeRequestWithRetry();
}

function readFileExitOnFailure(filePath, fileDescription) {
    try {
        return fs.readFileSync(filePath, 'utf8');
    } catch (err) {
        console.error(`${fileDescription} file not found or cannot be read: ${filePath}`);
        process.exit(1);
    }
}

function loadAPIKey(apiKeyArg) {
    let apiKey = '';
    if (apiKeyArg) {
        apiKey = readFileExitOnFailure(apiKeyArg, 'API key').trim();
    } else {
        apiKey = API_KEY_ENV?.trim();
        if (!apiKey) {
            console.error('API key needed. Either provide the --api-key option or set the RBLX_OC_API_KEY environment variable.');
            process.exit(1);
        }
    }

    try {
        Buffer.from(apiKey, 'base64');
        return apiKey;
    } catch (err) {
        console.error(`API key appears invalid (not valid base64): ${err.message}`);
        process.exit(1);
    }
}

async function createTask(apiKey, script, universeId, placeId, placeVersion) {
    const headers = {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
    };
    const data = { script };

    let url = `https://apis.roblox.com/cloud/v2/universes/${universeId}/places/${placeId}${placeVersion ? `/versions/${placeVersion}` : ''}/luau-execution-session-tasks`;

    const response = await makeRequest(url, headers, data);
    return response.data;
}

async function pollForTaskCompletion(apiKey, taskPath) {
    const headers = { 'x-api-key': apiKey };
    const url = `https://apis.roblox.com/cloud/v2/${taskPath}`;
    console.log("Waiting for task to finish...");

    while (true) {
        try {
            const response = await makeRequest(url, headers);
            const task = response.data;
            if (task.state !== 'PROCESSING') {
                console.log('');
                return task;
            } else {
                process.stdout.write('.');
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
        } catch (error) {
            console.error(`Error polling for task: ${error.message}`);
            process.exit(1);
        }
    }
}

async function getTaskLogs(apiKey, taskPath) {
    const headers = { 'x-api-key': apiKey };
    const url = `https://apis.roblox.com/cloud/v2/${taskPath}/logs`;

    const response = await makeRequest(url, headers);
    const logs = response.data.luauExecutionSessionTaskLogs[0].messages;
    return logs.join('\n');
}

async function handleLogs(task, logOutputFilePath, apiKey) {
    const logs = await getTaskLogs(apiKey, task.path);
    if (logs) {
        if (logOutputFilePath) {
            fs.writeFileSync(logOutputFilePath, logs);
            console.log(`Task logs written to ${logOutputFilePath}`);
        } else {
            console.log(`Task logs:\n${logs.trim()}`);
        }
    } else {
        console.log('The task did not produce any logs');
    }
}

async function handleSuccess(task, outputPath) {
    const output = task.output;
    if (output.results) {
        if (outputPath) {
            fs.writeFileSync(outputPath, JSON.stringify(output.results, null, 2));
            console.log(`Task results written to ${outputPath}`);
        } else {
            console.log("Task output:");
            console.log(JSON.stringify(output.results, null, 2));
        }
    } else {
        console.log('The task did not return any results');
    }
}

function handleFailure(task) {
    console.error(`Task failed, error:\n${JSON.stringify(task.error, null, 2)}`);
}

async function main() {
    const args = parseArgs();

    const apiKey = loadAPIKey(args["api-key"]);

    let prevScriptHash = null;
    let waitingMsgPrinted = false;
    while (true) {
        const script = readFileExitOnFailure(args["_"][1], 'script');
        const scriptHash = crypto.createHash('sha256').update(script).digest('hex');

        if (prevScriptHash && scriptHash === prevScriptHash) {
            if (!waitingMsgPrinted) {
                console.log("Waiting for changes to script file...");
                waitingMsgPrinted = true;
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
            continue;
        }

        if (prevScriptHash) {
            console.log("Detected change to script file, submitting new task");
        }

        prevScriptHash = scriptHash;
        waitingMsgPrinted = false;

        const task = await createTask(apiKey, script, args.universe, args.place, args.placeVersion);
        console.log(`Task created, path: ${task.path}`);

        const completedTask = await pollForTaskCompletion(apiKey, task.path);
        console.log(`Task is now in ${completedTask.state} state`);

        await handleLogs(completedTask, args.logOutput, apiKey);
        if (completedTask.state === 'COMPLETE') {
            await handleSuccess(completedTask, args.output);
        } else {
            handleFailure(completedTask);
        }

        if (!args.continuous) {
            break;
        }
    }
}

module.exports = {
    createTask,
    pollForTaskCompletion,
    getTaskLogs
}
