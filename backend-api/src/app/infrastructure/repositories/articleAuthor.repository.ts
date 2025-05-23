import { ArticleAuthor } from '@prisma/client';
import { ArticleAuthorDatabaseAdapter } from '../../interface/adapter/database.adapter';
import { PrismaService } from '../services/prisma.service';

export class ArticleAuthorRepository implements ArticleAuthorDatabaseAdapter {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Partial<ArticleAuthor>): Promise<ArticleAuthor> {
    throw new Error('Method not implemented.');
  }
  async update(data: Partial<ArticleAuthor>): Promise<ArticleAuthor> {
    throw new Error('Method not implemented.');
  }
  async delete(id: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
  async findById(id: string): Promise<ArticleAuthor | null> {
    throw new Error('Method not implemented.');
  }
  async findAll(): Promise<ArticleAuthor[]> {
    throw new Error('Method not implemented.');
  }
  async findMany(contextParam: string): Promise<ArticleAuthor[]> {
    throw new Error('Method not implemented.');
  }
  async findManyByUserId(userId: string): Promise<ArticleAuthor[]> {
    return await this.prisma.articleAuthor.findMany({ where: { userId } });
  }
}
