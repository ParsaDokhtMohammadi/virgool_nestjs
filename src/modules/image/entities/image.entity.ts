import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntityNames } from "src/common/enums/entity.enum";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { AfterLoad, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity(EntityNames.IMAGE)
export class ImageEntity extends BaseEntity {
    @Column()
    name:string
    @Column()
    location:string
    @Column()
    alt:string
    @Column()
    user_id:number
    @CreateDateColumn()
    created_at:Date
    @ManyToOne(()=>UserEntity,user=>user.images,{onDelete:"CASCADE"})
    @JoinColumn({name:"user_id"})
    user:UserEntity
    @AfterLoad()
    map(){
        this.location = `http:.//localhost:3000/${this.location}`
    }
}
