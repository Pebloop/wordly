import type { Config } from "drizzle-kit";
import 'dotenv/config';

export default {
    schema: "./src/lib/database/postgres/schemas",
    out: ".drizzle",
    driver: "pg",
    dbCredentials: {
        connectionString: process.env.DATABASE_URL || "",
    },
} satisfies Config;
