import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { GroomingEntity } from './entities/grooming.entity';
import { ErrorResponse } from '../common/response/errorResponse';
import { PaymentOriginEnum, PaymentStatus, Prisma } from '@prisma/client';

@Injectable()
export class GroomingRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createGrooming(data: GroomingEntity, serviceId?: string) {
    try {
      const groomingData: any = {
        petId: data.petId,
        panelId: data.panelId,
        status: data.status,
        startDate: data.startDate,
        endDate: data.endDate,
        description: data.description,
      };

      // Se houver serviceId, criar paymentOrder e paymentItem
      if (serviceId) {
        const paymentItem = await this.prisma.paymentItem.create({
          data: {
            service: {
              connect: { id: serviceId }
            },
            paymentOrder: {
              create: {
                panelId: data.panelId,
                originType: PaymentOriginEnum.CLINIC,
                status: PaymentStatus.PENDING,
                Grooming: {
                  create: groomingData
                }
              }
            }
          },
        });

        // Buscar o grooming criado com todos os relacionamentos
        const paymentOrder = await this.prisma.paymentOrder.findUnique({
          where: { id: paymentItem.paymentOrderId },
          include: {
            Grooming: {
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
                notesGroomings: {
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
            },
            items: {
              include: {
                service: true,
                product: true,
              },
            },
          },
        });

        return paymentOrder?.Grooming?.[0] || null;
      } else {
        // Criar grooming sem paymentOrder
        return await this.prisma.grooming.create({
          data: groomingData,
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
            notesGroomings: {
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
      }
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao criar grooming',
        statusCode: 400,
        errorsCode: error.code,
        details: error.meta,
      });
    }
  }

  async findAllGroomings(filters?: any) {
    try {
      const {
        page = 1,
        limit = 10,
        search,
        status,
        panelId,
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

      if (petId) {
        where.petId = petId;
      }

      const [groomings, total] = await Promise.all([
        this.prisma.grooming.findMany({
          where,
          skip,
          take: limit,
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
          },
          orderBy: {
            startDate: 'desc',
          },
        }),
        this.prisma.grooming.count({ where }),
      ]);

      return {
        groomings,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao buscar groomings',
        statusCode: 400,
        errorsCode: error.code,
        details: error.meta,
      });
    }
  }

  async findGroomingById(id: string) {
    try {
      return await this.prisma.grooming.findUnique({
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
          notesGroomings: {
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
        message: 'Erro ao buscar grooming',
        statusCode: 400,
        errorsCode: error.code,
        details: error.meta,
      });
    }
  }

  async updateGrooming(id: string, data: Partial<GroomingEntity>) {
    try {
      const updateData: any = {};

      if (data.status !== undefined) {
        updateData.status = data.status;
      }

      if (data.startDate !== undefined) {
        updateData.startDate = data.startDate;
      }

      if (data.endDate !== undefined) {
        updateData.endDate = data.endDate;
      }

      if (data.description !== undefined) {
        updateData.description = data.description;
      }

      return await this.prisma.grooming.update({
        where: { id },
        data: updateData,
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
          notesGroomings: {
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
        message: 'Erro ao atualizar grooming',
        statusCode: 400,
        errorsCode: error.code,
        details: error.meta,
      });
    }
  }

  async deleteGrooming(id: string) {
    try {
      return await this.prisma.grooming.delete({
        where: { id },
      });
    } catch (error) {
      throw new ErrorResponse({
        message: 'Erro ao excluir grooming',
        statusCode: 400,
        errorsCode: error.code,
        details: error.meta,
      });
    }
  }

  async addPaymentItemToGrooming(
    groomingId: string,
    type: 'SERVICE' | 'PRODUCT',
    itemId: string,
  ): Promise<void> {
    try {
      await this.prisma.$transaction(async (tx) => {
        const grooming = await tx.grooming.findUnique({
          where: { id: groomingId },
          include: {
            panel: {
              select: {
                id: true,
                companyId: true,
              },
            },
          },
        });

        if (!grooming) {
          throw new ErrorResponse({
            message: 'Grooming não encontrado',
            statusCode: 404,
          });
        }

        if (!grooming.paymentOrderId) {
          throw new ErrorResponse({
            message: 'Grooming não possui ordem de pagamento. Crie um grooming com serviço primeiro.',
            statusCode: 400,
          });
        }

        const paymentOrder = await tx.paymentOrder.findUnique({
          where: { id: grooming.paymentOrderId },
          select: { amount: true },
        });

        if (!paymentOrder) {
          throw new ErrorResponse({
            message: 'Ordem de pagamento não encontrada para o grooming',
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

          if (service.panelId !== grooming.panelId) {
            throw new ErrorResponse({
              message: 'Serviço não pertence ao mesmo painel do grooming',
              statusCode: 403,
            });
          }

          price = service.price ?? new Prisma.Decimal(0);

          await tx.paymentItem.create({
            data: {
              paymentOrderId: grooming.paymentOrderId,
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

          if (product.companyId !== grooming.panel.companyId) {
            throw new ErrorResponse({
              message: 'Produto não pertence à mesma empresa do grooming',
              statusCode: 403,
            });
          }

          price = product.priceSale ?? new Prisma.Decimal(0);

          await tx.paymentItem.create({
            data: {
              paymentOrderId: grooming.paymentOrderId,
              productId: product.id,
            },
          });
        }

        const currentAmount = paymentOrder.amount ?? new Prisma.Decimal(0);
        const updatedAmount = currentAmount.add(price);

        await tx.paymentOrder.update({
          where: { id: grooming.paymentOrderId },
          data: {
            amount: updatedAmount,
          },
        });
      });
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async removePaymentItemFromGrooming(
    groomingId: string,
    paymentItemId: string,
  ): Promise<void> {
    try {
      await this.prisma.$transaction(async (tx) => {
        const grooming = await tx.grooming.findUnique({
          where: { id: groomingId },
          select: {
            id: true,
            paymentOrderId: true,
          },
        });

        if (!grooming) {
          throw new ErrorResponse({
            message: 'Grooming não encontrado',
            statusCode: 404,
          });
        }

        if (!grooming.paymentOrderId) {
          throw new ErrorResponse({
            message: 'Grooming não possui ordem de pagamento',
            statusCode: 404,
          });
        }

        const paymentOrder = await tx.paymentOrder.findUnique({
          where: { id: grooming.paymentOrderId },
          select: { amount: true },
        });

        if (!paymentOrder) {
          throw new ErrorResponse({
            message: 'Ordem de pagamento não encontrada para o grooming',
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

        if (!item || item.paymentOrderId !== grooming.paymentOrderId) {
          throw new ErrorResponse({
            message: 'Item não encontrado para este grooming',
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
          where: { id: grooming.paymentOrderId },
          data: {
            amount: updatedAmount,
          },
        });
      });
    } catch (error) {
      throw new ErrorResponse(error);
    }
  }

  async createGroomingNote(groomingId: string, description: string, vetId?: string) {
    try {
      return await this.prisma.notesGrooming.create({
        data: {
          groomingId,
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
        message: 'Erro ao criar nota do grooming',
        statusCode: 400,
        errorsCode: error.code,
        details: error.meta,
      });
    }
  }
}

