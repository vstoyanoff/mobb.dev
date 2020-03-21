module.exports = options => {
  const {
    processStyles,
    stylesPreference,
    stylesEntry,
    stylesType,
    jsEntry,
  } = options;

  if (processStyles === 'no' || stylesPreference !== 'separate-files') {
    return `path.resolve('./src/js/${jsEntry}.js')`;
  }
  return `{
      ${jsEntry}: path.resolve('./src/js/${jsEntry}.js'),
      ${stylesEntry}: path.resolve('./src/styles/${stylesEntry}.${stylesType}'),
  }`;
};
