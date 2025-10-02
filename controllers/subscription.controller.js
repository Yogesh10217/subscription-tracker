import Subscription from "../models/subscription.model.js";
import { workflowClient } from "../config/upstash.js";
import { SERVER_URL } from "../config/env.js";

export const createSubscription=async(req,res,next)=>{
  try{
    const subscription=await Subscription.create({
      ...req.body,
      user:req.user._id,
    });
    
    // Configure QStash trigger
    const response = await workflowClient.trigger({
      url: `${SERVER_URL}/api/v1/workflow/subscription/reminder`,
      body: {
        subscriptionId: subscription.id
      },
      headers: {
        'Content-Type': 'application/json'
      },
      retries: 3
    });
    
    console.log('QStash Response:', response);
    const workflowId = response.messageId || response.workflowId; // try both possible fields

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