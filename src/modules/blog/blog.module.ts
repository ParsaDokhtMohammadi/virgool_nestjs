import { Module } from '@nestjs/common';
import { BlogService } from './blog.service';
import { BlogController } from './blog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogEntity } from './entities/blog.entity';
import { BlogBookmarksEntity } from './entities/bookmark.entity';
import { BlogLikesEntity } from './entities/like.entity';
import { BlogCommentEntiy } from './entities/comment.entity';

@Module({
  imports : [TypeOrmModule.forFeature([BlogEntity,BlogBookmarksEntity,BlogLikesEntity,BlogCommentEntiy])],
  controllers: [BlogController],
  providers: [BlogService],
})
export class BlogModule {}
