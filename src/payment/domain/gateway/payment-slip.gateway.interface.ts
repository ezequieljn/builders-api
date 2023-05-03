import { PaymentSlipEntity } from "../entity/payment.entity";

export namespace PaymentSlipGateway {
  export interface GetPaymentSlipInput {
    paymentDate: Date;
    codePaymentSlip: string;
  }

  export type HttpInterface = {
    getPaymentSlip(input: GetPaymentSlipInput, token: string): Promise<PaymentSlipEntity>;
  };
}
