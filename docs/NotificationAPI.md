# Notification API Reference Catalog — SubPulse

## Notification Endpoints (`/api/v1/notifications`)

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/` | Yes | List user in-app notifications |
| `GET` | `/unread` | Yes | List unread notifications |
| `GET` | `/unread/count` | Yes | Get count of unread notifications |
| `PATCH` | `/:id/read` | Yes | Mark specific notification as read (`readAt = Date`) |
| `PATCH` | `/read-all` | Yes | Mark all notifications as read |
| `DELETE` | `/:id` | Yes | Delete notification |
| `POST` | `/worker` | Verified | Process asynchronous delivery job |

---

## Preference Endpoints (`/api/v1/notification-preferences`)

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/` | Yes | Retrieve user notification preferences |
| `PUT` | `/` | Yes | Update user notification preferences |
