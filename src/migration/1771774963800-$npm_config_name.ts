import { EntityNames } from "src/common/enums/entity.enum";
import { ROLES } from "src/common/enums/role.enum";
import { USER_STATUS } from "src/common/enums/userStatus.enum";
import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class  $npmConfigName1771774963800 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name:EntityNames.USER,
                columns:[
                    {name:"id",isPrimary:true,type:"serial",isNullable:false},
                    {name:"username",type:"varchar(50)",isNullable:false,isUnique:true},
                    {name:"email",type:"varchar(100)",isNullable:false,isUnique:true},
                    {name:"new_email",type:"varchar(100)",isNullable:true,isUnique:true},
                    {name:"role",type:"enum",enum:[ROLES.ADMIN,ROLES.USER]},
                    {name:"status",type:"enum",enum:[USER_STATUS.BLOCKED,USER_STATUS.REPORT],isNullable:true , default:null},
                    {name:"password",type:"varchar(20)",isNullable:false},
                    {name:"created_at",type:"timestamp",default:"now()"}
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
       await queryRunner.dropTable(EntityNames.USER ,true)
    }

}
