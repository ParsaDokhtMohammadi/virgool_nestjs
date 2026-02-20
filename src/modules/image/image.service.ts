import { Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { ImageDto } from './dto/create-image.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageEntity } from './entities/image.entity';
import { Repository } from 'typeorm';
import { MulterFile } from 'src/common/utils/multer.utils';
import { REQUEST } from '@nestjs/core';
import type { AuthRequest } from 'src/common/types/authRequest.type';
import { IMAGE_MESSAGES } from 'src/common/enums/message.enum';


@Injectable({ scope: Scope.REQUEST })
export class ImageService {
  constructor(
    @InjectRepository(ImageEntity) private imageRepo: Repository<ImageEntity>,
    @Inject(REQUEST) private request: AuthRequest
  ) { }
  async create(imageDto: ImageDto, image: MulterFile) {
    const { alt, name } = imageDto
    const user = this.request.user
    let location = image?.path?.slice(7)
    await this.imageRepo.insert({
      alt: alt || name,
      name,
      location,
      user_id: user!.id
    })
    return {
      message: IMAGE_MESSAGES.ADDED
    }
  }

  findAll() {
    const user = this.request.user
    return this.imageRepo.find({
      where: { user_id: user!.id },
      order: { id: "DESC" }
    })
  }

  async findOne(id: number) {
    const user = this.request.user
    const image =await this.imageRepo.findOne({
      where: { user_id: user!.id , id},
      order: { id: "DESC" }
    })
    if(!image) throw new NotFoundException(IMAGE_MESSAGES.NOTFOUND)
    return image
    
  }



  async remove(id: number) {
    const image = await this.findOne(id)
    await this.imageRepo.remove(image)
    return {
      message:IMAGE_MESSAGES.DELETED
    }
  }
}
