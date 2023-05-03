import { PaymentRepository } from "payment/domain/repository/payment-slip.repository.interface";
import { MapperOutputDto } from "./mapper.dto";

export namespace GetCalculations {

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
    ) { }

    async execute(): Promise<Output[]> {
      const paymentsEntity = await this.paymentRepository.find();
      return MapperOutputDto.toJSON(paymentsEntity);
    }
  }
}
