type method = "post" | "get";

export interface HttpServer {
  on(method: method, url: string, callback: Function): void;
  listen(port: number): void;
}
