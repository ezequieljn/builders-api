import { PaymentSlipEntity } from "payment/domain/entity/payment.entity";

export class MapperOutputDto {
  private constructor() { }
  static toJSON(entities: PaymentSlipEntity[]) {
    return entities.map(entity => ({
      original_amount: entity.amount,
      amount: entity.totalAmountWithFine,
      due_date: this.formatTheDate(entity.dueDate),
      payment_date: this.formatTheDate(entity.paymentDate),
      interest_amount_calculated: entity.interestAmountCalculated,
      fine_amount_calculated: entity.fineAmountCalculated,
    }))
  }

  private static formatTheDate(date: Date) {
    return date.toISOString().slice(0, 10)
  }

}
