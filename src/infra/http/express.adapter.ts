import { HttpServer } from "./http.server";
import express, { Request, Response } from "express";
import cors from "cors";

export class ExpressAdapter implements HttpServer {
  app: any;

  constructor() {
    this.app = express();
    this.app.use(express.json());
    this.app.use(cors());
  }

  on(method: string, url: string, callback: Function): void {
    this.app[method](
      url,
      async function (request: Request, response: Response) {
        try {
          const output = await callback(
            request.params,
            request.body,
            request.query,
            response
          );
          response.json(output);
        } catch (e: any) {
          response.status(422).json({
            message: e.message,
          });
        }
      }
    );
  }

  listen(port: number): void {
    console.log("started server");
    this.app.listen(port);
  }
}
