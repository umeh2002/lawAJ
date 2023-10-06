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
