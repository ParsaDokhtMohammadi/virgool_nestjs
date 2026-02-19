import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { BlogService } from '../services/blog.service';
import { CreateBlogDto, FilterBlogDto, UpdateBlogDto } from '../dto/blog.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Json, MultipartData } from 'src/common/constants/constants';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { Pagination } from 'src/common/decorators/pagination.decorator';
import { PaginationDto } from 'src/common/Dtos/pagination.dto';
import { skipAuth } from 'src/common/decorators/skipAuth.decorator';
import { FilterBlog } from 'src/common/decorators/filter.decorator';

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
  @Patch("/:id")
  @ApiConsumes(Json,MultipartData)  
  update(
    @Body() blogDto:UpdateBlogDto,
    @Param("id", ParseIntPipe) id:number
  ){
    return this.blogService.update(blogDto,id)
  }
  @Get("/My_Blogs")
  getMyBlogs(){
    return this.blogService.getMyBlogs()
  }
  @Get("/")
  @Pagination()
  @FilterBlog()
  @skipAuth()
  blogList(@Query() paginationDto:PaginationDto , @Query() filterBlogDto:FilterBlogDto){
    return this.blogService.blogList(paginationDto,filterBlogDto)
  }
  @Get("/by-slug/:slug")
  findOneBySlug(@Param() slug:string){
    return this.blogService.findOneBySlug(slug)
  }
  @Delete("/:id")
  delete(@Param("id", ParseIntPipe) id:number){
    return this.blogService.delete(id)
  }
  @Get("/like/:id")
  likeToggle(@Param("id", ParseIntPipe) id:number){
    return this.blogService.likeToggle(id)
  }
  @Get("/bookmark/:id")
  bookmarkToggle(@Param("id", ParseIntPipe) id:number){
    return this.blogService.bookmarkToggle(id)
  }
}
