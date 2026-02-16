import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogEntity } from './entities/blog.entity';
import { BlogBookmarksEntity } from './entities/bookmark.entity';
import { BlogLikesEntity } from './entities/like.entity';
import { BlogCommentEntiy } from './entities/comment.entity';
import { AuthModule } from '../auth/auth.module';
import { CategoryService } from '../category/category.service';
import { CategoryEntity } from '../category/entities/category.entity';
import { BlogCategoryEntity } from './entities/blog_category.entity';

@Module({
  imports : [AuthModule,TypeOrmModule.forFeature([BlogEntity,BlogBookmarksEntity,BlogLikesEntity,BlogCommentEntiy,BlogCategoryEntity,CategoryEntity])],
  controllers: [BlogController],
  providers: [BlogService , CategoryService],
})
export class BlogModule {}
