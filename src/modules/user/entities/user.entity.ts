import { BaseEntity } from './../../../common/abstracts/base.entity';
import { EntityNames } from "src/common/enums/entity.enum";
import { Column, CreateDateColumn, Entity, OneToOne, UpdateDateColumn } from "typeorm";
import { OtpEntity } from './otp.entity';
import { ProfileEntity } from './profile.entity';

@Entity(EntityNames.USER)
export class UserEntity extends BaseEntity {
    @Column({unique:true})
    username?:string
    @Column({unique:true , nullable:true})
    mobile?:string
    @Column({unique:true})
    email!:string
    @Column({nullable:true})
    pending_email!:string|null
    @Column()
    password:string
    @Column({default:false})
    verified!:boolean
    @CreateDateColumn({default:new Date()})
    created_at!:Date
    @UpdateDateColumn({default:new Date()})
    updated_at!:Date
    @OneToOne(()=>OtpEntity,otp => otp.user)
    otp!:OtpEntity
    @OneToOne(()=>ProfileEntity , profile => profile.user,{onDelete:"CASCADE"})
    profile:ProfileEntity
}
