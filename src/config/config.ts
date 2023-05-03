import * as dotenv from "dotenv";

export class Config {
  private constructor() { }

  static init() {
    dotenv.config();
    return new Config();
  }

  static config() {
    return {
      port: Number(process.env.PORT),
    };
  }

  static database() {
    return {
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_DATABASE,
      password: process.env.DB_PASSWORD,
      port: Number(process.env.DB_PORT),
    };
  }

  static baseUrl() {
    return {
      builders: process.env.BASE_URL_BUILDERS,
    };
  }

  static token_auth() {
    return {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET
    }
  }


}
