# Subscription Management 2.0 Enterprise Guide — SubPulse

## Overview
SubPulse Subscription Management 2.0 provides an enterprise domain model for managing subscription lifecycles, trial tracking, service provider catalogs, categories, tags, file assets, reminder rules, activity timelines, multi-stage CSV/JSON imports, and advanced search query execution.

---

## 🔄 Subscription Status Lifecycle
- `Draft`: Initial setup or unconfirmed subscription.
- `Trial`: Active trial period with auto-conversion reminder tracking.
- `Active`: Paid active subscription.
- `Paused`: Temporarily paused subscription.
- `Cancelled`: User or provider cancelled subscription.
- `Expired`: Past-due renewal date without auto-renewal.
- `Archived`: Archived from main view for long-term historical record.
- `Deleted`: Soft-deleted subscription.

---

## 🗂️ Domain Relationships Diagram

```
┌──────────────────────────────────────────────────────────┐
│                      Subscription                        │
├──────────────────────────────────────────────────────────┤
│ - name, price, currency, frequency, status, paymentMethod│
│ - isTrial, trialStartDate, trialEndDate                  │
│ - isFavorite, isPinned, isArchived, isDeleted            │
└────────┬───────────┬────────────┬─────────────┬──────────┘
         │           │            │             │
┌────────▼──┐  ┌─────▼─────┐ ┌────▼──────┐ ┌────▼─────┐
│ Category  │  │    Tag    │ │ Provider  │ │ FileAsset │
└───────────┘  └───────────┘ └───────────┘ └───────────┘
```
