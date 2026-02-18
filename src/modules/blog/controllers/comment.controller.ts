import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Json, MultipartData, urlEncoded } from 'src/common/constants/constants';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { BlogCommentService } from '../services/comment.service';
import { CreateCommentDto } from '../dto/comment.dto';


@Controller('blog-comment')
@ApiTags("blog-comment")
@ApiBearerAuth("Authorization")
@UseGuards(AuthGuard)
export class BlogCommentController {
  constructor(private readonly blogCommentService: BlogCommentService) {}
  
  @Post("/")
  @ApiConsumes(Json,urlEncoded)  
  create(@Body() commentDto:CreateCommentDto){
    return this.blogCommentService.create(commentDto)
  }


}
