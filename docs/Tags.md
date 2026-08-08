# Tags Taxonomy & Filtering Guide — SubPulse

## Tag Model & Slugs
Each tag contains `name`, `slug`, `color`, and `description`. Subscriptions support multi-tag array assignment (`tags: [TagId1, TagId2]`).

```bash
GET /api/v1/tags       # Retrieve user + system tags
POST /api/v1/tags      # Create custom tag with custom color hex
```
