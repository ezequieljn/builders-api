
export namespace AuthGateway {
  export interface Output {
    token: string;
    expires_in: string;
  }

  export type HttpInterface = {
    login(): Promise<Output>;
  };
}
