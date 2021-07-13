const globalError = require('./controllers/errorController');
const express = require('express');
const app = express();
const productRouter = require('./router/productRouter');
const apiError = require('./utils/apiError');
const userRouter = require('./router/userRouter');
const reviewRouter = require('./router/reviewRouter');
const cookie = require('cookie-parser');
const hpp = require('hpp');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const ratelimit = require('express-rate-limit');
const path = require('path');
const viewRouter = require('./router/viewRouter');
const cartRouter = require('./router/cartRouter');
const orderRouter = require('./router/orderRouter');
const compression = require('compression');
// const orderController = require('./controllers/orderController');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

const limit = ratelimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'too many request, try again in an hour!!',
});
app.use('/api', limit);

// Body Parser Middlewere
// app.post(
//   '/webhook-checkout',
//   express.raw({ type: 'application/json' }),
//   orderController.webhookCheckout
// );

app.use(express.json({ limit: '10kb' }));

app.use(helmet());
app.use(cookie());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
app.use(express.static(path.join(__dirname, 'public')));
app.use(compression());
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "script-src 'self' https://js.stripe.com/v3/ 'unsafe-inline' 'unsafe-eval';"
  );
  next();
});
// Routers

app.use('/', viewRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/cart', cartRouter);
app.use('/api/v1/order', orderRouter);

// Global Error Will be call whenever there will be an error

app.use('*', (req, res, next) => {
  next(new apiError('Bad url', 404));
});

app.use(globalError);

module.exports = app;
