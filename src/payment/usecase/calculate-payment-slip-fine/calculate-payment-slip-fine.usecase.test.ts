import { PaymentSlipGateway } from "../../domain/gateway/payment-slip.gateway.interface";
import { CalculatePaymentSlipFine } from "./calculate-payment-slip-fine.usecase";
import { PaymentSlipGatewayHttp } from "../../../infra/gateway/payment.gateway-http";
import { AxiosAdapter } from "../../../infra/http/axios.adapter";
import { PaymentRepositoryMemory } from "../../../infra/repository/payment.repository-memory";
import { AuthGateway } from "../../../auth/domain/gateway/auth.gateway.interface";
import { AuthRepository } from "../../../auth/domain/repository/auth.repository.interface";
import { AuthGatewayHttp } from "../../../infra/gateway/auth.gateway-http";
import { AuthRepositoryMemory } from "../../../infra/repository/auth.repository-memory";

describe("CalculatePaymentSlipFine UseCase", () => {
  let useCase: CalculatePaymentSlipFine.UseCase;
  let paymentGateway: PaymentSlipGateway.HttpInterface;
  let paymentRepository: PaymentRepositoryMemory;
  let authGateway: AuthGateway.HttpInterface;
  let authRepository: AuthRepository.DatabaseInterface;

  beforeEach(() => {
    const httpClient = new AxiosAdapter();
    paymentRepository = new PaymentRepositoryMemory();
    paymentGateway = new PaymentSlipGatewayHttp(httpClient);
    authRepository = AuthRepositoryMemory.getInstance();
    authGateway = new AuthGatewayHttp(httpClient);
    useCase = new CalculatePaymentSlipFine.UseCase(
      paymentRepository,
      paymentGateway,
      authRepository,
      authGateway
    );
  });

  it("should calculate fine for payment slip", async () => {
    const paymentHttpClientMock = {
      get: jest.fn(),
      post: jest.fn(),
    };
    paymentHttpClientMock.post.mockResolvedValue({
      code: "10101010110",
      due_date: "2023-01-01",
      amount: 260.0,
      recipient_name: "Company Fake",
      recipient_document: "10101010",
      type: "NPC",
    });
    const AuthRepositoryMock = {
      get: jest.fn(),
      save: jest.fn(),
    };
    AuthRepositoryMock.get.mockResolvedValue({
      token: "123456",
    });
    paymentGateway = new PaymentSlipGatewayHttp(paymentHttpClientMock);
    useCase = new CalculatePaymentSlipFine.UseCase(
      paymentRepository,
      paymentGateway,
      AuthRepositoryMock,
      authGateway
    );
    const result = await useCase.execute({
      codePaymentSlip: "34191790010104351004791020150008291070026000",
      paymentDate: new Date("2023-01-11"),
    });
    expect(result).toStrictEqual({
      amount: 266.07,
      due_date: "2023-01-01",
      fine_amount_calculated: 6.07,
      interest_amount_calculated: 2.33,
      original_amount: 260,
      payment_date: "2023-01-11",
    });
    const entitySaved = paymentRepository.paymentEntities[0];
    expect(entitySaved.amount).toStrictEqual(260);
    expect(entitySaved.dueDate).toStrictEqual(new Date("2023-01-01"));
    expect(entitySaved.totalAmountWithFine).toStrictEqual(266.07);
    expect(entitySaved.fineAmountCalculated).toStrictEqual(6.07);
    expect(entitySaved.interestAmountCalculated).toStrictEqual(2.33);
    expect(entitySaved.type).toStrictEqual("NPC");
  });


  it("should verify that the token is expired and re-authenticate to renew the token", async () => {
    const paymentHttpClientMock = {
      get: jest.fn(),
      post: jest.fn(),
    };
    paymentHttpClientMock.post.mockResolvedValue({
      code: "10101010110",
      due_date: "2023-01-01",
      amount: 260.0,
      recipient_name: "Company Fake",
      recipient_document: "10101010",
      type: "NPC",
    });
    const AuthRepositoryMock = new AuthRepositoryMemory();
    AuthRepositoryMock["value"] = {
      token: "token",
      expires_in: "2020-01-01",
    }
    const AuthGatewayMock = {
      login: jest.fn().mockResolvedValue({
        token: "token",
        expires_in: "2024-01-01",
      })
    }
    paymentGateway = new PaymentSlipGatewayHttp(paymentHttpClientMock);
    useCase = new CalculatePaymentSlipFine.UseCase(
      paymentRepository,
      paymentGateway,
      AuthRepositoryMock,
      AuthGatewayMock
    );
    const result = await useCase.execute({
      codePaymentSlip: "34191790010104351004791020150008291070026000",
      paymentDate: new Date("2023-01-11"),
    });
    expect(result).toStrictEqual({
      amount: 266.07,
      due_date: "2023-01-01",
      fine_amount_calculated: 6.07,
      interest_amount_calculated: 2.33,
      original_amount: 260,
      payment_date: "2023-01-11",
    });
    const entitySaved = paymentRepository.paymentEntities[0];
    expect(entitySaved.amount).toStrictEqual(260);
    expect(entitySaved.dueDate).toStrictEqual(new Date("2023-01-01"));
    expect(entitySaved.totalAmountWithFine).toStrictEqual(266.07);
    expect(entitySaved.fineAmountCalculated).toStrictEqual(6.07);
    expect(entitySaved.interestAmountCalculated).toStrictEqual(2.33);
    expect(entitySaved.type).toStrictEqual("NPC");
  });

  it("should do a new authentication to do the calculation", async () => {
    const paymentHttpClientMock = {
      get: jest.fn(),
      post: jest.fn(),
    };
    paymentHttpClientMock.post.mockResolvedValue({
      code: "10101010110",
      due_date: "2023-01-01",
      amount: 260.0,
      recipient_name: "Company Fake",
      recipient_document: "10101010",
      type: "NPC",
    });
    const AuthRepositoryMock = {
      get: jest.fn(),
      save: jest.fn(),
    };
    const authRepositorySave = jest.spyOn(AuthRepositoryMock, "save");
    AuthRepositoryMock.get.mockResolvedValue(null);
    const AuthGatewayMock = {
      login: jest.fn(),
    };
    AuthGatewayMock.login.mockResolvedValue("new-token");
    paymentGateway = new PaymentSlipGatewayHttp(paymentHttpClientMock);
    useCase = new CalculatePaymentSlipFine.UseCase(
      paymentRepository,
      paymentGateway,
      AuthRepositoryMock,
      AuthGatewayMock
    );
    const result = await useCase.execute({
      codePaymentSlip: "34191790010104351004791020150008291070026000",
      paymentDate: new Date("2023-01-11"),
    });
    expect(authRepositorySave).toHaveBeenCalledWith("new-token");
    expect(result).toStrictEqual({
      amount: 266.07,
      fine_amount_calculated: 6.07,
      interest_amount_calculated: 2.33,
      due_date: "2023-01-01",
      payment_date: "2023-01-11",
      original_amount: 260,
    });
  });
});
