import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRoleSettingAndRbacTables1792163379568 implements MigrationInterface {
    name = 'AddRoleSettingAndRbacTables1792163379568'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "TM_path_setting" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying NOT NULL, "route" character varying NOT NULL, "description" character varying NOT NULL, "status" character varying NOT NULL, "created_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "is_deleted" boolean NOT NULL DEFAULT false, "created_by" character varying, "updated_by" character varying, CONSTRAINT "UQ_15cd0d9c5dd8859a0b64c00534a" UNIQUE ("code"), CONSTRAINT "PK_b935dc25178642b83139c7e0038" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "TM_role_path_assignment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "create" boolean NOT NULL, "view" boolean NOT NULL, "delete" boolean NOT NULL, "update" boolean NOT NULL, "import" boolean NOT NULL, "export" boolean NOT NULL, "created_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "is_deleted" boolean NOT NULL DEFAULT false, "created_by" character varying, "updated_by" character varying, "path_id" uuid, "role_id" uuid, CONSTRAINT "PK_a037bb09568b6f9fc1f460fd909" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "TM_role_setting" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying NOT NULL, "description" character varying NOT NULL, "status" character varying NOT NULL, "created_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "is_deleted" boolean NOT NULL DEFAULT false, "created_by" character varying, "updated_by" character varying, CONSTRAINT "UQ_1a2bb903ed18eed869e12720bdf" UNIQUE ("code"), CONSTRAINT "PK_be2d52fe90a15935b317dd391aa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD "role_setting_id" uuid`);
        await queryRunner.query(`ALTER TABLE "TM_role_path_assignment" ADD CONSTRAINT "FK_bae05194b703f66f9cc0a3ebfd3" FOREIGN KEY ("path_id") REFERENCES "TM_path_setting"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "TM_role_path_assignment" ADD CONSTRAINT "FK_c10cf140b03cca77b052f8615a8" FOREIGN KEY ("role_id") REFERENCES "TM_role_setting"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_8a00808f99feafe7da389cdd315" FOREIGN KEY ("role_setting_id") REFERENCES "TM_role_setting"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_8a00808f99feafe7da389cdd315"`);
        await queryRunner.query(`ALTER TABLE "TM_role_path_assignment" DROP CONSTRAINT "FK_c10cf140b03cca77b052f8615a8"`);
        await queryRunner.query(`ALTER TABLE "TM_role_path_assignment" DROP CONSTRAINT "FK_bae05194b703f66f9cc0a3ebfd3"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role_setting_id"`);
        await queryRunner.query(`DROP TABLE "TM_role_setting"`);
        await queryRunner.query(`DROP TABLE "TM_role_path_assignment"`);
        await queryRunner.query(`DROP TABLE "TM_path_setting"`);
    }

}
