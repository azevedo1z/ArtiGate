import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const SOFT_DELETE_MODELS: ReadonlySet<string> = new Set([
  'User',
  'Role',
  'UserRole',
  'Address',
  'Article',
  'ArticleAuthor',
  'ArticleAttachment',
  'Review',
  'Payment',
]);

const READ_ACTIONS: ReadonlySet<string> = new Set([
  'findUnique',
  'findFirst',
  'findMany',
  'count',
  'aggregate',
  'groupBy',
]);

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();

    this.$use(async (params, next) => {
      if (
        params.model &&
        SOFT_DELETE_MODELS.has(params.model) &&
        READ_ACTIONS.has(params.action)
      ) {
        if (!params.args) params.args = {};
        if (!params.args.where) params.args.where = {};
        if (params.args.where.deletedOn === undefined)
          params.args.where.deletedOn = null;
      }
      return next(params);
    });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
