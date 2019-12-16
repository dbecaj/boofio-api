import { config } from 'dotenv';
import * as mongoose from 'mongoose';

// Setup our .env variables
config();

// Connect to our database
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true });