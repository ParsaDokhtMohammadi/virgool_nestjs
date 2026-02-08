import { ConflictException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import { CATEGORY_MESSAGES } from 'src/common/enums/message.enum';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity) private categoryRepo:Repository<CategoryEntity>
  ){}
  async create(createCategoryDto: CreateCategoryDto) {
    let {priority,title} = createCategoryDto
    title = await this.checkExistsAndResolveTitle(title)
    const category = this.categoryRepo.create({
      title,
      priority
    })
    await this.categoryRepo.save(category)
    return {
      message:"category created"
    }
  }
  async checkExistsAndResolveTitle(title:string){
    title = title?.trim()?.toLowerCase()
    const category = await this.categoryRepo.findOneBy({title})
    if(category) throw new ConflictException(CATEGORY_MESSAGES.CONFLICT)
    return title
  }

  findAll() {
    return `This action returns all category`;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
