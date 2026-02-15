import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/blog.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Json, MultipartData } from 'src/common/constants/constants';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Pagination } from 'src/common/decorators/pagination.decorator';
import { PaginationDto } from 'src/common/Dtos/pagination.dto';

@Controller('blog')
@ApiTags("Blog")
@ApiBearerAuth("Authorization")
@UseGuards(AuthGuard)
export class BlogController {
  constructor(private readonly blogService: BlogService) {}
  
  @Post("/")
  @ApiConsumes(Json,MultipartData)  
  create(@Body() blogDto:CreateBlogDto){
    return this.blogService.create(blogDto)
  }
  @Get("/My_Blogs")
  getMyBlogs(){
    return this.blogService.getMyBlogs()
  }
  @Get("/")
  @Pagination()
  blogList(@Query() Dto:PaginationDto){
    return this.blogService.blogList(Dto)
  }

}
