const fetch = require('node-fetch').default;
const secret = '6Lfd2M8UAAAAAMacR_k94FxxpKG4ZBkGfbRinnJb';

module.exports = async token => {
  const res = await fetch(
    `https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`,
    {
      method: 'POST',
    }
  );
  const json = await res.json();
  return json;
};
