# movie-reservation-system-backendapi

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run src/index.ts
```

erDiagram
    USERS {
        UUID user_id PK
        string name
        string email
        string password_hash
        string mobile_number
        string role
        datetime created_at
    }

    THEATRE {
        UUID theatre_id PK
        string name
        string city
        string address
        UUID admin_id FK
    }

    SCREEN {
        UUID screen_id PK
        UUID theatre_id FK
        string name
        string screen_type
        int capacity
    }

    SEAT {
        UUID seat_id PK
        UUID screen_id FK
        string row_label
        int seat_number
        string seat_type
    }

    MOVIE {
        UUID movie_id PK
        string title
        string description
        int duration_min
        string language
        string genres
        string actors
        date release_date
        date end_date
    }

    SHOWTIME {
        UUID showtime_id PK
        UUID movie_id FK
        UUID screen_id FK
        datetime start_time
        datetime end_time
        int base_price
        string status
    }

    BOOKING {
        UUID booking_id PK
        UUID user_id FK
        UUID showtime_id FK
        string status
        int total_amount
        datetime created_at
    }

    BOOKING_SEAT {
        UUID booking_seat_id PK
        UUID booking_id FK
        UUID seat_id FK
        int price
    }

    %% RELATIONSHIPS

    USERS ||--o{ THEATRE : "manages"
    USERS ||--o{ BOOKING : "makes"

    THEATRE ||--o{ SCREEN : "has"
    SCREEN ||--o{ SEAT : "contains"

    SCREEN ||--o{ SHOWTIME : "hosts"
    MOVIE  ||--o{ SHOWTIME : "is_scheduled_in"

    SHOWTIME ||--o{ BOOKING : "has"
    BOOKING  ||--o{ BOOKING_SEAT : "includes"

    SEAT ||--o{ BOOKING_SEAT : "is_reserved_in"


This project was created using `bun init` in bun v1.3.3. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
