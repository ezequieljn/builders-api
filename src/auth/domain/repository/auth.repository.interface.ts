
export namespace AuthRepository {
  export type AuthSaveInputProps = {
    token: string;
    expires_in: string;
  }

  export type AuthGetOutputProps = string
  export type DatabaseInterface = {
    save(props: AuthSaveInputProps): Promise<void>;
    get(): Promise<AuthGetOutputProps>;
  };
}
