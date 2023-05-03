import { PaymentRepository } from "payment/domain/repository/payment-slip.repository.interface";
import { PaymentSlipGateway } from "../domain/gateway/payment-slip.gateway.interface";
import { MapperOutputDto } from "./mapper.dto";
import { AuthGateway } from "../../auth/domain/gateway/auth.gateway.interface";
import { AuthRepositoryMemory } from "infra/repository/auth.repository-memory";
import { AuthRepository } from "../../auth/domain/repository/auth.repository.interface";

export namespace CalculatePaymentSlipFine {
  export type Input = {
    paymentDate: Date;
    codePaymentSlip: string;
  };
  export interface Output {
    original_amount: number;
    amount: number;
    due_date: string;
    payment_date: string;
    interest_amount_calculated: number;
    fine_amount_calculated: number;
  }

  export class UseCase {
    constructor(
      private readonly paymentRepository: PaymentRepository.DatabaseInterface,
      private readonly paymentGateway: PaymentSlipGateway.HttpInterface,
      private readonly authRepository: AuthRepository.DatabaseInterface,
      private readonly authGateway: AuthGateway.HttpInterface,
    ) { }

    async execute(input: Input): Promise<Output> {
      let token = await this.authRepository.get();
      if (!token) {
        const requestToken = await this.authGateway.login()
        this.authRepository.save(requestToken)
        token = requestToken.token
      }
      const entity = await this.paymentGateway.getPaymentSlip(input, token);
      await this.paymentRepository.save(entity);
      return MapperOutputDto.toJSON(entity);
    }
  }
}
