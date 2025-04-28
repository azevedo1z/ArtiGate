/*
  Warnings:

  - Added the required column `updatedOn` to the `Address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedOn` to the `Article` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedOn` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedOn` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Address" ADD COLUMN     "createdOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedOn" TIMESTAMP(3),
ADD COLUMN     "updatedOn" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "createdOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedOn" TIMESTAMP(3),
ADD COLUMN     "updatedOn" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "ArticleAuthor" ADD COLUMN     "createdOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedOn" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "createdOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedOn" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "createdOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedOn" TIMESTAMP(3),
ADD COLUMN     "updatedOn" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "createdOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedOn" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedOn" TIMESTAMP(3),
ADD COLUMN     "updatedOn" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "UserRole" ADD COLUMN     "createdOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedOn" TIMESTAMP(3);
