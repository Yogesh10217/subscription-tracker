# Categories Taxonomy Guide — SubPulse

## System & Custom Categories
SubPulse supports both global system categories and user-defined custom categories:
- **System Categories**: Streaming, Music, Gaming, Cloud, Education, Software, Productivity, Utilities, Finance, Shopping.
- **Custom Categories**: Created via `POST /api/v1/categories`.

---

## API Catalog
```bash
GET /api/v1/categories       # List all available system + user categories
POST /api/v1/categories      # Create new custom category
PUT /api/v1/categories/:id   # Edit custom category
DELETE /api/v1/categories/:id# Delete custom category
```
