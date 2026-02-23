import { EntityNames } from "src/common/enums/entity.enum";
import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class  $npmConfigName1771828708138 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
                const username = await queryRunner.hasColumn(EntityNames.USER,"username")
                if(username) await queryRunner.changeColumn(EntityNames .USER,"username",new TableColumn({
                    name:"username",
                    isNullable:false,
                    isUnique:true,
                    type:"varchar(50)"
                }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        
    }

}
