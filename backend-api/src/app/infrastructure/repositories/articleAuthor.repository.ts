import { ArticleAuthor } from '@prisma/client';
import { DatabaseAdapter } from '../../interface/adapter/database.adapter';
import { PrismaService } from '../services/prisma.service';

export class ArticleAuthorRepository implements DatabaseAdapter<ArticleAuthor> {
  constructor(private readonly prisma: PrismaService) {}

  async findBy(contextParam: string): Promise<ArticleAuthor | null> {
    throw new Error('Method not implemented.');
  }
  async findAll(): Promise<ArticleAuthor[]> {
    throw new Error('Method not implemented.');
  }
  async findManyBy(userId: string): Promise<ArticleAuthor[]> {
    return await this.prisma.articleAuthor.findMany({ where: { userId } });
  }

//   async findManyBy(articleId: string): Promise<ArticleAuthor[]> {
//     return await this.prisma.articleAuthor.findMany({ where: { articleId } });
//   }

  async create(data: Partial<ArticleAuthor>): Promise<ArticleAuthor> {
    throw new Error('Method not implemented.');
  }
  async update(data: Partial<ArticleAuthor>): Promise<ArticleAuthor> {
    throw new Error('Method not implemented.');
  }
  async delete(id: string): Promise<boolean> {
    throw new Error('Method not implemented.');
  }
}
