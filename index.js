import express from 'express'
import { config } from 'dotenv'
import path from 'path'
import {initiateApp} from './src/utilities/initiateApp.js'
config({path: path.resolve('./config/.env')})

const app = express()
initiateApp(app,express)