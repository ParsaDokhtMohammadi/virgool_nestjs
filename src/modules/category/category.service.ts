import { PaginationDto } from 'src/common/Dtos/pagination.dto';
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import { CATEGORY_MESSAGES } from 'src/common/enums/message.enum';
import { paginationGenerator, PaginationResolver } from 'src/common/utils/pagination.utils';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity) private categoryRepo: Repository<CategoryEntity>
  ) { }
  async create(createCategoryDto: CreateCategoryDto) {
    let { priority, title } = createCategoryDto
    title = await this.checkExistsAndResolveTitle(title)
    const category = this.categoryRepo.create({
      title,
      priority
    })
    await this.categoryRepo.save(category)
    return {
      message: "category created"
    }
  }
  async insertByTitle(title:string) {
    const category = this.categoryRepo.create({
      title,  
    })
    return await this.categoryRepo.save(category)
  }
  async checkExistsAndResolveTitle(title: string) {
    title = title?.trim()?.toLowerCase()
    const category = await this.categoryRepo.findOneBy({ title })
    if (category) throw new ConflictException(CATEGORY_MESSAGES.CONFLICT)
    return title
  }

  async findAll(Dto: PaginationDto) {
    const { limit, page, skip } = PaginationResolver(Dto)
    const [categories, count] = await this.categoryRepo.findAndCount({
      where: {},
      skip,
      take: limit
    })
    return {
      pagination: paginationGenerator(count, page, limit),
      categories
    }
  }

  async findOne(id: number) {
    const category = await this.categoryRepo.findOneBy({ id });
    if (!category) throw new NotFoundException(CATEGORY_MESSAGES.NOT_FOUND)
    return  category
    
  }
  async findOneByTitle(title:string) {
    return await this.categoryRepo.findOneBy({ title });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id)
    const {title,priority} = updateCategoryDto
    if(!title && !priority) throw new BadRequestException(CATEGORY_MESSAGES.INVALID_UPDATE_DATA)
    if(title) category.title = title
    if(priority) category.priority = priority
    await this.categoryRepo.save(category)
    return {
      message:CATEGORY_MESSAGES.UPDATE_SUCCESS
    }
  }

  async remove(id: number) {
    const category = await this.findOne(id)
    if(category) await this.categoryRepo.delete(id)
    return {
      message:CATEGORY_MESSAGES.DELETED
    }
  }
}
