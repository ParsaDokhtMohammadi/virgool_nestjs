import {  Inject, Injectable,  NotFoundException,  Scope} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogEntity } from '../entities/blog.entity';
import {  Repository } from 'typeorm';
import type { AuthRequest } from 'src/common/types/authRequest.type';
import { REQUEST } from '@nestjs/core';

import { BlogCommentEntiy } from '../entities/comment.entity';
import { CreateCommentDto } from '../dto/comment.dto';
import { BlogService } from './blog.service';
import { COMMENT_MESSAGES } from 'src/common/enums/message.enum';


@Injectable({ scope: Scope.REQUEST })
export class BlogCommentService {
    constructor(
        @InjectRepository(BlogCommentEntiy) private blogCommentRepo: Repository<BlogCommentEntiy>,
        @InjectRepository(BlogEntity) private blogRepo: Repository<BlogEntity>,
        @Inject(REQUEST) private request: AuthRequest,
        private blogService:BlogService

    ) { }
   async create(Dto:CreateCommentDto){
        const {parent_id , text , blog_id} = Dto
        const user = this.request.user
        let parent:any = null
        await this.blogService.checkBlogExists(blog_id)
        if(parent_id && !isNaN(parent_id)){
            parent = await this.blogCommentRepo.findOneBy({parent_id})
            if(!parent) throw new NotFoundException(COMMENT_MESSAGES.NOTFOUND)
        }
        await this.blogCommentRepo.insert({
            text,
            accepted:true,
            blog_id,
            parent_id: parent,
            user_id:user!.id
        })
        return {
            message:COMMENT_MESSAGES.SUCCESS
        }
   }

}  
