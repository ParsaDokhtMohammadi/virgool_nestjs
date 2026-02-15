import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntityNames } from "src/common/enums/entity.enum";
import { Column, Entity, ManyToOne } from "typeorm";
import { BlogEntity } from "./blog.entity";
import { CategoryEntity } from "src/modules/category/entities/category.entity";

@Entity(EntityNames.BLOG_CATEGORY)
export class BlogCategoryEntity extends BaseEntity {
    @Column()
    blog_id:number
    @Column()
    category_id:number
    @ManyToOne(()=>BlogEntity,blog=>blog.categories , {onDelete:"CASCADE"})
    blog:BlogEntity
    @ManyToOne(()=>CategoryEntity,category=>category.blog_category , {onDelete:"CASCADE"} )
    category:CategoryEntity
}