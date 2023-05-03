import { PaymentSlipEntity } from "../../payment/domain/entity/payment.entity";
import { PaymentRepository } from "../../payment/domain/repository/payment-slip.repository.interface";

export class PaymentRepositoryMemory
    implements PaymentRepository.DatabaseInterface {
    paymentEntities: PaymentSlipEntity[] = [];
    constructor() { }

    async save(entity: PaymentSlipEntity): Promise<void> {
        this.paymentEntities.push(entity);
    }
    async find(): Promise<PaymentSlipEntity[]> {
        return this.paymentEntities;
    }

}
