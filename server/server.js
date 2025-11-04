import express from 'express';
import cors from 'cors'
import 'dotenv/config'
import { clerkMiddleware } from '@clerk/express'
import { connect } from 'mongoose';
import connectDB from './config/db.js';
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"

const app = express();
const port = 3000;

await connectDB()
// middleware
app.use(express.json());
app.use(cors())
app.use(clerkMiddleware())

//api routes
app.get('/', (req,res)=> res.send("server is live"))
app.use("/api/inngest", serve({ client: inngest, functions }))

app.listen(port, ()=> console.log(`server is letining at http://localhost:${port}`));