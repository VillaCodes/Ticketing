import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
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
    //we set a check below to let cookies be sent inside of the test environment
    secure: process.env.NODE_ENV !== 'test'
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

export { app };