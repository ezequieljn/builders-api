import { AuthRepository } from '../../auth/domain/repository/auth.repository.interface'

export type Token = {
  token: string;
  expires_in: string;
};

export class AuthRepositoryMemory
  implements AuthRepository.DatabaseInterface {
  private value: Token
  private static instance: AuthRepositoryMemory;
  constructor() { }

  static getInstance(): AuthRepositoryMemory {
    if (!AuthRepositoryMemory.instance) {
      AuthRepositoryMemory.instance = new AuthRepositoryMemory();
    }
    return AuthRepositoryMemory.instance;
  }


  async save(props: Token): Promise<void> {
    this.value = props
  }

  async get(): Promise<string> {
    if (!this.value) {
      return null
    }
    if (new Date(this.value.expires_in).getTime() < new Date().getTime()) {
      return null
    }
    return this.value.token
  }
}
