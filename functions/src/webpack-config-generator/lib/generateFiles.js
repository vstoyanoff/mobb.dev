/**
 * Internal dependencies
 */
const fs = require('fs');

/**
 * External dependencies
 */
const archiver = require('archiver');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const generateConfig = require('./generateConfig');
const generatePackageJson = require('./generatePackageJson');
const generateHtmlFiles = require('./generateHtmlFiles');

module.exports = options => {
  return new Promise((resolve, reject) => {
    try {
      const folderName = `${options.id}`;
      mkdirp.sync(`generated/${folderName}`);
      mkdirp.sync(`generated/${folderName}/src`);
      generateConfig(options, folderName);
      generatePackageJson(options, folderName);
      generateHtmlFiles(options, folderName);
      mkdirp.sync(`generated/${folderName}/src/js`);

      fs.writeFileSync(
        `generated/${folderName}/src/js/${options.jsEntry}.js`,
        ''
      );
      console.log(`${options.jsEntry}.js created successfully.`);

      mkdirp.sync(`generated/${folderName}/src/static`);
      console.log(`Static folder created successfully.`);

      if (
        options.processStyles === 'yes' &&
        options.stylesPreference === 'separate-files'
      ) {
        mkdirp.sync(`generated/${folderName}/src/styles`);
        fs.writeFileSync(
          `generated/${folderName}/src/styles/${options.stylesEntry}.${options.stylesType}`,
          ''
        );
        console.log(
          `${options.stylesEntry}.${options.stylesType} created successfully.`
        );
      }

      const output = fs.createWriteStream(`generated/${folderName}.zip`);
      const archive = archiver('zip');

      output.on('close', () => {
        console.log(archive.pointer() + ' total bytes');
        rimraf.sync(`generated/${folderName}`);

        resolve(folderName);
      });

      output.on('end', () => {
        console.log('Data has been drained');
      });

      archive.on('warning', err => {
        if (err.code === 'ENOENT') {
          console.log(err.code);
        } else {
          // throw error
          throw err;
        }
      });

      archive.on('error', err => {
        throw err;
      });

      archive.pipe(output);
      archive.directory(`generated/${folderName}`, '');
      archive.finalize();
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
};
