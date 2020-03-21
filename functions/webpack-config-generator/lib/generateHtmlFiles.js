/**
 * Internal dependencies
 */
const fs = require('fs');

/**
 * External dependencies
 */
const prettier = require('prettier');
const mkdirp = require('mkdirp');

module.exports = (options, folderName) => {
  try {
    let htmlFileExt = '.html';

    switch (options.htmlPreference) {
      case 'pug':
        htmlFileExt = '.pug';
        break;
      case 'handlebars':
        htmlFileExt = '.hbs';
        break;
      default:
        break;
    }

    const content = prettier.format(
      `<!DOCTYPE html>
<html lang="en">
<head>
    <title></title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="description" content="">
    <meta name="keywords" content="">
    <meta name="author" content="">

    <!-- Twitter card meta -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="">
    <meta name="twitter:creator" content="">
    <!-- Twitter card meta -->

    <!-- Open Graph meta -->
    <meta property="og:url" content="">
    <meta property="og:type" content="website">
    <meta property="og:title" content="">
    <meta property="og:description" content="">
    <meta property="og:image" content="" />
    <!-- Open Graph meta -->

    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

    <link rel="canonical" href="">
</head>

<body></body>`,
      {
        trailingComma: 'es5',
        tabWidth: 2,
        semi: true,
        singleQuote: true,
        parser: 'html',
      }
    );
    if (options.processHTML === 'yes') {
      mkdirp.sync(`generated/${folderName}/src/pages`);
      fs.writeFileSync(
        `generated/${folderName}/src/pages/index${htmlFileExt}`,
        content
      );
      console.log(`pages/index${htmlFileExt} created successfully.`);
    } else {
      fs.writeFileSync(`generated/${folderName}/src/index.html`, content);
      console.log(`index.html created successfully.`);
    }
  } catch (err) {
    console.error(err);
  }
};
