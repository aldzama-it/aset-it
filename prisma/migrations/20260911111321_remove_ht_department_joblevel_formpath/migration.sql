/*
  Warnings:

  - You are about to drop the column `department` on the `Ht` table. All the data in the column will be lost.
  - You are about to drop the column `job_level` on the `Ht` table. All the data in the column will be lost.
  - You are about to drop the column `form_path` on the `Ht` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Ht` DROP COLUMN `department`,
    DROP COLUMN `job_level`,
    DROP COLUMN `form_path`;
