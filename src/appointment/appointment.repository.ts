import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { AppointmentEntity } from './entities/appointment.entity';
import { ErrorResponse } from '../common/response/errorResponse';
import { PaymentOriginEnum, PaymentStatus, Prisma } from '@prisma/client';

@Injectable()
export class AppointmentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createAppointment(data: AppointmentEntity, serviceId: string, amount = 0.0) {
    try {

      return await this.prisma.paymentItem.create({
        data: {
          service: {
            connect: { id: serviceId }
          },
          paymentOrder: {
            create: {
              panelId: data.panelId,
              originType: PaymentOriginEnum.CLINIC,
              status: PaymentStatus.PENDING,
      
              appointments: {
                create: {
                  petId: data.petId,
                  panelId: data.panelId,
                  vetId: data.vetId,
                  status: data.status,
                  type: data.type,
                  typeSpecialty: data.typeSpecialty,
                  description: data.description,
                  scheduledAt: data.scheduledAt,
                }
              }
            }
          }
        }
      });
      
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao criar consulta',
        statusCode: 400,
        errorsCode: error.code,
        details: error.meta,
      });
    }
  }

  async findAllAppointments(filters?: any) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        status,
        panelId,
        vetId,
        petId,
      } = filters || {};

      const skip = (page - 1) * limit;
      const where: any = {};

      if (search) {
        where.OR = [
          {
            pet: {
              name: {
                contains: search,
                mode: 'insensitive',
              },
            },
          },
          {
            description: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ];
      }

      if (status) {
        where.status = status;
      }

      if (panelId) {
        where.panelId = panelId;
      }

      if (vetId) {
        where.vetId = vetId;
      }

      if (petId) {
        where.petId = petId;
      }

      const [appointments, total] = await Promise.all([
        this.prisma.appointment.findMany({
          where,
          skip,
          take: Number(limit),
          include: {
            pet: {
              select: {
                id: true,
                name: true,
                species: true,
                breed: true,
              },
            },
            panel: {
              select: {
                id: true,
                type: true,
              },
            },
            vet: {
              select: {
                id: true,
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            paymentOrder: {
              select: {
                id: true,
                amount: true,
                status: true,
              },
            },
          },
          orderBy: {
            scheduledAt: 'desc',
          },
        }),
        this.prisma.appointment.count({ where }),
      ]);

      return {
        appointments,
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      };
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao buscar consultas',
        statusCode: 400,
        errorsCode: error.code,
        details: error.meta,
      });
    }
  }

  async findAppointmentById(id: string) {
    try {
      return await this.prisma.appointment.findUnique({
        where: { id },
        include: {
          pet: {
            include: {
              tutor: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                    },
                  },
                },
              },
            },
          },
          panel: {
            include: {
              company: true,
            },
          },
          vet: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
          paymentOrder: {
            include: {
              items: {
                include: {
                  service: true,
                  product: true,
                },
              },
            },
          },
          medications: true,
          notesAppointments: {
            include: {
              vet: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                    },
                  },
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      });
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao buscar consulta',
        statusCode: 400,
        errorsCode: error.code,
        details: error.meta,
      });
    }
  }

  async findAppointmentsByPetId(petId: string) {
    try {
      return await this.prisma.appointment.findMany({
        where: { petId },
        include: {
          pet: true,
          vet: {
            include: {
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
          panel: true,
          paymentOrder: true,
        },
        orderBy: {
          scheduledAt: 'desc',
        },
      });
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao buscar consultas do pet',
        statusCode: 400,
        errorsCode: error.code,
        details: error.meta,
      });
    }
  }

  async findAppointmentsByPanelId(panelId: string) {
    try {
      return await this.prisma.appointment.findMany({
        where: { panelId },
        include: {
          pet: {
            select: {
              id: true,
              name: true,
              species: true,
              breed: true,
            },
          },
          vet: {
            include: {
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
          paymentOrder: true,
        },
        orderBy: {
          scheduledAt: 'desc',
        },
      });
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao buscar consultas do painel',
        statusCode: 400,
        errorsCode: error.code,
        details: error.meta,
      });
    }
  }

  async findAppointmentsByVetId(vetId: string) {
    try {
      return await this.prisma.appointment.findMany({
        where: { vetId },
        include: {
          pet: {
            include: {
              tutor: {
                include: {
                  user: {
                    select: {
                      name: true,
                      email: true,
                    },
                  },
                },
              },
            },
          },
          panel: true,
          paymentOrder: true,
        },
        orderBy: {
          scheduledAt: 'desc',
        },
      });
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao buscar consultas do veterinário',
        statusCode: 400,
        errorsCode: error.code,
        details: error.meta,
      });
    }
  }

  async updateAppointment(id: string, data: Partial<AppointmentEntity>) {
    try {
      return await this.prisma.appointment.update({
        where: { id },
        data: {
          vetId: data.vetId,
          status: data.status,
          type: data.type,
          typeSpecialty: data.typeSpecialty,
          description: data.description,
          scheduledAt: data.scheduledAt,
        },
        include: {
          pet: true,
          panel: true,
          vet: {
            include: {
              user: {
                select: {
                  name: true,
                },
              },
            },
          },
          paymentOrder: true,
        },
      });
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao atualizar consulta',
        statusCode: 400,
        errorsCode: error.code,
        details: error.meta,
      });
    }
  }

  async deleteAppointment(id: string) {
    try {
      return await this.prisma.appointment.delete({
        where: { id },
      });
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao deletar consulta',
        statusCode: 400,
        errorsCode: error.code,
        details: error.meta,
      });
    }
  }

  async findServiceForAppointment(serviceId: string) {
    try {
      const service = await this.prisma.service.findUnique({
        where: { id: serviceId },
      });
      return service;
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao buscar serviço',
        statusCode: 400,
        errorsCode: error.code,
        details: error.meta,
      });
    }
  }

  async addPaymentItemToAppointment(
    appointmentId: string,
    type: 'SERVICE' | 'PRODUCT',
    itemId: string,
  ): Promise<void> {
    try {
      await this.prisma.$transaction(async (tx) => {
        const appointment = await tx.appointment.findUnique({
          where: { id: appointmentId },
          include: {
            panel: {
              select: {
                id: true,
                companyId: true,
              },
            },
          },
        });

        if (!appointment) {
          throw new ErrorResponse({
            message: 'Consulta não encontrada',
            statusCode: 404,
          });
        }

        const paymentOrder = await tx.paymentOrder.findUnique({
          where: { id: appointment.paymentOrderId },
          select: { amount: true },
        });

        if (!paymentOrder) {
          throw new ErrorResponse({
            message: 'Ordem de pagamento não encontrada para a consulta',
            statusCode: 404,
          });
        }

        let price = new Prisma.Decimal(0);

        if (type === 'SERVICE') {
          const service = await tx.service.findUnique({
            where: { id: itemId },
            select: { id: true, price: true, panelId: true, active: true },
          });

          if (!service || !service.active) {
            throw new ErrorResponse({
              message: 'Serviço não encontrado ou inativo',
              statusCode: 404,
            });
          }

          if (service.panelId !== appointment.panelId) {
            throw new ErrorResponse({
              message: 'Serviço não pertence ao mesmo painel da consulta',
              statusCode: 403,
            });
          }

          price = service.price ?? new Prisma.Decimal(0);

          await tx.paymentItem.create({
            data: {
              paymentOrderId: appointment.paymentOrderId,
              serviceId: service.id,
            },
          });
        } else {
          const product = await tx.product.findUnique({
            where: { id: itemId },
            select: { id: true, priceSale: true, companyId: true, active: true },
          });

          if (!product || !product.active) {
            throw new ErrorResponse({
              message: 'Produto não encontrado ou inativo',
              statusCode: 404,
            });
          }

          if (product.companyId !== appointment.panel.companyId) {
            throw new ErrorResponse({
              message: 'Produto não pertence à mesma empresa da consulta',
              statusCode: 403,
            });
          }

          price = product.priceSale ?? new Prisma.Decimal(0);

          await tx.paymentItem.create({
            data: {
              paymentOrderId: appointment.paymentOrderId,
              productId: product.id,
            },
          });
        }

        const currentAmount = paymentOrder.amount ?? new Prisma.Decimal(0);
        const updatedAmount = currentAmount.add(price);

        await tx.paymentOrder.update({
          where: { id: appointment.paymentOrderId },
          data: {
            amount: updatedAmount,
          },
        });
      });
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async removePaymentItemFromAppointment(
    appointmentId: string,
    paymentItemId: string,
  ): Promise<void> {
    try {
      await this.prisma.$transaction(async (tx) => {
        const appointment = await tx.appointment.findUnique({
          where: { id: appointmentId },
          select: {
            id: true,
            paymentOrderId: true,
          },
        });

        if (!appointment) {
          throw new ErrorResponse({
            message: 'Consulta não encontrada',
            statusCode: 404,
          });
        }

        const paymentOrder = await tx.paymentOrder.findUnique({
          where: { id: appointment.paymentOrderId },
          select: { amount: true },
        });

        if (!paymentOrder) {
          throw new ErrorResponse({
            message: 'Ordem de pagamento não encontrada para a consulta',
            statusCode: 404,
          });
        }

        const item = await tx.paymentItem.findUnique({
          where: { id: paymentItemId },
          include: {
            service: true,
            product: true,
          },
        });

        if (!item || item.paymentOrderId !== appointment.paymentOrderId) {
          throw new ErrorResponse({
            message: 'Item não encontrado para esta consulta',
            statusCode: 404,
          });
        }

        let price = new Prisma.Decimal(0);

        if (item.service) {
          price = item.service.price ?? new Prisma.Decimal(0);
        } else if (item.product) {
          price = item.product.priceSale ?? new Prisma.Decimal(0);
        }

        await tx.paymentItem.delete({
          where: { id: paymentItemId },
        });

        const currentAmount = paymentOrder.amount ?? new Prisma.Decimal(0);
        let updatedAmount = currentAmount.sub(price);
        if (updatedAmount.lessThan(0)) {
          updatedAmount = new Prisma.Decimal(0);
        }

        await tx.paymentOrder.update({
          where: { id: appointment.paymentOrderId },
          data: {
            amount: updatedAmount,
          },
        });
      });
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async createAppointmentNote(appointmentId: string, description: string, vetId?: string) {
    try {
      return await this.prisma.notesAppointment.create({
        data: {
          appointmentId,
          description,
          vetId: vetId || null,
        },
        include: {
          vet: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao criar nota da consulta',
        statusCode: 400,
        errorsCode: error.code,
        details: error.meta,
      });
    }
  }
}
