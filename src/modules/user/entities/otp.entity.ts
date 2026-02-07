import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntityNames } from "src/common/enums/entity.enum";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity(EntityNames.OTP)
export class OtpEntity extends BaseEntity{
    @Column()
    code:number
    @CreateDateColumn()
    expires_in:Date
    @Column()
    user_id:number
    @OneToOne(()=>UserEntity, user=>user.otp,{nullable:true , onDelete:"CASCADE"})
    @JoinColumn({name:"user_id"})
    user:UserEntity
}
