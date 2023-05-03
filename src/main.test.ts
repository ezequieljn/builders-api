import { AuthRepository } from "auth/domain/repository/auth.repository.interface";
import { Config } from "./config/config";
import { AuthGateway } from "./auth/domain/gateway/auth.gateway.interface";
import { PaymentSlipGateway } from './payment/domain/gateway/payment-slip.gateway.interface'
import { PaymentRepository } from './payment/domain/repository/payment-slip.repository.interface'
import { AxiosAdapter } from "./infra/http/axios.adapter";
import { PaymentSlipController } from "./infra/controllers/payment.controller";
import { CalculatePaymentSlipFine } from "./payment/usecase/calculate-payment-slip-fine.usecase";
import { PaymentRepositoryMemory } from "./infra/repository/payment.repository-memory";
import { PaymentSlipGatewayHttp } from "./infra/gateway/payment.gateway-http";
import { AuthRepositoryMemory } from "./infra/repository/auth.repository-memory";
import { ExpressAdapter } from "./infra/http/express.adapter";
import request from "supertest";
import { AuthGatewayHttp } from "./infra/gateway/auth.gateway-http";
import { MainController } from "./infra/controllers/main.controller";
import { PaymentSlipEntity } from "./payment/domain/entity/payment.entity";


interface StartApp {
    paymentRepository?: PaymentRepository.DatabaseInterface,
    paymentGateway: PaymentSlipGateway.HttpInterface,
    authRepository?: AuthRepository.DatabaseInterface,
    authGateway: AuthGateway.HttpInterface
}
describe("Test E2E Application", () => {
    beforeAll(() => {
        Config.init();
    });

    function startApp(props: StartApp) {
        const paymentRepository = props.paymentRepository || new PaymentRepositoryMemory()
        const paymentGateway = props.paymentGateway
        const authRepository = props.authRepository || new AuthRepositoryMemory()
        const authGateway = props.authGateway
        const calculatePaymentSlipUseCase = new CalculatePaymentSlipFine.UseCase(
            paymentRepository,
            paymentGateway,
            authRepository,
            authGateway
        );
        const httpServer = new ExpressAdapter();
        new PaymentSlipController(httpServer, calculatePaymentSlipUseCase);
        new MainController(httpServer)
        return httpServer;
    }


    it("should return ok message in main route", async () => {
        const httpServer = startApp({
            authGateway: new AuthGatewayHttp(new AxiosAdapter()),
            paymentGateway: new PaymentSlipGatewayHttp(new AxiosAdapter())
        });
        return request
            .agent(httpServer.app)
            .get("/")
            .expect(200)
            .expect({ message: "ok" })
    })


    it("should return error from validation of empty values", async () => {
        const httpServer = startApp({
            authGateway: new AuthGatewayHttp(new AxiosAdapter()),
            paymentGateway: new PaymentSlipGatewayHttp(new AxiosAdapter())
        });
        return request
            .agent(httpServer.app)
            .get("/payment-slip")
            .expect(422)
            .expect({ message: [{ bar_code: 'Required' }, { payment_date: 'Required' }] })
    })

    it("should calculate the amount of the ticket fine", async () => {
        const AuthRepositoryMock = {
            get: jest.fn().mockResolvedValue("token"),
            save: jest.fn()
        }
        const httpClientPaymentMock = {
            post: jest.fn().mockResolvedValue({
                code: "10101010110",
                type: "NPC",
                amount: 260,
                recipient_name: "Company Fake",
                recipient_document: "10101010",
                due_date: "2023-01-01",
            }),
            get: jest.fn()
        }
        const paymentGateway = new PaymentSlipGatewayHttp(httpClientPaymentMock)
        const httpServer = startApp({
            authGateway: new AuthGatewayHttp(new AxiosAdapter()),
            authRepository: AuthRepositoryMock,
            paymentGateway: paymentGateway
        });
        const response = await request
            .agent(httpServer.app)
            .get("/payment-slip")
            .send({
                "bar_code": "10101010110",
                "payment_date": "2023-01-11"
            })
        expect(response.status).toBe(200)
        expect(response.body).toStrictEqual({
            "original_amount": 260,
            "amount": 266.07,
            "due_date": "2023-01-01",
            "payment_date": "2023-01-11",
            "interest_amount_calculated": 2.33,
            "fine_amount_calculated": 6.07
        })
    })


    it("should calculate the amount of the ticket fine", async () => {
        const AuthRepository = new AuthRepositoryMemory()
        const httpClientPaymentMock = {
            post: jest.fn().mockResolvedValue({
                code: "10101010110",
                type: "NPC",
                amount: 260,
                recipient_name: "Company Fake",
                recipient_document: "10101010",
                due_date: "2023-01-01",
            }),
            get: jest.fn()
        }
        const paymentGateway = new PaymentSlipGatewayHttp(httpClientPaymentMock)
        const AuthAxiosAdapterMock = {
            get: jest.fn(),
            post: jest.fn().mockResolvedValue({
                "token": "token",
                "expires_in": "2027-05-02T22:29:10.962383"
            })
        }
        const httpServer = startApp({
            authGateway: new AuthGatewayHttp(AuthAxiosAdapterMock),
            authRepository: AuthRepository,
            paymentGateway: paymentGateway
        });
        const response = await request
            .agent(httpServer.app)
            .get("/payment-slip")
            .send({
                "bar_code": "10101010110",
                "payment_date": "2023-01-11"
            })
        expect(response.status).toBe(200)
        expect(response.body).toStrictEqual({
            "original_amount": 260,
            "amount": 266.07,
            "due_date": "2023-01-01",
            "payment_date": "2023-01-11",
            "interest_amount_calculated": 2.33,
            "fine_amount_calculated": 6.07
        })
    })

})