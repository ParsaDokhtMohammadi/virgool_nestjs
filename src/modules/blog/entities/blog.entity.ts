import { BaseEntity } from "src/common/abstracts/base.entity";
import { BLOG_STATUS } from "src/common/enums/blogStatus.enum";
import { EntityNames } from "src/common/enums/entity.enum";
import { Column, CreateDateColumn, Entity, UpdateDateColumn } from "typeorm";

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
    @Column()
    image:string
    @Column()
    authorId:number
    @CreateDateColumn()
    created_at:Date
    @UpdateDateColumn()
    updated_at:Date
}