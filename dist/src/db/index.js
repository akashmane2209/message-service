import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import env from "../env.js";
import * as schema from "./schema.js";
const pool = new pg.Pool({
    connectionString: env.DATABASE_URL,
});
const db = drizzle({
    schema,
    client: pool,
});
export default db;
