import express from 'express';
import cors from 'cors'
import 'dotenv/config'
import { clerkMiddleware } from '@clerk/express'
import { connect } from 'mongoose';
import connectDB from './config/db.js';
import { serve } from "inngest/express";
import { inngest, functions } from "./inngest/index.js"
import showRouter from './routes/showRoutes.js';
import bookingRouter from './routes/bookingroutes.js';
import adminRouter from './routes/Adminroutes.js';
import userRouter from './routes/userroutes.js';
import { stripeWebhooks } from './controller/stripewebhook.js';

const app = express();
const port = 3000;

await connectDB()

//stripe webhooks routes
app.use('/api/stripe', express.raw({
    type: "application/json"
}), stripeWebhooks)


// middleware
app.use(express.json());
app.use(cors())
app.use(clerkMiddleware())

//api routes
app.get('/', (req,res)=> res.send("server is live"))
app.use("/api/inngest", serve({ client: inngest, functions }))

app.use('/api/show', showRouter)
app.use('/api/bookings', bookingRouter)
app.use('/api/admin', adminRouter)
app.use('/api/user', userRouter)

app.listen(port, ()=> console.log(`server is letining at http://localhost:${port}`));