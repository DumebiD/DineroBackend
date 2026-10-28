import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1793190753382 implements MigrationInterface {
    name = 'Init1793190753382'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."rule_transactiontype_enum" AS ENUM('Transfer')`);
        await queryRunner.query(`CREATE TYPE "public"."rule_action_enum" AS ENUM('ApplyFee', 'Waive')`);
        await queryRunner.query(`CREATE TABLE "rule" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "summary" character varying NOT NULL, "active" boolean NOT NULL, "priority" integer NOT NULL, "transactionType" "public"."rule_transactiontype_enum" NOT NULL, "action" "public"."rule_action_enum" NOT NULL DEFAULT 'ApplyFee', "approverGroup" character varying, "conditions" jsonb NOT NULL DEFAULT '{"all": []}', "flatAmount" numeric(18,2) NOT NULL DEFAULT '0', "percent" numeric(7,4) NOT NULL DEFAULT '0', "minFee" numeric(18,2), "maxFee" numeric(18,2), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a5577f464213af7ffbe866e3cb5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "email" character varying NOT NULL, "passwordHash" character varying NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "rule"`);
        await queryRunner.query(`DROP TYPE "public"."rule_action_enum"`);
        await queryRunner.query(`DROP TYPE "public"."rule_transactiontype_enum"`);
    }

}
