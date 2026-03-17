import "reflect-metadata";
import { DataSource } from "typeorm";
import { Todo } from "../entities/Todo";
import path from "path";

let dataSource: DataSource | null = null;

export async function getDataSource(): Promise<DataSource> {
  if (dataSource && dataSource.isInitialized) {
    return dataSource;
  }

  const dbPath = process.env.DATABASE_PATH
    ? path.resolve(process.cwd(), process.env.DATABASE_PATH)
    : path.resolve(process.cwd(), "data", "todos.db");

  dataSource = new DataSource({
    type: "better-sqlite3",
    database: dbPath,
    synchronize: true,
    logging: false,
    entities: [Todo]
  });

  await dataSource.initialize();
  return dataSource;
}
