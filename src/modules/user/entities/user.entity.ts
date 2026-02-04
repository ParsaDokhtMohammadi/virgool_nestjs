import { BaseEntity } from './../../../common/abstracts/base.entity';
import { EntityNames } from "src/common/enums/entity.enum";
import { Column, CreateDateColumn, Entity, OneToOne, UpdateDateColumn } from "typeorm";
import { OtpEntity } from './otp.entity';

@Entity(EntityNames.USER)
export class UserEntity extends BaseEntity {
    @Column({unique:true})
    username:string
    @Column({unique:true , nullable:true})
    mobile:string
    @Column({unique:true})
    email:string
    @Column()
    password:string
    @CreateDateColumn()
    created_at:Date
    @UpdateDateColumn()
    updated_at:Date
    @OneToOne(()=>OtpEntity,otp => otp.user,{onDelete:"CASCADE"})
    otp:OtpEntity
}
