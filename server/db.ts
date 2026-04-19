import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "@shared/schema";
import path from "path";

const DB_PATH = path.resolve(process.cwd(), "data.db");
const sqlite = new Database(DB_PATH);

// Enable WAL mode for better performance
sqlite.pragma("journal_mode = WAL");

export const db = drizzle(sqlite, { schema });

// Create tables if they don't exist
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT NOT NULL,
    date_of_birth TEXT NOT NULL,
    gender TEXT NOT NULL,
    home_address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    id_type TEXT NOT NULL,
    id_number TEXT NOT NULL,
    nok_name TEXT NOT NULL,
    nok_phone TEXT NOT NULL,
    nok_relationship TEXT NOT NULL,
    password TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS loan_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER NOT NULL,
    item_name TEXT NOT NULL,
    item_category TEXT NOT NULL,
    item_description TEXT NOT NULL,
    item_condition TEXT NOT NULL,
    estimated_value REAL NOT NULL,
    requested_amount REAL NOT NULL,
    preferred_duration TEXT NOT NULL,
    appraised_value REAL,
    offered_amount REAL,
    interest_rate REAL,
    duration_days INTEGER,
    total_repayment REAL,
    staff_notes TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TEXT NOT NULL,
    reviewed_at TEXT
  );
`);
