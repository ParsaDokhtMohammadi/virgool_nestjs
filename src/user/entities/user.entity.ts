import { BaseEntity } from './../../common/abstracts/base.entity';
import { EntityNames } from "src/common/enums/entity.enum";
import { Column, CreateDateColumn, Entity, UpdateDateColumn } from "typeorm";

@Entity(EntityNames.USER)
export class UserEntity extends BaseEntity {
    @Column({unique:true})
    username:string
    @Column({unique:true , nullable:true})
    mobile:string
    @Column({unique:true})
    email:string
    @CreateDateColumn()
    created_at:Date
    @UpdateDateColumn()
    updated_at:Date
}
