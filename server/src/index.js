const express = require('express');
const session = require('express-session');
const sliderCaptcha = require('@slider-captcha/core');

const app = express();
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'sess-secret',
    resave: false,
    saveUninitialized: true,
  }),
);

app.get('/captcha/create', function (req, res) {
  sliderCaptcha.create().then(function ({ data, solution }) {
    req.session.captcha = solution;
    req.session.save();
    res.status(200).send(data);
  });
});

app.post('/captcha/verify', function (req, res) {
  console.log(req.session);
  sliderCaptcha
    .verify(req.session.captcha, req.body)
    .then(function (verification) {
      if (verification.result === 'success') {
        req.session.token = verification.token;
        req.session.save();
      }
      res.status(200).send(verification);
    });
});

const port = process.env.PORT || 6600;

app.listen(port, () => console.log(`listening on ${port}`));
