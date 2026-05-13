import { Module, forwardRef } from '@nestjs/common';
import { ReviewController } from '../interface/controllers/review.controller';
import { PrismaReviewRepository } from '../infrastructure/repositories/review.repository';
import { ReviewRepository } from '../interface/repositories/review.repository.port';
import { CreateReviewService } from '../application/services/review/createReview.service';
import { GetReviewService } from '../application/services/review/getReview.service';
import { UpdateReviewService } from '../application/services/review/updateReview.service';
import { DeleteReviewService } from '../application/services/review/deleteReview.service';
import { UserModule } from './user.module';
import { ArticleModule } from './article.module';
import { PaymentModule } from './payment.module';

@Module({
  imports: [
    forwardRef(() => UserModule),
    forwardRef(() => ArticleModule),
    forwardRef(() => PaymentModule),
  ],
  controllers: [ReviewController],
  providers: [
    CreateReviewService,
    GetReviewService,
    UpdateReviewService,
    DeleteReviewService,
    {
      provide: ReviewRepository,
      useClass: PrismaReviewRepository,
    },
  ],
  exports: [ReviewRepository, GetReviewService],
})
export class ReviewModule {}
