import { PaymentSlipEntity } from "../../payment/domain/entity/payment.entity";
import { PaymentRepository } from "../../payment/domain/repository/payment-slip.repository.interface";
import { Connection } from "../../infra/database/connection";

export type PaymentRepositoryProps = {
  code: string;
  due_date: string;
  amount: number;
  recipient_name: string;
  recipient_document: string;
  type: string;
  payment_date: string;
};

export class PaymentRepositoryPg
  implements PaymentRepository.DatabaseInterface
{
  constructor(private readonly connection: Connection) {}
  async save(entity: PaymentSlipEntity): Promise<void> {
    await this.connection.query(
      `INSERT INTO bank_payment_slip (
        code, 
        due_date, 
        payment_date,
        amount,
        total_amount_with_fine,
        interest_amount_calculated,
        fine_amount_calculated,
        recipient_name,
        recipient_document,
        type) 
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [
        entity.code,
        this.formatTheDate(entity.dueDate),
        this.formatTheDate(entity.paymentDate),
        entity.amount,
        entity.totalAmountWithFine,
        entity.interestAmountCalculated,
        entity.fineAmountCalculated,
        entity.recipientName,
        entity.recipientDocument,
        entity.type,
      ]
    );
  }

  async find(): Promise<PaymentSlipEntity[]> {
    const data = await this.connection.query(
      `SELECT * FROM bank_payment_slip ORDER BY created_at DESC`
    );
    return data
      ? data.map(
          (item: PaymentRepositoryProps) =>
            new PaymentSlipEntity({
              type: item.type,
              code: item.code,
              dueDate: new Date(item.due_date),
              paymentDate: new Date(item.payment_date),
              amount: item.amount,
              recipient: {
                name: item.recipient_name,
                document: item.recipient_document,
              },
            })
        )
      : [];
  }

  private formatTheDate(date: Date) {
    return date.toISOString().slice(0, 10);
  }
}
