import express from "express";

import {PORT} from './config/env.js';

import userRouter  from "./routes/user.routes.js";  
import  authRouter from './routes/auth.routes.js';
import subscriptionRouter from './routes/subscription.routes.js';
import connectToDatabase from "./Database/mongodb.js";
import errorMiddleware from "./Middleware/error.middleware.js";
import cookieParser from "cookie-parser";
import arcjetMiddleware from "./middleware/arcjet.middleware.js";
import workflowRouter from "./routes/workflow.routes.js";


const app=express();

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());
app.use(arcjetMiddleware);

app.use('/api/v1/auth',authRouter);
app.use('/api/v1/users',userRouter);
app.use('/api/v1/subscriptions',subscriptionRouter);
app.use('/api/v1/workflows',workflowRouter);

app.use(errorMiddleware);



app.get('/',(req,res)=>{
  res.send('welcome to subscription Tracker API!');
});


app.listen(PORT,async()=>{
  console.log(`Subscription-tracker is running on http://localhost:${PORT}`);

  await connectToDatabase();
});
 export default app;



// 🔧 How to fix for development with Postman

// Since you obviously need to test APIs with Postman (without constantly being blocked), you can:

// ✅ Option 1: Use DRY_RUN in dev
// detectBot({
//   mode: "DRY_RUN", // just logs detections, doesn’t block
//   allow: ["CATEGORY:SEARCH_ENGINE"], // must not be empty
// }),


// This way, Arcjet will still tell you if it thinks Postman is a bot, but won’t block you.