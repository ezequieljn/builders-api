import { AxiosAdapter } from "./infra/http/axios.adapter";

import { ExpressAdapter } from "./infra/http/express.adapter";

import { Config } from "./config/config";
import { MainController } from "./infra/controllers/main.controller";
import { PaymentSlipGatewayHttp } from "./infra/gateway/payment.gateway-http";
import { PaymentSlipController } from "./infra/controllers/payment.controller";
import { PaymentRepositoryPg } from "./infra/repository/payment.repository-pg";
import { PgPromise } from "./infra/database/database-pg.adapter";
import { CalculatePaymentSlipFine } from "./payment/usecase/calculate-payment-slip-fine/calculate-payment-slip-fine.usecase";
import { AuthRepositoryMemory } from "infra/repository/auth.repository-memory";
import { AuthGatewayHttp } from "infra/gateway/auth.gateway-http";
import { GetCalculations } from "payment/usecase/get-calculations/get-calculations.usecase";

Config.init();
const httpClient = new AxiosAdapter();
const httpServer = new ExpressAdapter();
const pg = new PgPromise();
const paymentRepository = new PaymentRepositoryPg(pg);
const paymentGateway = new PaymentSlipGatewayHttp(httpClient);

const authRepository = AuthRepositoryMemory.getInstance();
const authGateway = new AuthGatewayHttp(httpClient);

const calculatePaymentSlipFineUseCase = new CalculatePaymentSlipFine.UseCase(
  paymentRepository,
  paymentGateway,
  authRepository,
  authGateway
);
const getCalculations = new GetCalculations.UseCase(paymentRepository);
new PaymentSlipController(
  httpServer,
  calculatePaymentSlipFineUseCase,
  getCalculations
);
new MainController(httpServer);
httpServer.listen(Config.config().port);
