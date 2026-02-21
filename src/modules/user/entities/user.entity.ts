import { BaseEntity } from './../../../common/abstracts/base.entity';
import { EntityNames } from "src/common/enums/entity.enum";
import { Column, CreateDateColumn, Entity, OneToMany, OneToOne, UpdateDateColumn } from "typeorm";
import { OtpEntity } from './otp.entity';
import { ProfileEntity } from './profile.entity';
import { BlogEntity } from 'src/modules/blog/entities/blog.entity';
import { BlogLikesEntity } from 'src/modules/blog/entities/like.entity';
import { BlogBookmarksEntity } from 'src/modules/blog/entities/bookmark.entity';
import { BlogCommentEntiy } from 'src/modules/blog/entities/comment.entity';
import { ImageEntity } from 'src/modules/image/entities/image.entity';
import { ROLES } from 'src/common/enums/role.enum';
import { FollowEntity } from './follow.entity';

@Entity(EntityNames.USER)
export class UserEntity extends BaseEntity {
    @Column({unique:true})
    username?:string
    @Column({unique:true , nullable:true})
    mobile?:string
    @Column({unique:true})
    email!:string
    @Column({type: 'varchar',nullable:true})
    pending_email:string|null
    @Column()
    password:string
    @Column({nullable:true})
    status:string|null
    @Column({default:false})
    verified!:boolean
    @Column({default:ROLES.USER})
    role:string
    @CreateDateColumn({default:new Date()})
    created_at!:Date
    @UpdateDateColumn({default:new Date()})
    updated_at!:Date
    @OneToOne(()=>OtpEntity,otp => otp.user)
    otp!:OtpEntity
    @OneToOne(()=>ProfileEntity , profile => profile.user,{onDelete:"CASCADE"})
    profile:ProfileEntity
    @OneToMany(()=>BlogEntity,blogs=>blogs.user)
    blogs:BlogEntity[]
    @OneToMany(()=>BlogLikesEntity,likes=>likes.user)
    blog_likes:BlogLikesEntity[]
    @OneToMany(()=>BlogBookmarksEntity,bookmarks=>bookmarks.user)
    blog_bookmarks:BlogBookmarksEntity[]
    @OneToMany(()=>BlogCommentEntiy,comment=>comment.user)
    blog_comments:BlogCommentEntiy[]
    @OneToMany(()=>ImageEntity,image=>image.user)
    images:ImageEntity[]
    @OneToMany(()=>FollowEntity,follow=>follow.following)
    followers:FollowEntity[]
    @OneToMany(()=>FollowEntity,follow=>follow.followers)
    followings:FollowEntity[]
}
