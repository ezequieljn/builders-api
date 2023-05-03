import { Config } from "../../config/config";
import { HttpClientInterface } from "../http/http.client";
import { AuthGateway } from '../../auth/domain/gateway/auth.gateway.interface'

export type HttpClientLogin = {
  "token": string,
  "expires_in": string
}

export class AuthGatewayHttp
  implements AuthGateway.HttpInterface {
  constructor(private readonly httpClient: HttpClientInterface) { }

  async login(): Promise<HttpClientLogin> {
    return this.httpClient.post<HttpClientLogin>(
      `${Config.baseUrl().builders}/auth/tokens`,
      {
        "client_id": Config.token_auth().client_id,
        "client_secret": Config.token_auth().client_secret,
      }
    );
  }



}
