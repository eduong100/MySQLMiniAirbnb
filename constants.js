import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
export const PORT = process.env.PORT || 3000;
export const DB_CONFIG = {
  host: process.env.HOST,
  user: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  multipleStatements: true,
};
export const SECRET = process.env.SECRET;
export const MAX_AGE = 3600000;
export const MYSQL_ERROR =
  "<h1>ERROR 404: An error has occured with the MySQL server please try again</h1>";
