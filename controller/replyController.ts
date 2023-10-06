import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { HTTP } from "../errors/mainError";

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

      return res.status(HTTP.CREATE).json({
        message: "reply created",
        data: replied,
      });
    } else {
      return res.status(HTTP.NOT_FOUND).json({
        message: "user or comment not found",
      });
    }
  } catch (error) {
    return res.status(HTTP.BAD).json({
      message: "error creating reply",
      data: error,
    });
  }
};

export const viewAllReplies = async (req: Request, res: Response) => {
  try {
    const { userID, commentID } = req.params;

    const user = await prisma.authModel.findUnique({
      where: { id: userID },
    });

    const comment = await prisma.commentModel.findUnique({
      where: { id: commentID },
    });

    if (user && comment) {
      const replies = await prisma.replyModel.findMany({
        where: { commentID },
      });

      return res.status(HTTP.OK).json({
        message: "All replies to comment gotten",
        data: replies,
      });
    } else {
      return res.status(HTTP.NOT_FOUND).json({
        message: "user or comment not found",
      });
    }
  } catch (error) {
    return res.status(HTTP.BAD).json({
      message: "error viewing all replies to comment",
      data: error,
    });
  }
};
