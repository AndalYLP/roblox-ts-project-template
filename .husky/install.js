if (process.env.NODE_ENV === "production" || process.env.CI === "true") {
	process.exit(0);
}

import husky from 'husky';
console.log(husky());