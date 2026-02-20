import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BlogService } from './services/blog.service';
import { BlogController } from './controllers/blog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogEntity } from './entities/blog.entity';
import { BlogBookmarksEntity } from './entities/bookmark.entity';
import { BlogLikesEntity } from './entities/like.entity';
import { BlogCommentEntiy } from './entities/comment.entity';
import { AuthModule } from '../auth/auth.module';
import { CategoryService } from '../category/category.service';
import { CategoryEntity } from '../category/entities/category.entity';
import { BlogCategoryEntity } from './entities/blog_category.entity';
import { BlogCommentService } from './services/comment.service';
import { BlogCommentController } from './controllers/comment.controller';
import { AddUserToReqWOV } from 'src/common/middleware/addUserToReqWOV.middleware';

@Module({
  imports : [AuthModule,TypeOrmModule.forFeature([BlogEntity,BlogBookmarksEntity,BlogLikesEntity,BlogCommentEntiy,BlogCategoryEntity,CategoryEntity])],
  controllers: [BlogController,BlogCommentController],
  providers: [BlogService , CategoryService , BlogCommentService],
})
export class BlogModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AddUserToReqWOV).forRoutes("blog/by-slug/:slug")
  }
}
