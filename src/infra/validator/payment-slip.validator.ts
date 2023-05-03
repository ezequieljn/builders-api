import { Validator } from "./validator";
import { z } from "zod";

export class PaymentSlipValidator implements Validator {
  errors: { [key: string]: string }[] = null;
  transformedValues: any = null;
  validate(input: any): void {
    const schema = z.object({
      bar_code: z
        .string()
        .regex(/^\d+$/, "Only numbers are allowed"),
      payment_date: z
        .string()
        .regex(
          /^(\d{4})-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
          "Expected date, received string"
        )
        .transform((val) => new Date(val)),
    });
    try {
      this.transformedValues = schema.parse(input);
    } catch (err: any) {
      const message: any = JSON.parse(err.message);
      this.errors = message.map((e: any) => ({ [e.path[0]]: e.message }));
    }
  }



  formatTheOne(value: string) {
    return value.length === 1 ? `0${value}` : value;
  }

}