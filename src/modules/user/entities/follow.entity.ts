import { BaseEntity } from "src/common/abstracts/base.entity";
import { EntityNames } from "src/common/enums/entity.enum";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { UserEntity } from "./user.entity";

@Entity(EntityNames.FOLLOW)
export class FollowEntity extends BaseEntity {
    @Column()
    following_id:number
    @Column()
    follower_id:number
    @ManyToOne(()=>UserEntity , user=>user.followings,{onDelete:"CASCADE"})
    @JoinColumn({name:"following_id"})
    following:UserEntity
    @ManyToOne(()=>UserEntity , user=>user.followers,{onDelete:"CASCADE"})
    @JoinColumn({name:"follower_id"})
    follower:UserEntity

}