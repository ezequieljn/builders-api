export interface HttpClientInterface {
  get(url: string): Promise<any>;
  post<T = any>(url: string, body: any, props?: any): Promise<T>;
}
