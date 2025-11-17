import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/common/prisma/prisma.service";
import { ErrorResponse } from "src/common/response/errorResponse";

interface PaymentFilters {
  page?: number;
  limit?: number;
}

@Injectable()
export class PaymentsService {
  constructor(private readonly prisma: PrismaService) {}

  private mapPaymentWithTotals(payment: any) {
    const itemsTotal = (payment.items ?? []).reduce((totalSum: number, item: any) => {
      const product = item.product as Record<string, any> | null | undefined;
      const service = item.service as Record<string, any> | null | undefined;

      const productPrice = product?.price ?? product?.priceSale ?? product?.pricePay ?? 0;
      const servicePrice = service?.price ?? service?.priceSale ?? 0;

      const normalizedProductPrice = Number(productPrice) || 0;
      const normalizedServicePrice = Number(servicePrice) || 0;

      return totalSum + normalizedProductPrice + normalizedServicePrice;
    }, 0);

    return {
      ...payment,
      amount: itemsTotal.toFixed(2),
    };
  }

  async findAllPayments(panelId: string, filters?: PaymentFilters) {
    try {
      const page = Math.max(1, Number(filters?.page) || 1);
      const limit = Math.max(1, Math.min(Number(filters?.limit) || 10, 100));
      const skip = (page - 1) * limit;

      const payments = await this.prisma.paymentOrder.findMany({
        where: { panelId },
        include: {
          items: {
            include: {
              product: true,
              service: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      });

      const total = await this.prisma.paymentOrder.count({
        where: { panelId },
      });

      const paymentsWithTotals = payments.map((payment) => this.mapPaymentWithTotals(payment));

      return {
        payments: paymentsWithTotals,
        total,
        page,
        limit,
      };
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao buscar pagamentos.',
        details: error.meta,
        statusCode: 400,
        errorsCode: error.code,
      });
    }
  }

  async findPaymentById(panelId: string, paymentId: string) {
    try {
      const payment = await this.prisma.paymentOrder.findFirst({
        where: {
          id: paymentId,
          panelId,
        },
        include: {
          items: {
            include: {
              product: true,
              service: true,
            },
          },
        },
      });

      if (!payment) {
        throw new ErrorResponse({
          message: 'Pagamento não encontrado.',
          statusCode: 404,
        });
      }

      return this.mapPaymentWithTotals(payment);
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao buscar pagamento.',
        details: error?.meta,
        statusCode: error?.statusCode || 400,
        errorsCode: error?.errorsCode,
      });
    }
  }
}