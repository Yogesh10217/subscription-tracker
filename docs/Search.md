# Advanced Search & Query Engine Architecture Guide — SubPulse

## Query Parameters (`GET /api/v1/subscriptions`)

| Parameter | Type | Description |
|---|---|---|
| `search` | String | Case-insensitive text search across name, category, paymentMethod |
| `status` | String | Filter by status (`Draft`, `Trial`, `Active`, `Paused`, `Cancelled`, `Expired`, `Archived`) |
| `category` | String | Filter by category name |
| `paymentMethod` | String | Filter by payment method |
| `minPrice` / `maxPrice` | Number | Price range filtering |
| `isFavorite` | Boolean | Filter pinned/favorite items |
| `sortBy` | String | Sort field (`name`, `price`, `renewalDate`, `createdAt`, `category`) |
| `order` | String | `asc` or `desc` |
| `page` / `limit` | Number | Pagination offset parameters |
