import { EntityNames } from 'src/common/enums/entity.enum';
import { BaseEntity } from './../../../common/abstracts/base.entity';
import { Column, Entity } from "typeorm";

@Entity(EntityNames.PROFILE)
export class ProfileEntity extends BaseEntity {
    @Column()
    nick_name: string
    @Column({nullable:true})
    bio:string
    @Column({nullable:true})
    image_profile:string
    @Column({nullable:true})
    image_bg:string
    @Column({nullable:true})
    gender:string
    @Column({nullable:true})
    birthday:Date
    @Column({nullable:true})
    linkedin_profile:string
}