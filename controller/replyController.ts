import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const replyComment = async (req: Request, res: Response) => {
  try {
    const { userID, commentID } = req.params;
    const { reply } = req.body;

    const user = await prisma.authModel.findUnique({
      where: { id: userID },
    });

    const comment = await prisma.commentModel.findUnique({
      where: { id: commentID },
      include: { reply: true },
    });

    if (user && comment) {
      const replied = await prisma.replyModel.create({
        data: {
          reply,
          userID,
          commentID,
        },
      });

      //   comment.reply = [...comment.reply, replied];
      comment.reply.push(replied);

      return res.status(201).json({
        message: "reply created",
        data: replied,
      });
    } else {
      return res.status(404).json({
        message: "user or comment not found",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "error creating reply",
      data: error,
    });
  }
};
