BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[ArticleAttachment] (
    [id] NVARCHAR(1000) NOT NULL,
    [articleId] NVARCHAR(1000) NOT NULL,
    [storedName] NVARCHAR(1000) NOT NULL,
    [originalName] NVARCHAR(1000) NOT NULL,
    [mimeType] NVARCHAR(1000) NOT NULL,
    [size] INT NOT NULL,
    [checksum] NVARCHAR(1000) NOT NULL,
    [uploaderId] NVARCHAR(1000) NOT NULL,
    [createdOn] DATETIME2 NOT NULL CONSTRAINT [ArticleAttachment_createdOn_df] DEFAULT CURRENT_TIMESTAMP,
    [deletedOn] DATETIME2,
    CONSTRAINT [ArticleAttachment_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [ArticleAttachment_storedName_key] UNIQUE NONCLUSTERED ([storedName])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [ArticleAttachment_articleId_idx] ON [dbo].[ArticleAttachment]([articleId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [ArticleAttachment_uploaderId_idx] ON [dbo].[ArticleAttachment]([uploaderId]);

-- AddForeignKey
ALTER TABLE [dbo].[ArticleAttachment] ADD CONSTRAINT [ArticleAttachment_articleId_fkey] FOREIGN KEY ([articleId]) REFERENCES [dbo].[Article]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ArticleAttachment] ADD CONSTRAINT [ArticleAttachment_uploaderId_fkey] FOREIGN KEY ([uploaderId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
