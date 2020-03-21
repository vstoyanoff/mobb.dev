const path = require('path');
const express = require('express');
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const rimraf = require('rimraf');
const generateFiles = require('./lib/generateFiles');
const verifyRecaptcha = require('./lib/verifyRecaptcha.js');

const app = express();

app.get('/.netlify/functions/webpack-config-generator/download', (req, res) => {
  const id = req.query.id;
  res.download(path.resolve(__dirname, `./generated/${id}.zip`));
});

app.get('/.netlify/functions/webpack-config-generator/remove', (req, res) => {
  const id = req.query.id;
  rimraf.sync(path.resolve(__dirname, `./generated/${id}.zip`));
  res.status(200);
});

app.post(
  '/.netlify/functions/webpack-config-generator/generate',
  bodyParser.json(),
  async (req, res, next) => {
    if (
      req.body.gResp === '' ||
      req.body.gResp === undefined ||
      req.body.gResp === null
    ) {
      res.status(400);
      res.send({ error: 'Select google recaptcha' });
      return;
    }

    const recaptchaResponse = await verifyRecaptcha(req.body.gResp);

    if (!recaptchaResponse.success || recaptchaResponse.success === 'false') {
      res.status(400);
      res.send({ error: 'Invalid recaptcha' });
      return;
    }

    const id = await generateFiles(req.body);
    res.status(200);
    res.send({ id });
  }
);

module.exports.handler = serverless(app);
