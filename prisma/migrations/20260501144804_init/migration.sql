BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[Role] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [createdOn] DATETIME2 NOT NULL CONSTRAINT [Role_createdOn_df] DEFAULT CURRENT_TIMESTAMP,
    [deletedOn] DATETIME2,
    CONSTRAINT [Role_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Role_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[UserRole] (
    [id] NVARCHAR(1000) NOT NULL,
    [userId] NVARCHAR(1000) NOT NULL,
    [roleId] NVARCHAR(1000) NOT NULL,
    [createdOn] DATETIME2 NOT NULL CONSTRAINT [UserRole_createdOn_df] DEFAULT CURRENT_TIMESTAMP,
    [deletedOn] DATETIME2,
    CONSTRAINT [UserRole_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [UserRole_userId_roleId_key] UNIQUE NONCLUSTERED ([userId],[roleId])
);

-- CreateTable
CREATE TABLE [dbo].[User] (
    [id] NVARCHAR(1000) NOT NULL,
    [name] NVARCHAR(1000) NOT NULL,
    [homeAddressId] NVARCHAR(1000) NOT NULL,
    [jobAddressId] NVARCHAR(1000) NOT NULL,
    [phone] NVARCHAR(1000) NOT NULL,
    [email] NVARCHAR(1000) NOT NULL,
    [badgeUrl] NVARCHAR(1000) NOT NULL,
    [passwordHash] NVARCHAR(1000) NOT NULL,
    [createdOn] DATETIME2 NOT NULL CONSTRAINT [User_createdOn_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedOn] DATETIME2 NOT NULL,
    [deletedOn] DATETIME2,
    CONSTRAINT [User_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [User_email_key] UNIQUE NONCLUSTERED ([email])
);

-- CreateTable
CREATE TABLE [dbo].[Address] (
    [id] NVARCHAR(1000) NOT NULL,
    [zipCode] NVARCHAR(1000) NOT NULL,
    [street] NVARCHAR(1000) NOT NULL,
    [complement] NVARCHAR(1000),
    [neighborhood] NVARCHAR(1000) NOT NULL,
    [city] NVARCHAR(1000) NOT NULL,
    [state] NVARCHAR(1000) NOT NULL,
    [country] NVARCHAR(1000) NOT NULL CONSTRAINT [Address_country_df] DEFAULT 'Brazil',
    [createdOn] DATETIME2 NOT NULL CONSTRAINT [Address_createdOn_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedOn] DATETIME2 NOT NULL,
    [deletedOn] DATETIME2,
    CONSTRAINT [Address_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Article] (
    [id] NVARCHAR(1000) NOT NULL,
    [summary] NVARCHAR(1000) NOT NULL,
    [scoreAvg] FLOAT(53) NOT NULL CONSTRAINT [Article_scoreAvg_df] DEFAULT 0,
    [createdOn] DATETIME2 NOT NULL CONSTRAINT [Article_createdOn_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedOn] DATETIME2 NOT NULL,
    [deletedOn] DATETIME2,
    CONSTRAINT [Article_pkey] PRIMARY KEY CLUSTERED ([id])
);

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

-- CreateTable
CREATE TABLE [dbo].[ArticleAuthor] (
    [id] NVARCHAR(1000) NOT NULL,
    [articleId] NVARCHAR(1000) NOT NULL,
    [userId] NVARCHAR(1000) NOT NULL,
    [createdOn] DATETIME2 NOT NULL CONSTRAINT [ArticleAuthor_createdOn_df] DEFAULT CURRENT_TIMESTAMP,
    [deletedOn] DATETIME2,
    CONSTRAINT [ArticleAuthor_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [ArticleAuthor_articleId_userId_key] UNIQUE NONCLUSTERED ([articleId],[userId])
);

-- CreateTable
CREATE TABLE [dbo].[Review] (
    [id] NVARCHAR(1000) NOT NULL,
    [articleId] NVARCHAR(1000) NOT NULL,
    [reviewerId] NVARCHAR(1000) NOT NULL,
    [score] FLOAT(53) NOT NULL CONSTRAINT [Review_score_df] DEFAULT 0,
    [commentary] NVARCHAR(1000) NOT NULL,
    [createdOn] DATETIME2 NOT NULL CONSTRAINT [Review_createdOn_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedOn] DATETIME2 NOT NULL,
    [deletedOn] DATETIME2,
    CONSTRAINT [Review_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[Payment] (
    [id] NVARCHAR(1000) NOT NULL,
    [userId] NVARCHAR(1000) NOT NULL,
    [amount] DECIMAL(12,2) NOT NULL,
    [currency] NVARCHAR(1000) NOT NULL CONSTRAINT [Payment_currency_df] DEFAULT 'BRL',
    [status] NVARCHAR(1000) NOT NULL CONSTRAINT [Payment_status_df] DEFAULT 'pending',
    [description] NVARCHAR(1000),
    [paymentMethodId] NVARCHAR(1000),
    [payerEmail] NVARCHAR(1000) NOT NULL,
    [gatewayPaymentId] NVARCHAR(1000),
    [idempotencyKey] NVARCHAR(1000) NOT NULL,
    [failureReason] NVARCHAR(1000),
    [rawGatewayResponse] NVARCHAR(max),
    [createdOn] DATETIME2 NOT NULL CONSTRAINT [Payment_createdOn_df] DEFAULT CURRENT_TIMESTAMP,
    [updatedOn] DATETIME2 NOT NULL,
    [deletedOn] DATETIME2,
    CONSTRAINT [Payment_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Payment_gatewayPaymentId_key] UNIQUE NONCLUSTERED ([gatewayPaymentId]),
    CONSTRAINT [Payment_idempotencyKey_key] UNIQUE NONCLUSTERED ([idempotencyKey])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [UserRole_roleId_idx] ON [dbo].[UserRole]([roleId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [ArticleAttachment_articleId_idx] ON [dbo].[ArticleAttachment]([articleId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [ArticleAttachment_uploaderId_idx] ON [dbo].[ArticleAttachment]([uploaderId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [ArticleAuthor_articleId_idx] ON [dbo].[ArticleAuthor]([articleId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [ArticleAuthor_userId_idx] ON [dbo].[ArticleAuthor]([userId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Review_articleId_idx] ON [dbo].[Review]([articleId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Review_reviewerId_idx] ON [dbo].[Review]([reviewerId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Payment_userId_idx] ON [dbo].[Payment]([userId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Payment_gatewayPaymentId_idx] ON [dbo].[Payment]([gatewayPaymentId]);

-- CreateIndex
CREATE NONCLUSTERED INDEX [Payment_status_idx] ON [dbo].[Payment]([status]);

-- AddForeignKey
ALTER TABLE [dbo].[UserRole] ADD CONSTRAINT [UserRole_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[UserRole] ADD CONSTRAINT [UserRole_roleId_fkey] FOREIGN KEY ([roleId]) REFERENCES [dbo].[Role]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[User] ADD CONSTRAINT [User_homeAddressId_fkey] FOREIGN KEY ([homeAddressId]) REFERENCES [dbo].[Address]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[User] ADD CONSTRAINT [User_jobAddressId_fkey] FOREIGN KEY ([jobAddressId]) REFERENCES [dbo].[Address]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ArticleAttachment] ADD CONSTRAINT [ArticleAttachment_articleId_fkey] FOREIGN KEY ([articleId]) REFERENCES [dbo].[Article]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ArticleAttachment] ADD CONSTRAINT [ArticleAttachment_uploaderId_fkey] FOREIGN KEY ([uploaderId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ArticleAuthor] ADD CONSTRAINT [ArticleAuthor_articleId_fkey] FOREIGN KEY ([articleId]) REFERENCES [dbo].[Article]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ArticleAuthor] ADD CONSTRAINT [ArticleAuthor_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Review] ADD CONSTRAINT [Review_reviewerId_fkey] FOREIGN KEY ([reviewerId]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Review] ADD CONSTRAINT [Review_articleId_fkey] FOREIGN KEY ([articleId]) REFERENCES [dbo].[Article]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Payment] ADD CONSTRAINT [Payment_userId_fkey] FOREIGN KEY ([userId]) REFERENCES [dbo].[User]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
