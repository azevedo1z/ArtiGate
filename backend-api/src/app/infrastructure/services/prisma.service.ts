import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect();

    // Soft delete middleware
    this.$use(async (params, next) => {
      // List of models with soft delete
      const softDeleteModels = [
        'User',
        'Role',
        'UserRole',
        'Address',
        'Article',
        'ArticleAuthor',
        'Review',
        'Payment',
      ];

      // Only apply to find queries on soft-delete models
      if (
        params.model &&
        softDeleteModels.includes(params.model) &&
        ['findUnique', 'findFirst', 'findMany'].includes(params.action)
      ) {
        if (!params.args) params.args = {};
        if (!params.args.where) params.args.where = {};
        // Only add if not already filtering by deletedOn
        if (params.args.where.deletedOn === undefined) {
          params.args.where.deletedOn = null;
        }
      }
      return next(params);
    });
  }
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
