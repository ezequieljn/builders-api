import { GetCalculations } from "./get-calculations.usecase";
import { PaymentRepositoryMemory } from "../../../infra/repository/payment.repository-memory";
import { PaymentSlipEntity } from "../../domain/entity/payment.entity";

describe("GetCalculations UseCase Test", () => {
  let useCase: GetCalculations.UseCase;
  let paymentRepository: PaymentRepositoryMemory;

  beforeEach(() => {
    paymentRepository = new PaymentRepositoryMemory();
    useCase = new GetCalculations.UseCase(paymentRepository);
  });

  it("should return empty payment-slip", async () => {
    useCase = new GetCalculations.UseCase(paymentRepository);
    const result = await useCase.execute();
    expect(result).toStrictEqual([]);
  });

  it("should return all saved payment-slips", async () => {
    paymentRepository.save(
      new PaymentSlipEntity({
        type: "NPC",
        code: "123456",
        dueDate: new Date("2023-01-01"),
        paymentDate: new Date("2023-01-11"),
        amount: 100,
        recipient: {
          name: "Company Fake",
          document: "10101010",
        },
      })
    );
    useCase = new GetCalculations.UseCase(paymentRepository);
    const result = await useCase.execute();
    expect(result).toStrictEqual([
      {
        amount: 102.33,
        due_date: "2023-01-01",
        fine_amount_calculated: 2.33,
        interest_amount_calculated: 2.33,
        original_amount: 100,
        payment_date: "2023-01-11",
      },
    ]);
  });
});
