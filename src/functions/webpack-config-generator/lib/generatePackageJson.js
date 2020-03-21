/**
 * Internal dependencies
 */
const fs = require('fs');

/**
 * External dependencies
 */
const prettier = require('prettier');

module.exports = (options, folderName) => {
  try {
    const content = prettier.format(
      `
{
  "name": "your-desired-name-here",
  "version": "1.0.0",
  "description": "Automate development process and project assets bundling",
  "main": "./src/js/${options.jsEntry}.js",
  "scripts": {
    "dev": "NODE_ENV=development webpack --config ./webpack.config.js",
    "prod": "NODE_ENV=production webpack --config ./webpack.config.js",
    ${
      options.devServer === 'yes'
        ? `
    "start": "NODE_ENV=development webpack-dev-server --config ./webpack.config.js"
    `
        : `
    "start": "NODE_ENV=development webpack --watch --config ./webpack.config.js"
    `
    }
  },
  "author": "@mobb.dev",
  "license": "ISC",
  "devDependencies": {
    "@babel/core": "^7.4.4",
    "@babel/preset-env": "^7.4.4",
    "babel-loader": "^8.0.5",
    "copy-webpack-plugin": "^5.0.3",
    "rimraf": "^2.6.3",
    "webpack": "^4.30.0",
    "webpack-assets-manifest": "^3.1.1",
    "webpack-cli": "^3.3.0",
    "uglifyjs-webpack-plugin": "^2.1.2",
    ${
      options.processHTML === 'yes'
        ? `
    "html-loader": "^0.5.5",
    "html-webpack-plugin": "^3.2.0",
    "script-ext-html-webpack-plugin": "^2.1.4",
    ${
      options.htmlPreference === 'pug'
        ? `
    "pug": "^2.0.0",
    "pug-loader": "^2.4.0",
    `
        : ''
    }
    ${
      options.htmlPreference === 'handlebars'
        ? `
    "handlebars": "^4.7.3",
    "handlebars-loader": "^1.7.1",
    `
        : ''
    }
    ${
      options.htmlPreference === 'posthtml'
        ? `
    "posthtml": "^0.12.0",
    "posthtml-loader": "^1.0.2",
    `
        : ''
    }
    `
        : ''
    }
    ${
      options.processStyles === 'yes'
        ? `
    "autoprefixer": "^9.5.1",
    "css-loader": "^2.1.1",
    "postcss-loader": "^3.0.0",
    ${
      options.stylesType === 'scss'
        ? `
    "node-sass": "^4.11.0",
    "sass-loader": "^7.1.0",
    `
        : ''
    }
    ${
      options.stylesPreference !== 'css-in-js'
        ? `
    "mini-css-extract-plugin": "^0.6.0",
    "webpack-fix-style-only-entries": "^0.4.0",
    "optimize-css-assets-webpack-plugin": "^5.0.1",
    `
        : ''
    }
    `
        : ''
    }
    ${
      options.processImages === 'yes'
        ? `
    "file-loader": "^3.0.1",
    ${
      options.svgOptimization
        ? `
    "svgo": "^1.2.2",
    "svgo-loader": "^2.2.0",
    `
        : ''
    }
    ${
      options.imageUrlResolve
        ? `
    "url-loader": "^3.0.0",
    `
        : ''
    }
    ${
      options.imageOptimization
        ? `
    "imagemin-webpack-plugin": "^2.4.2",
    `
        : ''
    }
    `
        : ''
    }
    ${
      options.webp
        ? `
    "imagemin-webp-webpack-plugin": "^3.2.1",
    `
        : ''
    }
    ${
      options.purgeCss
        ? `
    "purgecss-webpack-plugin": "^1.6.0",
    `
        : ''
    }
    ${
      options.criticalCss
        ? `
    "html-critical-webpack-plugin": "^2.1.0",
    `
        : ''
    }
    ${
      options.devServer === 'yes'
        ? `
    "webpack-dev-server": "^3.3.1",
    `
        : ''
    }
  },
  ${
    options.processStyles === 'yes'
      ? `
  "postcss": {
    "plugins": {
      "autoprefixer": {}
    }
  },
  "browserslist": "last 3 versions"
  `
      : ''
  }
}
  `,
      {
        trailingComma: 'es5',
        tabWidth: 2,
        semi: true,
        singleQuote: true,
        parser: 'json',
      }
    );
    fs.writeFileSync(`generated/${folderName}/package.json`, content);
    console.log('Package.json created successfully.');
  } catch (err) {
    console.error(err);
  }
};
