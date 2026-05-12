BEGIN TRY

BEGIN TRAN;

-- Drop duplicate active reviews (keep oldest per (articleId, reviewerId)) so the
-- unique index can be created safely. Soft-deleted rows are left untouched.
WITH ranked AS (
    SELECT
        [id],
        ROW_NUMBER() OVER (
            PARTITION BY [articleId], [reviewerId]
            ORDER BY [createdOn] ASC
        ) AS rn
    FROM [dbo].[Review]
    WHERE [deletedOn] IS NULL
)
UPDATE r
SET [deletedOn] = CURRENT_TIMESTAMP
FROM [dbo].[Review] r
INNER JOIN ranked ON ranked.[id] = r.[id]
WHERE ranked.rn > 1;

-- AlterTable: add unique constraint on (articleId, reviewerId).
ALTER TABLE [dbo].[Review]
ADD CONSTRAINT [Review_articleId_reviewerId_key] UNIQUE NONCLUSTERED ([articleId], [reviewerId]);

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
