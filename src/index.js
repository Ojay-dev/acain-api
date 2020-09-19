import '@babel/polyfill';
import express from 'express';
import dotenv from 'dotenv';

import configureApp from './config/app';
import configureDB from './config/db';

dotenv.config();

const app = express();
configureApp(app);
configureDB();

export default { app };
