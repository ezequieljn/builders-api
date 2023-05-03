import { HttpServer } from "../http/http.server";
import { Response } from "express";

export class MainController {
  constructor(readonly httpServer: HttpServer) {
    httpServer.on(
      "get",
      "/",
      async (params: any, body: any, query: any, response: Response) => {
        response.status(200).json({ message: "ok" });
        return;
      }
    );
  }
}
