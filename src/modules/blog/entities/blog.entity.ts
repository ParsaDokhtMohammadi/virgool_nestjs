import { BaseEntity } from "src/common/abstracts/base.entity";
import { BLOG_STATUS } from "src/common/enums/blogStatus.enum";
import { EntityNames } from "src/common/enums/entity.enum";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, UpdateDateColumn } from "typeorm";
import { BlogLikesEntity } from "./like.entity";
import { BlogBookmarksEntity } from "./bookmark.entity";
import { BlogCommentEntiy } from "./comment.entity";
import { BlogCategoryEntity } from "./blog_category.entity";

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
    @Column({unique:true})
    slug:string
    @Column()
    read_time:number
    @Column()
    author_id:number
    @ManyToOne(()=>UserEntity , user=>user.blogs,{onDelete:"CASCADE"})
    @JoinColumn({name:"author_id"})
    user:UserEntity
    @OneToMany(()=>BlogLikesEntity,likes=>likes.blog)
    likes:BlogLikesEntity[]
    @OneToMany(()=>BlogBookmarksEntity,bookmarks=>bookmarks.blog)
    bookmarks:BlogBookmarksEntity[]
    @OneToMany(()=>BlogCommentEntiy,comment=>comment.blog)
    comments:BlogCommentEntiy[]
    @OneToMany(()=>BlogCommentEntiy,category=>category.blog)
    categories:BlogCategoryEntity[]

    @CreateDateColumn()
    created_at:Date
    @UpdateDateColumn()
    updated_at:Date
}