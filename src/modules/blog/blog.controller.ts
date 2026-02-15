import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { BlogService } from './blog.service';
import { CreateBlogDto } from './dto/blog.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Json, MultipartData } from 'src/common/constants/constants';
import { AuthGuard } from '../auth/guards/auth.guard';

@Controller('blog')
@ApiTags("Blog")
export class BlogController {
  constructor(private readonly blogService: BlogService) {}
  
  @Post("/")
  @ApiBearerAuth("Authorization")
  @ApiConsumes(Json,MultipartData)
  @UseGuards(AuthGuard)
  create(@Body() blogDto:CreateBlogDto){
    return this.blogService.create(blogDto)
  }

}
