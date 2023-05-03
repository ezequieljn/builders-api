import axios from "axios";
import { HttpClientInterface } from "./http.client";

export class AxiosAdapter implements HttpClientInterface {
  constructor() { }

  async get(url: string): Promise<any> {
    const response = await axios.get(url);
    return response.data;
  }

  async post(url: string, body: any, props = {}): Promise<any> {
    const response = await axios.post(url, body, props);
    return response.data;
  }
}
