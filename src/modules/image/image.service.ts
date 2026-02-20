import { Injectable } from '@nestjs/common';
import { ImageDto } from './dto/create-image.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageEntity } from './entities/image.entity';
import { Repository } from 'typeorm';
import { MulterFile } from 'src/common/utils/multer.utils';


@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(ImageEntity) private image:Repository<ImageEntity>
  ){}
  create(createImageDto: ImageDto , image:MulterFile) {
    return 'This action adds a new image';
  }

  findAll() {
    return `This action returns all image`;
  }
 
  findOne(id: number) {
    return `This action returns a #${id} image`;
  }



  remove(id: number) {
    return `This action removes a #${id} image`;
  }
}
