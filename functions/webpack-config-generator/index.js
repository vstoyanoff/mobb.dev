const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const bodyParser = require('body-parser');
const rimraf = require('rimraf');
const generateFiles = require('./lib/generateFiles');
const verifyRecaptcha = require('./lib/verifyRecaptcha.js');

const app = express().use(
  '*',
  cors({
    origin: 'https://mobb.dev',
    optionsSuccessStatus: 200,
  })
);

app.get('/download', (req, res) => {
  const id = req.query.id;
  res.download(`./generated/${id}.zip`);
});

app.get('/remove', (req, res) => {
  const id = req.query.id;
  rimraf.sync(`./generated/${id}.zip`);
  res.status(200);
});

app.post('/generate', bodyParser.json(), async (req, res, next) => {
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
});

module.exports.handler = serverless(app);
