import { BaseEntity } from "src/common/abstracts/base.entity";
import { BLOG_STATUS } from "src/common/enums/blogStatus.enum";
import { EntityNames } from "src/common/enums/entity.enum";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, UpdateDateColumn } from "typeorm";

@Entity(EntityNames.BLOG)
export class BlogEntity extends BaseEntity {
    @Column()
    title:string
    @Column()
    description:string
    @Column()
    content:string
    @Column({enum:BLOG_STATUS,default:BLOG_STATUS.DRAFT})
    status:string
    @Column({nullable:true})
    image:string
    @Column()
    author_id:number
    @ManyToOne(()=>UserEntity , user=>user.blogs,{onDelete:"CASCADE"})
    @JoinColumn({name:"author_id"})
    user:UserEntity
    @CreateDateColumn()
    created_at:Date
    @UpdateDateColumn()
    updated_at:Date
}