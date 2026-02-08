import { EntityNames } from "src/common/enums/entity.enum";
import { BaseEntity, Column, Entity } from "typeorm";

@Entity(EntityNames.CATEGORY)
export class CategoryEntity extends BaseEntity{
    @Column()
    title:string
    @Column({nullable:true})
    priority:number
}
