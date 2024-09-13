import express from 'express'
import { config } from 'dotenv'
import path from 'path'
import {initiateApp} from './src/units/initiateApp.js'
config({path: path.resolve('./config/config.env')})


console.log('Port:', process.env.PORT);
console.log('MongoDB URI:', process.env.MONGO_URI);

const app = express()

initiateApp(app,express)