import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1793150527989 implements MigrationInterface {
    name = 'Init1793150527989'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rule" ALTER COLUMN "conditions" SET DEFAULT '{"all":[]}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rule" ALTER COLUMN "conditions" SET DEFAULT '{"all": []}'`);
    }

}
