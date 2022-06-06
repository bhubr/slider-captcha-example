const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const sliderCaptcha = require('@slider-captcha/core');

const app = express();
app.use(morgan('dev'));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'sess-secret',
    resave: false,
    saveUninitialized: true,
  }),
);

app.get('/captcha/create', async function (req, res) {
  const { data, solution } = await sliderCaptcha.create();
  console.log(solution, data);
  req.session.captcha = solution;
  req.session.save();
  res.status(200).send(data);
});

app.post('/captcha/verify', async function (req, res) {
  console.log(req.session);
  const verification = await sliderCaptcha.verify(
    req.session.captcha,
    req.body,
  );
  if (verification.result === 'success') {
    req.session.token = verification.token;
    req.session.save();
  }
  res.status(200).send(verification);
});

const port = process.env.PORT || 6600;

app.listen(port, () => console.log(`listening on ${port}`));
