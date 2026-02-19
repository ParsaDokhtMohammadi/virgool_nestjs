import { BadRequestException, Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogEntity } from '../entities/blog.entity';
import { Repository } from 'typeorm';
import type { AuthRequest } from 'src/common/types/authRequest.type';
import { REQUEST } from '@nestjs/core';

import { BlogCommentEntiy } from '../entities/comment.entity';
import { CreateCommentDto } from '../dto/comment.dto';
import { BlogService } from './blog.service';
import { COMMENT_MESSAGES } from 'src/common/enums/message.enum';
import { PaginationDto } from 'src/common/Dtos/pagination.dto';
import { paginationGenerator, PaginationResolver } from 'src/common/utils/pagination.utils';


@Injectable({ scope: Scope.REQUEST })
export class BlogCommentService {
    constructor(
        @InjectRepository(BlogCommentEntiy) private blogCommentRepo: Repository<BlogCommentEntiy>,
        @InjectRepository(BlogEntity) private blogRepo: Repository<BlogEntity>,
        @Inject(REQUEST) private request: AuthRequest,
        private blogService: BlogService

    ) { }
    async create(Dto: CreateCommentDto) {
        const { parent_id, text, blog_id } = Dto
        const user = this.request.user
        let parent: any = null
        await this.blogService.checkBlogExists(blog_id)
        if (parent_id && !isNaN(parent_id)) {
            parent = await this.blogCommentRepo.findOneBy({ parent_id })
            if (!parent) throw new NotFoundException(COMMENT_MESSAGES.NOTFOUND)
        }
        await this.blogCommentRepo.insert({
            text,
            accepted: true,
            blog_id,
            parent_id: parent,
            user_id: user!.id
        })
        return {
            message: COMMENT_MESSAGES.SUCCESS
        }
    }
    async find(paginationDto: PaginationDto) {
        const { limit, page, skip } = PaginationResolver(paginationDto)
        const [comments, count] = await this.blogCommentRepo.findAndCount({
            where: {},
            relations: {
                blog: true,
                user: { profile: true }
            },
            select: {
                blog: {
                    title: true
                },
                user: {
                    username: true,
                    profile: {
                        nick_name: true
                    }
                }
            },
            skip,
            take: limit,
            order: { id: "DESC" }
        })

        return {
            pagination: paginationGenerator(count, page, limit),
            comments
        }
    }
    async accept(id: number) {
        const comment = await this.checkCommentExistsById(id)
        if (comment.accepted) throw new BadRequestException(COMMENT_MESSAGES.ALREADY_ACCEPTED)
        comment.accepted = true
        await this.blogCommentRepo.save(comment)
        return {
            message: COMMENT_MESSAGES.ACCEPTED
        }
    }
    async reject(id: number) {
        const comment = await this.checkCommentExistsById(id)
        if (!comment.accepted) throw new BadRequestException(COMMENT_MESSAGES.ALREADY_REJECTED)
        comment.accepted = false
        await this.blogCommentRepo.save(comment)
        return {
            message: COMMENT_MESSAGES.REJECT
        }
    }

    async checkCommentExistsById(id: number) {
        const comment = await this.blogCommentRepo.findOneBy({ id })
        if (!comment) throw new NotFoundException(COMMENT_MESSAGES.NOTFOUND)
        return comment
    }

}  
