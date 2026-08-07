import { Router } from "express";
import authorize from "../middleware/auth.middleware.js";
import {
  createSubscription,
  getUserSubscriptions,
  getAllSubscriptions,
  getSubscriptionDetails,
  updateSubscription,
  deleteSubscription,
  cancelSubscription,
  getUpcomingRenewals
} from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.get("/", getAllSubscriptions);
subscriptionRouter.get("/upcoming-renewals", getUpcomingRenewals);
subscriptionRouter.get("/user/:id", authorize, getUserSubscriptions);
subscriptionRouter.get("/:id", getSubscriptionDetails);
subscriptionRouter.post("/", authorize, createSubscription);
subscriptionRouter.put("/:id/cancel", authorize, cancelSubscription);
subscriptionRouter.put("/:id", authorize, updateSubscription);
subscriptionRouter.delete("/:id", authorize, deleteSubscription);

export default subscriptionRouter;