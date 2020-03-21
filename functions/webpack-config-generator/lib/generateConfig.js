/**
 * Internal dependencies
 */
const fs = require('fs');

/**
 * External dependencies
 */
const prettier = require('prettier');
const generateImports = require('./generateImports');
const generateEntries = require('./generateEntries');
const generatePlugins = require('./generatePlugins');
const generateLoaders = require('./generateLoaders');
const generateProductionOptions = require('./generateProductionOptions');

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
      `
${generateImports(options)}

module.exports = {
  mode: mode,
  devtool: mode === 'production' ? 'none' : 'source-map',
  entry: ${generateEntries(options)},
  output: {
    path: path.resolve('./dist'),
    filename: mode === 'production' ? 'js/[name].[hash].js' : 'js/[name].js',
  },
  ${
    options.splitChunks
      ? `optimization: mode === 'production' ? optimization : {},`
      : ''
  }
  ${
    options.devServer === 'yes'
      ? `devServer: {
    hot: true,
    compress: true,
    port: 9090,
    https: false,
    open: true,
    overlay: true,
    contentBase: false,
    ${
      options.processHTML === 'yes'
        ? `
    before(app, server) {
      server._watch('src/*/**${htmlFileExt}');
    }
    `
        : ''
    }
  },`
      : ''
  }
  plugins: ${generatePlugins(options)},
  module: ${generateLoaders(options)},
};

${generateProductionOptions(options)}
  `,
      {
        trailingComma: 'es5',
        tabWidth: 2,
        semi: true,
        singleQuote: true,
        parser: 'babel',
      }
    );
    fs.writeFileSync(`generated/${folderName}/webpack.config.js`, content);
    console.log('Webpack.config.js created successfully.');
  } catch (err) {
    console.error(err);
  }
};
