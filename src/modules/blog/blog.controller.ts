import { Body, Controller, Post } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/blog.dto';
import { ApiConsumes } from '@nestjs/swagger';
import { Json, MultipartData } from 'src/common/constants/constants';

@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  @Post("/")
  @ApiConsumes(Json,MultipartData)
  create(@Body() blogDto:CreateBlogDto){
    return this.blogService.create(blogDto)
  }

}
