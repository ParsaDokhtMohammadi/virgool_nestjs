import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntityNames } from "src/common/enums/entity.enum";
import { UserEntity } from "src/modules/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { BlogEntity } from "./blog.entity";

@Entity(EntityNames.BLOG_BOOKMARK)
export class BlogBookmarksEntity extends BaseEntity {
    @Column()
    blog_id: number
    @Column()
    user_id: number
    @ManyToOne(() => UserEntity, user => user.blog_bookmarks, { onDelete: "CASCADE" })
    @JoinColumn({ name: "user_id" })
    user: UserEntity
    @ManyToOne(() => BlogEntity, blog => blog.bookmarks, { onDelete: "CASCADE" })
    @JoinColumn({ name: "blog_id" })
    blog: BlogEntity
}