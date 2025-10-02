import Subscription from "../models/subscription.model.js";
import { workflowClient } from "../config/upstash.js";
//import { SERVER_URL } from "../config/env.js";

export const createSubscription=async(req,res,next)=>{
  try{
    const subscription=await Subscription.create({
      ...req.body,
      user:req.user._id,
    });
    
    // Configure QStash trigger
    console.log('Creating workflow for subscription:', subscription.id);
    const webhookUrl = `${process.env.SERVER_URL}/api/v1/workflows/subscription/reminder`;
    console.log('Using webhook URL:', webhookUrl);
    
    const response = await workflowClient.trigger({
      url: webhookUrl,
      body: {
        subscriptionId: subscription.id,
        userId: req.user._id
      },
      headers: {
        'Content-Type': 'application/json'
      },
      retries: 3,
      cron: "0 12 * * *"  // Run at 12:00 PM every day
    });
    
    console.log('QStash Response:', JSON.stringify(response, null, 2));
    const workflowId = response.scheduleId || response.messageId || response.id;

    res.status(201).json({
      success:true,
      data: {
        subscription,
        workflowId,
        qstashResponse: response // include full response for debugging
      }
    });
  }catch(e){
    next(e);
  }

}
export const getUserSubscriptions=async(req,res,next)=>{
  try{
    if(req.user._id.toString()!==req.params.id.toString()){
      const error=new Error("You are not the owner of this account");
      error.statusCode=401;
      throw error;
    }
    const subscriptions=await Subscription.find({user:req.params.id});
    res.status(200).json({
      success:true,
      data:subscriptions,
    });
  }catch(e){
    next(e);
  }
}