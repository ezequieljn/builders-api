import { PaymentSlipValidator } from "../../infra/validator/payment-slip.validator";
import { CalculatePaymentSlipFine } from "../../payment/usecase/calculate-payment-slip-fine.usecase";
import { HttpServer } from "../http/http.server";
import { Response } from "express";

type PaymentSlipProps = {
  bar_code: "string";
  payment_date: "string";
};

export class PaymentSlipController {
  constructor(
    readonly httpServer: HttpServer,
    readonly calculatePaymentSlipFineUseCase: CalculatePaymentSlipFine.UseCase
  ) {
    httpServer.on(
      "get",
      "/payment-slip",
      async (
        params: any,
        body: PaymentSlipProps,
        query: any,
        response: Response
      ) => {
        const paymentSlipValidator = new PaymentSlipValidator();
        paymentSlipValidator.validate(body);
        if (paymentSlipValidator.errors) {
          response.status(422).json({ message: paymentSlipValidator.errors });
          return;
        }
        const calculate = await calculatePaymentSlipFineUseCase.execute({
          paymentDate: new Date(body.payment_date),
          codePaymentSlip: body.bar_code,
        });
        return calculate;
      }
    );
  }
}
