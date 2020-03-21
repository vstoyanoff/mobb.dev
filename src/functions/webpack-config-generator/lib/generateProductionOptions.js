module.exports = options => {
  return `
//Add plugins for production use
if (mode === 'production') {
  module.exports.plugins.push(
    new UglifyJsPlugin({
      parallel: true,
    }),${
      options.processStyles === 'yes' &&
      options.stylesPreference !== 'css-in-js'
        ? `new FixStyleOnlyEntriesPlugin(),
        new OptimizeCssAssetsPlugin({
      cssProcessorPluginOptions: {
        preset: [
          'default',
          {
            discardComments: { removeAll: true }
          }
        ]
      }
    }),`
        : ''
    }${
    options.imageOptimization
      ? `
    new ImageminPlugin({
      test: /\\.(jpe?g|png|gif|webp)$/i
    }),`
      : ''
  }
    ${options.webp ? `new ImageminWebpWebpackPlugin(),` : ''}
    ${options.criticalCss ? `...CriticalCssPluginInits,` : ''}
    ${
      options.purgeCss
        ? `new PurgecssPlugin({
      paths: glob.sync(path.resolve('./', 'src/*/**'), { nodir: true }),
      only: ['style'],
      //whitelistPatterns: [here you can add whitelist patterns https://purgecss.com/]
    }),`
        : ''
    }
  );
}
  `;
};
