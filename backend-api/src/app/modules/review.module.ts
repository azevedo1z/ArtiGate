import { Module, forwardRef } from '@nestjs/common';
import { ReviewController } from '../interface/controllers/review.controller';
import { ReviewRepository } from '../infrastructure/repositories/review.repository';
import { ReviewDatabaseAdapter } from '../interface/adapter/database.adapter';
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
      provide: ReviewDatabaseAdapter,
      useClass: ReviewRepository,
    },
  ],
  exports: [ReviewDatabaseAdapter],
})
export class ReviewModule {}
