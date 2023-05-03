import { Config } from "../../config/config";
import { HttpClientInterface } from "../http/http.client";
import { PaymentSlipGateway } from "../../payment/domain/gateway/payment-slip.gateway.interface";
import { PaymentSlipEntity } from "../../payment/domain/entity/payment.entity";

export type GetPaymentSlipResponseProps = {
  code: string;
  due_date: string;
  amount: number;
  recipient_name: string;
  recipient_document: string;
  type: string;
};

export class PaymentSlipGatewayHttp
  implements PaymentSlipGateway.HttpInterface {
  constructor(private readonly httpClient: HttpClientInterface) { }

  async getPaymentSlip(
    input: PaymentSlipGateway.GetPaymentSlipInput,
    token: string
  ): Promise<PaymentSlipEntity> {
    try {
      const response = await this.httpClient.post<GetPaymentSlipResponseProps>(
        `${Config.baseUrl().builders}/bill-payments/codes`,
        {
          code: input.codePaymentSlip,
        }, {
        headers: {
          Authorization: token
        }
      }
      );
      return new PaymentSlipEntity({
        code: response.code,
        type: response.type,
        amount: response.amount,
        recipient: {
          name: response.recipient_name,
          document: response.recipient_document,
        },
        paymentDate: new Date(input.paymentDate),
        dueDate: new Date(response.due_date),
      });
    } catch (error) {
      throw error;
    }
  }
}
