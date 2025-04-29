import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();

    // middleware for soft delete filtering using Prisma Client Extensions
    this.$extends({
      query: {
        $allModels: {
          async findUnique({ args, query }) {
            if (!args.where) args.where = {} as typeof args.where;
            args.where.deletedOn = null;
            return query(args);
          },
          async findFirst({ args, query }) {
            if (!args.where) args.where = {};
            args.where.deletedOn = null;
            return query(args);
          },
          async findMany({ args, query }) {
            if (!args.where) args.where = {};
            args.where.deletedOn = { equals: null };
            return query(args);
          },
        },
      },
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
