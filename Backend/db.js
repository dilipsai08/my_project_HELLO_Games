import pg from "pg";
import dotenv from "dotenv";
import fs from "fs";
import Path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = Path.dirname(__filename);

dotenv.config();

const db= new pg.Pool({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,    
    ssl: {
        rejectUnauthorized: true,
        ca: fs.readFileSync(Path.join(__dirname, "isrgrootx1.pem")).toString(),
    },
})

export default db;