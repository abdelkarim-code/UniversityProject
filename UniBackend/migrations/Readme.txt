# Knex Migrations - Quickstart

1. **Create a Migration**

```
npx knex migrate:make <migration_name>
```

* Creates a timestamped file in `migrations/`.

2. **Edit Migration**

* Add schema changes in `exports.up`.
* Add rollback in `exports.down`.

3. **Apply Migrations**

```
npx knex migrate:latest
```

4. **Rollback Migrations**

```
npx knex migrate:rollback
```

5. **Check Status**

```
npx knex migrate:status
```

**Notes:**

* Keep migrations in `migrations/` folder.
* Use descriptive names.
* Do not put model files here; migrations are only for DB schema changes.
