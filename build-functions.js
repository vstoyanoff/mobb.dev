const fs = require('fs');
const { execSync } = require('child_process');
const rimraf = require('rimraf');

//Serverless Functions Folders
const functionsPath = 'functions/src';
const functionsFolders = fs.readdirSync(functionsPath);
functionsFolders.forEach(folder => {
  const stat = fs.lstatSync(`${functionsPath}/${folder}`);
  if (stat.isDirectory()) {
    execSync(`cd ${functionsPath}/${folder} && yarn`, { stdio: 'inherit' });
    execSync(
      `./node_modules/netlify-lambda/bin/cmd.js build ${functionsPath}/${folder}`,
      {
        stdio: 'inherit',
      }
    );
    rimraf.sync(`${functionsPath}/${folder}/node_modules`);
  }
});
