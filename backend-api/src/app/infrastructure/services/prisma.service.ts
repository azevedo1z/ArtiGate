import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    super();

    // Apply soft delete extension
    const softDeleteModels = [
      'user',
      'role',
      'userRole',
      'address',
      'article',
      'articleAuthor',
      'review',
      'payment',
    ];

    return this.$extends({
      query: {
        $allModels: {
          async findUnique({ model, args, query }) {
            if (softDeleteModels.includes(model)) {
              args.where = args.where || {};
              if (args.where.deletedOn === undefined) {
                args.where.deletedOn = null;
              }
            }
            return query(args);
          },
          async findFirst({ model, args, query }) {
            if (softDeleteModels.includes(model)) {
              args.where = args.where || {};
              if (args.where.deletedOn === undefined) {
                args.where.deletedOn = null;
              }
            }
            return query(args);
          },
          async findMany({ model, args, query }) {
            if (softDeleteModels.includes(model)) {
              args.where = args.where || {};
              if (args.where.deletedOn === undefined) {
                args.where.deletedOn = null;
              }
            }
            return query(args);
          },
        },
      },
    }) as this;
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
