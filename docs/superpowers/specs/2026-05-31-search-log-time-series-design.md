# Search Log Time-Series Aggregation Design Specification

## Overview
This specification details the design for tracking, caching, and batch-saving search logs in the NearbyBook project. Rather than inserting raw search logs into the PostgreSQL database in real-time, search logs are buffered in Redis using high-speed atomic operations and flushed in batches to the database via BullMQ on a periodic schedule (every 30 minutes).

## Architecture Details

```mermaid
graph TD
    User([User Request]) --> Controller[BooksController]
    Controller --> Service[BooksService]
    Service --> Redis[(Redis)]
    
    subgraph Background Batch Processing (BullMQ)
        Scheduler[SearchLogTaskService] -->|Trigger Job Every 30m| Queue[search-log Queue]
        Queue --> Worker[SearchLogProcessor]
        Worker -->|Rename Key & SREM| Redis
        Worker -->|Bulk Upsert| DB[(PostgreSQL Drizzle)]
    end
```

### 1. Database Schema (`searchLogs.ts`)
To support time-series daily aggregations of queries:
- **Columns**:
  - `id`: Auto-incrementing primary key.
  - `mode`: Search mode (`isbn`, `title`).
  - `query`: The search query text.
  - `searchDate`: The date of search (`date` type, defaults to current date in YYYY-MM-DD format).
  - `count`: Aggregated count of searches for that day.
- **Constraints**:
  - `unique("search_logs_date_query_mode_unique").on(searchDate, query, mode)` for atomic bulk upserts.

### 2. Redis Data Structure
- `search:logs:dates` (Set): Contains all dates with pending search logs.
- `search:logs:daily:[YYYY-MM-DD]` (Hash): Contains `[mode]:[query]` mapping to search frequency counts.
- `search:logs:daily:[YYYY-MM-DD]:processing` (Hash): Isolated key for in-progress batches to prevent race conditions.

### 3. BullMQ Batch Pipeline
- **Queue**: `search-log`
- **Scheduler**: `flush-search-logs` (runs every 30 minutes)
- **Job Processing Logic**:
  1. Retrieve all dates from `search:logs:dates`.
  2. For each date:
     - Atomically rename `search:logs:daily:[date]` to `search:logs:daily:[date]:processing`.
     - Remove date from `search:logs:dates` set using `SREM`.
     - Retrieve all field-values from `search:logs:daily:[date]:processing` using `HGETALL`.
     - Formulate Bulk Upsert values for Drizzle ORM.
     - Execute `drizzle.insert().values().onConflictDoUpdate()`.
     - On successful database save, delete the processing key.
