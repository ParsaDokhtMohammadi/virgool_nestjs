import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogEntity } from './entities/blog.entity';
import { Repository } from 'typeorm';
import { CreateBlogDto } from './dto/blog.dto';
import { generateSlug } from 'src/common/utils/genSlug.utils';

@Injectable()
export class BlogService {
    constructor(
        @InjectRepository(BlogEntity) private blogRepo: Repository<BlogEntity>
    ) { }
    async create(Dto: CreateBlogDto) {
        const { title, slug } = Dto
        let SlugData = slug ?? title      
        Dto.slug = generateSlug(SlugData)
        return Dto
    }
}
