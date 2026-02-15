import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntityNames } from "src/common/enums/entity.enum";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { BlogEntity } from "./blog.entity";
import { UserEntity } from "src/modules/user/entities/user.entity";

@Entity(EntityNames.BLOG_COMMENTS)
export class BlogCommentEntiy extends BaseEntity {
    @Column()
    text:string
    @Column({default:true})
    accepted:boolean
    @Column()
    blog_id:number
    @Column()
    user_id:number
    @Column({nullable:true})
    parent_id:number
    @CreateDateColumn()
    created_at:Date
    @ManyToOne(()=>UserEntity,user=>user.blog_comments,{onDelete:"CASCADE"})
    @JoinColumn({name:"user_id"})
    user:UserEntity[]
    @ManyToOne(()=>BlogEntity,blog=>blog.comments,{onDelete:"CASCADE"})
    @JoinColumn({name:"blog_id"})
    blog:BlogEntity[]
    @ManyToOne(()=>BlogCommentEntiy,parent=>parent.children,{onDelete:"CASCADE"})
    parent:BlogCommentEntiy[]
    @OneToMany(()=>BlogCommentEntiy,comment=>comment.parent)
    @JoinColumn({name:"parent_id"})
    children:BlogCommentEntiy

}