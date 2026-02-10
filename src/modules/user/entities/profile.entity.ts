import { EntityNames } from 'src/common/enums/entity.enum';
import { BaseEntity } from './../../../common/abstracts/base.entity';
import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { UserEntity } from './user.entity';

@Entity(EntityNames.PROFILE)
export class ProfileEntity extends BaseEntity {
    @Column({nullable:true})
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
    @Column({nullable:true})
    x_profile:string
    @Column()
    user_id:number
    @OneToOne(()=>UserEntity,user=>user.profile , {onDelete:"CASCADE"})
    @JoinColumn({name:"user_id"})
    user:UserEntity
}