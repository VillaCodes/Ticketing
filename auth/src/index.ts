import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import mongoose from 'mongoose';
import cookieSession from 'cookie-session';

import { currentUserRouter } from './routes/current-user';
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { errorHandler } from './middlewares/error-handler';
import { NotFoundError } from './errors/not-found-error';

const app = express();
//lets express know that we are behind a proxy of ingress nginx
//it should trust traffic of being secure despite coming from proxy
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    //disables encryption
    signed: false,
    //require that cookies will only be used if user is visiting over an http connection
    secure: true
  })
);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  
  try {
    await mongoose.connect('mongodb://auth-mongo-srv:27017/auth');
    console.log('Connected to MongoDB')
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log('Listening on PORT 3000!')
  });
};

start();