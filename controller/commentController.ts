import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { HTTP } from "../errors/mainError";

const prisma = new PrismaClient();

export const commentOnInterpretation = async (req: Request, res: Response) => {
  try {
    const { userID, lawID } = req.params;
    const { comment } = req.body;

    const user = await prisma.authModel.findUnique({
      where: { id: userID },
    });

    const interpretation = await prisma.lawModel.findUnique({
      where: { id: lawID },
      include: { comments: true },
    });
    if (!user && !interpretation) {
      return res.status(HTTP.NOT_FOUND).json({
        message: "Invalid User || Interpretation to enable your action",
      });
    } else {
      const commented = await prisma.commentModel.create({
        data: { comment, lawID, userID },
      });
      interpretation?.comments.push(comment);
      return res.status(HTTP.CREATE).json({
        message: "Your Comment on the Interpretation",
        data: interpretation?.comments,
      });
    }
  } catch (error: any) {
    return res.status(HTTP.BAD).json({
      message: `Error occured while commenting on interpretation`,
    });
  }
};

export const viewInterpretationComment = async (
  req: Request,
  res: Response
) => {
  try {
    const { lawID } = req.params;
    const interpretation = await prisma.lawModel.findUnique({
      where: { id: lawID },
      include: { comments: true },
    });
    return res.status(HTTP.OK).json({
      message: "All Interpretation Comments",
      data: interpretation?.comments,
    });
  } catch (error) {
    return res.status(HTTP.NOT_FOUND).json({
      message: "Error viewing comments",
    });
  }
};

export const deleteTnterpretationComment = async (
  req: Request,
  res: Response
) => {
  try {
    const { userID, commentID } = req.params;

    const user = await prisma.authModel.findUnique({
      where: { id: userID },
    });

    const commented = await prisma.commentModel.findUnique({
      where: { id: commentID },
    });

    if (user?.id === commented?.userID) {
      await prisma.commentModel.delete({
        where: { id: commentID },
      });
      return res.status(HTTP.OK).json("comment deleted");
    } else {
      return res.status(HTTP.UNAUTHORIZED).json({
        message: "you are not authorized to delete this comment",
      });
    }
  } catch (error: any) {
    return res.status(HTTP.BAD).json({
      message: `error deleting comment:${error.message}`,
      data: error,
    });
  }
};
