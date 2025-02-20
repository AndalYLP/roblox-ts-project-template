const fs = require('fs');
const https = require('https');
const { createTask, pollForTaskCompletion, getTaskLogs } = require('./luau_execution_task');

const ROBLOX_API_KEY = process.env.ROBLOX_API_KEY;
const ROBLOX_UNIVERSE_ID = process.env.ROBLOX_UNIVERSE_ID;
const ROBLOX_PLACE_ID = process.env.ROBLOX_PLACE_ID;

function readFile(filePath) {
    return fs.readFileSync(filePath);
}

function uploadPlace(binaryPath, universeId, placeId, doPublish = false) {
    console.log('Uploading place to Roblox');
    const versionType = doPublish ? 'Published' : 'Saved';
    const requestHeaders = {
        'x-api-key': ROBLOX_API_KEY,
        'Content-Type': 'application/xml',
        'Accept': 'application/json',
    };

    const endpoint = `https://apis.roblox.com/universes/v1/${universeId}/places/${placeId}/versions?versionType=${versionType}`;
    const buffer = readFile(binaryPath);

    const options = {
        method: 'POST',
        headers: requestHeaders,
    };

    return new Promise((resolve, reject) => {
        const req = https.request(endpoint, options, (response) => {
            let data = '';
            response.on('data', (chunk) => {
                data += chunk;
            });
            response.on('end', () => {
                const responseData = JSON.parse(data);
                const placeVersion = responseData.versionNumber;
                resolve(placeVersion);
            });
        });

        req.on('error', reject);
        req.write(buffer);
        req.end();
    });
}

function runLuauTask(universeId, placeId, placeVersion, scriptFile) {
    console.log('Executing Luau task');
    const scriptContents = readFile(scriptFile).toString('utf8');

    return createTask(ROBLOX_API_KEY, scriptContents, universeId, placeId, placeVersion)
        .then((task) => pollForTaskCompletion(ROBLOX_API_KEY, task.path))
        .then((task) => {
            return getTaskLogs(ROBLOX_API_KEY, task.path).then((logs) => {
                console.log(logs);

                if (task.state === 'COMPLETE') {
                    console.log('Luau task completed successfully');
                    process.exit(0);
                } else {
                    console.error('Luau task failed');
                    process.exit(1);
                }
            });
        });
}

const [binaryFile, scriptFile] = process.argv.slice(2);

uploadPlace(binaryFile, ROBLOX_UNIVERSE_ID, ROBLOX_PLACE_ID)
    .then((placeVersion) => runLuauTask(ROBLOX_UNIVERSE_ID, ROBLOX_PLACE_ID, placeVersion, scriptFile))
    .catch((error) => {
        console.error('Error:', error);
        process.exit(1);
    });
