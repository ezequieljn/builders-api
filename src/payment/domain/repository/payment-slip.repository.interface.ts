import { PaymentSlipEntity } from "../entity/payment.entity";

export namespace PaymentRepository {
  export type DatabaseInterface = {
    save(entity: PaymentSlipEntity): Promise<void>;
  };
}
