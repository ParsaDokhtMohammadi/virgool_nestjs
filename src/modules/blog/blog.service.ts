import { Inject, Injectable, Scope } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogEntity } from './entities/blog.entity';
import { Repository } from 'typeorm';
import { CreateBlogDto } from './dto/blog.dto';
import { generateSlug, randomId } from 'src/common/utils/genSlug.utils';
import type{ AuthRequest } from 'src/common/types/authRequest.type';
import { REQUEST } from '@nestjs/core';
import { BLOG_MESSAGE } from 'src/common/enums/message.enum';
import { PaginationDto } from 'src/common/Dtos/pagination.dto';
import { paginationGenerator, PaginationResolver } from 'src/common/utils/pagination.utils';


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
    async getMyBlogs(){
        const user = this.request.user
        return this.blogRepo.find({
            where:{author_id:user!.id},
            order:{id:"DESC"}
        })
    }
    async blogList(Dto:PaginationDto){
        const {limit,page,skip} = PaginationResolver(Dto)
        const [blogs,count] = await this.blogRepo.findAndCount({
            where:{},
            order:{id:"DESC"},
            skip,
            take:limit
        })
        return {
            pagination:paginationGenerator(count,page,limit),
            blogs
        }
    }
}
