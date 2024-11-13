import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pg from "pg";
import env from "../env.js";
async function runMigration() {
    console.log("Migration started ⌛");
    // Not using the getDbUrl helper function because we aren't copying that into our runtime app prior to deployment in our Dockerfile. We'll live with the code duplication.
    const dbUrl = (env.DATABASE_URL);
    if (!dbUrl)
        throw new Error("No database url found");
    const pool = new pg.Pool({
        connectionString: env.DATABASE_URL,
    });
    const db = drizzle({
        client: pool,
    });
    try {
        await migrate(db, { migrationsFolder: "./src/db/migrations" });
        console.log("Migration completed ✅");
    }
    catch (error) {
        console.error("Migration failed 🚨:", error);
    }
    finally {
        await db.$client.end();
    }
}
runMigration().catch(error => console.error("Error in migration process 🚨:", error));
