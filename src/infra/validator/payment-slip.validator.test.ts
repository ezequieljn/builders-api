import { PaymentSlipValidator } from "./payment-slip.validator";

describe("PaymentSlipValidator Test", () => {
  const paramsInvalidNumber = [
    {
      value: "asd",
      expected: { bar_code: "Only numbers are allowed" },
    },
    {
      value: "10.7",
      expected: { bar_code: "Only numbers are allowed" },
    },
    {
      value: 0,
      expected: { bar_code: "Expected string, received number" },
    },
    {
      value: -5,
      expected: { bar_code: "Expected string, received number" },
    },
    {
      value: [] as any,
      expected: { bar_code: "Expected string, received array" },
    },
  ];

  describe("should return an error if payment-slip is not valid", () => {
    test.each(paramsInvalidNumber)(
      "should return an error if bar code value is $value",
      (params) => {
        const validator = new PaymentSlipValidator();
        validator.validate({ bar_code: params.value, payment_date: "2023-01-01" });
        expect(validator.errors).not.toBeNull();
        expect(validator.errors).toStrictEqual([params.expected]);
      }
    );

    const paramsInvalidDate = [
      {
        value: "asd",
        expected: { payment_date: "Expected date, received string" },
      },
      {
        value: "10.7",
        expected: { payment_date: "Expected date, received string" },
      },
      {
        value: 0,
        expected: { payment_date: "Expected string, received number" },
      },
      {
        value: -5,
        expected: { payment_date: "Expected string, received number" },
      },
      {
        value: [] as any,
        expected: { payment_date: "Expected string, received array" },
      },
    ];
    test.each(paramsInvalidDate)(
      "should return an error if payment date value is $value",
      (params) => {
        const validator = new PaymentSlipValidator();
        validator.validate({ bar_code: "123", payment_date: params.value });
        expect(validator.errors).not.toBeNull();
        expect(validator.errors).toStrictEqual([params.expected]);
      }
    );

  });

  it("should not return error", () => {
    const validator = new PaymentSlipValidator();
    validator.validate({ bar_code: "123456", payment_date: "2023-02-01" });
    expect(validator.errors).toBeNull();
  });
});
