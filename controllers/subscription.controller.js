import Subscription from "../models/Subscription.model.js";
import { workflowClient } from "../config/upstash.js";

export const createSubscription=async(req,res,next)=>{
  try{
    const subscription=await Subscription.create({
      ...req.body,
      user:req.user._id,
    });
    await workflowClient.trigger({
      url:`${SERVER_URL}`
    })

    res.status(201).json({
      success:true,
      data:subscription,
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