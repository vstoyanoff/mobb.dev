module.exports = options => {
  let htmlFileExt = '.html';
  let htmlLoader = 'html-loader';

  switch (options.htmlPreference) {
    case 'pug':
      htmlFileExt = '.pug';
      htmlLoader = 'pug-loader';
      break;
    case 'handlebars':
      htmlFileExt = '.hbs';
      htmlLoader = 'handlebars-loader';
      break;
    case 'posthtml':
      htmlLoader = 'posthtml-loader';
      break;
    default:
      break;
  }

  return `
  {
    rules: [
      ${
        options.processHTML === 'yes'
          ? `{
        test: /\\${htmlFileExt}$/,
        use: [
          ${
            options.htmlPreference !== 'no'
              ? `{
            loader: '${htmlLoader}'
          }`
              : `
          {
            loader: 'html-loader'
          },`
          }
        ]
      },`
          : ''
      }
      {
        test: /\\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      ${
        options.processStyles === 'yes'
          ? `{
          test: /\\.(scss|css)$/,
          use: [
            ${
              options.stylesPreference !== 'css-in-js'
                ? `{
                loader: MiniCssExtractPlugin.loader,
                options: {
                  publicPath: path.resolve('./dist/styles'),
                  hmr: mode === 'development'
                }
              },
            `
                : ''
            }
            {
              loader: 'css-loader',
              options: {
                url: ${options.processImages === 'yes' &&
                  options.imageUrlResolve}
              }
            },
            'postcss-loader',
            ${options.stylesType === 'scss' ? `'sass-loader'` : ''}
          ]
        },
      `
          : ''
      }
      ${
        options.processImages === 'yes'
          ? `{
        test: /\\.(png|jpe?g|gif|webp${
          !options.svgOptimization ? `'svg'` : ''
        })$/,
        exclude: /(node_modules|bower_components)/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[folder]/[name].[ext]'
            }
          },
          ${
            options.imageUrlResolve
              ? `{
            loader: 'url-loader',
            options: {
              limit: ${parseInt(options.resolveSize)}
            }
          }`
              : ''
          }
        ] 
      },`
          : ''
      }
      ${
        options.svgOptimization
          ? `{
        test: /\\.(svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[folder]/[name].[ext]'
            }
          },
          {
            loader: 'svgo-loader',
            options: {
              plugins: [
                { removeTitle: true },
                { convertColors: { shorthex: false } },
                { convertPathData: false }
              ]
            }
          }
        ]
      },`
          : ''
      }
    ],
  }`;
};
