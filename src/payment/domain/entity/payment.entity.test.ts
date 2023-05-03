import { PaymentSlipEntity } from "./payment.entity";

describe("PaymentEntity", () => {
  it("should be defined", () => {
    const currentDate = new Date();
    const payment = new PaymentSlipEntity({
      code: "123",
      type: "NPC",
      recipient: {
        name: "Company",
        document: "456",
      },
      dueDate: currentDate,
      amount: 100,
      paymentDate: currentDate,
    });

    expect(payment).toBeDefined();
    expect(payment.code).toBe("123");
    expect(payment.amount).toBe(100);
    expect(payment.paymentDate).toStrictEqual(currentDate);
    expect(payment.recipientName).toBe("Company");
    expect(payment.recipientDocument).toBe("456");
  });

  it("should return error of type entity", () => {
    try {
      new PaymentSlipEntity({
        code: "123",
        type: "NORMAL",
        dueDate: new Date(),
        amount: 100,
        paymentDate: new Date(),
        recipient: {
          name: "Company",
          document: "456",
        },
      });
    } catch (error: any) {
      expect(error.message).toBe("Payment slip type must be NPC");
    }
  });

  it("should return error of due date entity", () => {
    try {
      new PaymentSlipEntity({
        code: "123",
        type: "NORMAL",
        dueDate: new Date(new Date().getTime() + 5000),
        amount: 100,
        paymentDate: new Date(),
        recipient: {
          name: "Company",
          document: "456",
        },
      });
    } catch (error: any) {
      expect(error.message).toBe("Payment date must be greater than due date");
    }
  });

  it("should calculate lateFees", () => {
    const currentDate = new Date();
    let payment = new PaymentSlipEntity({
      code: "123",
      type: "NPC",
      amount: 100,
      dueDate: new Date(currentDate.getTime() - 1000),
      paymentDate: currentDate,
      recipient: {
        name: "Company",
        document: "456",
      },
    });
    expect(payment["lateFees"]()).toBe(2);
  });

  describe("should calculate daily fine", () => {
    const values = [
      {
        currentDate: new Date("2023-01-31"),
        amount: 100,
        expected: 1,
      },
      {
        currentDate: new Date("2023-01-31"),
        amount: 200,
        expected: 2,
      },
      {
        currentDate: new Date("2023-01-16"),
        amount: 200,
        expected: 1,
      },
      {
        currentDate: new Date("2023-01-11"),
        amount: 300,
        expected: 1,
      },
      {
        currentDate: new Date("2023-01-11"),
        amount: 100,
        expected: 0.33,
      },
      {
        currentDate: new Date("2023-01-11"),
        amount: 250,
        expected: 0.83,
      },
    ];

    test.each(values)(
      "when is current date $currentDate and amount $amount should be $expected of fine",
      ({ currentDate, amount, expected }) => {
        const dueDate = new Date("2023-01-01");
        const payment = new PaymentSlipEntity({
          code: "123",
          type: "NPC",
          amount,
          dueDate,
          paymentDate: currentDate,
          recipient: {
            name: "Company",
            document: "456",
          },
        });
        expect(payment["dailyFine"]()).toBe(expected);
      }
    );
  });

  describe("should calculate fine amount", () => {
    const values = [
      {
        currentDate: new Date("2023-01-31"),
        amount: 100,
        expected: 3,
      },
      {
        currentDate: new Date("2023-01-31"),
        amount: 300,
        expected: 9,
      },
      {
        currentDate: new Date("2023-01-16"),
        amount: 300,
        expected: 7.5,
      },
      {
        currentDate: new Date("2023-03-02"),
        amount: 300,
        expected: 12,
      },
      {
        currentDate: new Date("2023-07-12"),
        amount: 437,
        expected: 36.71,
      },
    ];

    test.each(values)(
      "when is current date $currentDate and amount $amount should be $expected of fine",
      ({ currentDate, amount, expected }) => {
        const paymentDate = new Date("2023-01-01");
        const payment = new PaymentSlipEntity({
          code: "123",
          type: "NPC",
          amount,
          dueDate: paymentDate,
          paymentDate: currentDate,
          recipient: {
            name: "Company",
            document: "456",
          },
        });
        (payment as any).currentDate = () => currentDate;
        expect(payment.fineAmountCalculated).toBe(expected);
      }
    );
  });

  describe("should return all calculated values", () => {
    const payments = [
      {
        value: {
          amount: 100,
          paymentDate: new Date("2023-01-31"),
        },
        expected: {
          amount: 100,
          totalAmountWithFine: 103,
          fineAmountCalculated: 3,
          interestAmountCalculated: 3,
        },
      },
      {
        value: {
          amount: 437,
          paymentDate: new Date("2023-05-08"),
        },
        expected: {
          amount: 437,
          totalAmountWithFine: 464.24,
          fineAmountCalculated: 27.24,
          interestAmountCalculated: 6.23,
        },
      },
      {
        value: {
          amount: 2351.32,
          paymentDate: new Date("2025-05-07"),
        },
        expected: {
          amount: 2351.32,
          totalAmountWithFine: 3070.04,
          fineAmountCalculated: 718.72,
          interestAmountCalculated: 30.57,
        },
      },
    ];

    test.each(payments)(
      "should calculate with delay value of: $value ",
      ({ value, expected }) => {
        const dueDate = new Date("2023-01-01");
        const payment = new PaymentSlipEntity({
          amount: value.amount,
          paymentDate: value.paymentDate,
          dueDate,
          code: "123",
          type: "NPC",
          recipient: {
            name: "Company",
            document: "456",
          },
        });
        expect(payment.amount).toBe(expected.amount);
        expect(payment.fineAmountCalculated).toBe(
          expected.fineAmountCalculated
        );
        expect(payment.interestAmountCalculated).toBe(
          expected.interestAmountCalculated
        );
        expect(payment.totalAmountWithFine).toBe(expected.totalAmountWithFine);
      }
    );
  });
});
