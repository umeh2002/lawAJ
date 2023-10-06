-- CreateTable
CREATE TABLE "authModel" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,
    "email" STRING NOT NULL,
    "password" STRING NOT NULL,
    "verified" BOOL NOT NULL DEFAULT false,
    "token" STRING,
    "avatar" STRING,
    "avatarID" STRING,
    "role" STRING NOT NULL,
    "roleID" STRING,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "authModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lawModel" (
    "id" STRING NOT NULL,
    "title" STRING NOT NULL,
    "description" STRING NOT NULL,
    "category" STRING NOT NULL,
    "content" STRING NOT NULL,
    "image" STRING,
    "imageID" STRING,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userID" STRING NOT NULL,
    "rating" INT4[],
    "rate" INT4,
    "like" STRING[],

    CONSTRAINT "lawModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commentModel" (
    "id" STRING NOT NULL,
    "comment" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lawID" STRING NOT NULL,
    "userID" STRING NOT NULL,

    CONSTRAINT "commentModel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "replyModel" (
    "id" STRING NOT NULL,
    "reply" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "commentID" STRING NOT NULL,
    "userID" STRING NOT NULL,

    CONSTRAINT "replyModel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "authModel_email_key" ON "authModel"("email");

-- CreateIndex
CREATE UNIQUE INDEX "authModel_roleID_key" ON "authModel"("roleID");

-- AddForeignKey
ALTER TABLE "lawModel" ADD CONSTRAINT "lawModel_userID_fkey" FOREIGN KEY ("userID") REFERENCES "authModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commentModel" ADD CONSTRAINT "commentModel_lawID_fkey" FOREIGN KEY ("lawID") REFERENCES "lawModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "replyModel" ADD CONSTRAINT "replyModel_commentID_fkey" FOREIGN KEY ("commentID") REFERENCES "commentModel"("id") ON DELETE CASCADE ON UPDATE CASCADE;
