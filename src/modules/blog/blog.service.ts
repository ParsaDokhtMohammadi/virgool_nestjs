import { Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogEntity } from './entities/blog.entity';
import { Repository } from 'typeorm';
import { CreateBlogDto } from './dto/blog.dto';
import { generateSlug, randomId } from 'src/common/utils/genSlug.utils';
import type{ AuthRequest } from 'src/common/types/authRequest.type';
import { REQUEST } from '@nestjs/core';
import { BLOG_MESSAGE } from 'src/common/enums/message.enum';


@Injectable({scope:Scope.REQUEST})
export class BlogService {
    constructor(
        @InjectRepository(BlogEntity) private blogRepo: Repository<BlogEntity>,
        @Inject(REQUEST) private request:AuthRequest,
    ) { }
    async create(Dto: CreateBlogDto) {
        const user = this.request.user
        const { title, slug , description,content,image,read_time } = Dto
        let SlugData = slug ?? title  
        Dto.slug = `${generateSlug(SlugData)}-${randomId()}`
        const blog = this.blogRepo.create({
            title,
            slug:Dto.slug,
            description,
            content,
            image,
            read_time,
            author_id:user?.id
        })
        await this.blogRepo.save(blog)
        return {
            message:BLOG_MESSAGE.CREATED
        }
        
    }

}
