import Subscription from "../models/Subscription.model.js";
import { workflowClient } from "../config/upstash.js";

export const createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user ? req.user._id : req.body.user,
    });

    let response = null;
    let workflowId = null;

    try {
      if (workflowClient && process.env.SERVER_URL) {
        console.log('Creating workflow for subscription:', subscription.id);
        const webhookUrl = `${process.env.SERVER_URL}/api/v1/workflows/subscription/reminder`;
        console.log('Using webhook URL:', webhookUrl);

        response = await workflowClient.trigger({
          url: webhookUrl,
          body: {
            subscriptionId: subscription.id,
            userId: subscription.user
          },
          headers: {
            'Content-Type': 'application/json'
          },
          retries: 3,
          cron: "0 12 * * *"  // Run at 12:00 PM every day
        });

        console.log('QStash Response:', JSON.stringify(response, null, 2));
        workflowId = response?.scheduleId || response?.messageId || response?.id;
      }
    } catch (workflowErr) {
      console.warn('QStash workflow trigger warning (continuing subscription creation):', workflowErr.message);
    }

    res.status(201).json({
      success: true,
      data: {
        subscription,
        workflowId,
        qstashResponse: response
      }
    });
  } catch (e) {
    next(e);
  }
};

export const getUserSubscriptions = async (req, res, next) => {
  try {
    if (req.user && req.user._id.toString() !== req.params.id.toString()) {
      const error = new Error("You are not the owner of this account");
      error.statusCode = 401;
      throw error;
    }
    const subscriptions = await Subscription.find({ user: req.params.id }).sort({ renewalDate: 1 });
    res.status(200).json({
      success: true,
      data: subscriptions,
    });
  } catch (e) {
    next(e);
  }
};

export const getAllSubscriptions = async (req, res, next) => {
  try {
    const filter = req.user ? { user: req.user._id } : {};
    const subscriptions = await Subscription.find(filter).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: subscriptions,
    });
  } catch (e) {
    next(e);
  }
};

export const getSubscriptionDetails = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      const error = new Error("Subscription not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      success: true,
      data: subscription,
    });
  } catch (e) {
    next(e);
  }
};

export const updateSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!subscription) {
      const error = new Error("Subscription not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      success: true,
      data: subscription,
    });
  } catch (e) {
    next(e);
  }
};

export const deleteSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findByIdAndDelete(req.params.id);
    if (!subscription) {
      const error = new Error("Subscription not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      success: true,
      message: "Subscription deleted successfully",
    });
  } catch (e) {
    next(e);
  }
};

export const cancelSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      { status: "Cancelled" },
      { new: true }
    );
    if (!subscription) {
      const error = new Error("Subscription not found");
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({
      success: true,
      data: subscription,
    });
  } catch (e) {
    next(e);
  }
};

export const getUpcomingRenewals = async (req, res, next) => {
  try {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(now.getDate() + 30);

    const filter = {
      renewalDate: { $gte: now, $lte: futureDate },
      status: 'Active'
    };
    if (req.user) filter.user = req.user._id;

    const subscriptions = await Subscription.find(filter).sort({ renewalDate: 1 });
    res.status(200).json({
      success: true,
      data: subscriptions,
    });
  } catch (e) {
    next(e);
  }
};