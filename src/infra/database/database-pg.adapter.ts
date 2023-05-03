import { Config } from "../../config/config";
import { Connection } from "./connection";
import pgp from "pg-promise";

export class PgPromise implements Connection {
  connection: any;

  constructor() {
    const { database, host, password, port, user } = Config.database();
    this.connection = pgp()(
      `postgres://${user}:${password}@${host}:${port}/${database}`
    );
  }

  async query(statement: string, params: any): Promise<any> {
    return this.connection.query(statement, params);
  }

  async close(): Promise<void> {
    await this.connection.$pool.end();
  }
}
