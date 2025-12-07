-- CreateTable
CREATE TABLE "User" (
    "user_id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "mobile_num" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Theatre" (
    "theatre_id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "admin_id" TEXT,
    CONSTRAINT "Theatre_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "User" ("user_id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Screen" (
    "screen_id" TEXT NOT NULL PRIMARY KEY,
    "theatre_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "screen_type" TEXT NOT NULL,
    "capacity" INTEGER NOT NULL,
    CONSTRAINT "Screen_theatre_id_fkey" FOREIGN KEY ("theatre_id") REFERENCES "Theatre" ("theatre_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Seat" (
    "seat_id" TEXT NOT NULL PRIMARY KEY,
    "screen_id" TEXT NOT NULL,
    "row_label" TEXT NOT NULL,
    "seat_number" INTEGER NOT NULL,
    "seat_type" TEXT NOT NULL,
    CONSTRAINT "Seat_screen_id_fkey" FOREIGN KEY ("screen_id") REFERENCES "Screen" ("screen_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Movie" (
    "movie_id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "duration_min" INTEGER NOT NULL,
    "genres" TEXT NOT NULL,
    "actors" TEXT NOT NULL,
    "release_date" DATETIME NOT NULL,
    "end_date" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Showtime" (
    "showtime_id" TEXT NOT NULL PRIMARY KEY,
    "movie_id" TEXT NOT NULL,
    "screen_id" TEXT NOT NULL,
    "start_time" DATETIME NOT NULL,
    "end_time" DATETIME NOT NULL,
    "base_price" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    CONSTRAINT "Showtime_movie_id_fkey" FOREIGN KEY ("movie_id") REFERENCES "Movie" ("movie_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Showtime_screen_id_fkey" FOREIGN KEY ("screen_id") REFERENCES "Screen" ("screen_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Booking" (
    "booking_id" TEXT NOT NULL PRIMARY KEY,
    "user_id" TEXT NOT NULL,
    "showtime_id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "total_amount" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Booking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User" ("user_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Booking_showtime_id_fkey" FOREIGN KEY ("showtime_id") REFERENCES "Showtime" ("showtime_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "BookingSeat" (
    "booking_seat_id" TEXT NOT NULL PRIMARY KEY,
    "booking_id" TEXT NOT NULL,
    "seat_id" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    CONSTRAINT "BookingSeat_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "Booking" ("booking_id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "BookingSeat_seat_id_fkey" FOREIGN KEY ("seat_id") REFERENCES "Seat" ("seat_id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Seat_screen_id_row_label_seat_number_key" ON "Seat"("screen_id", "row_label", "seat_number");

-- CreateIndex
CREATE UNIQUE INDEX "BookingSeat_booking_id_seat_id_key" ON "BookingSeat"("booking_id", "seat_id");
