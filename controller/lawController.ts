import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { streamUpload } from "../utils/streamUpload";
import { HTTP } from "../errors/mainError";

const prisma = new PrismaClient();

export const createLaw = async (req: any, res: Response) => {
  try {
    const { userID } = req.params;
    const { title, description, content, category } = req.body;
    const { secure_url, public_id }: any = await streamUpload(req);

    const user = await prisma.authModel.findUnique({
      where: { id: userID },
      include: { law: true },
    });
    if (user?.role === "lawyer") {
      const law = await prisma.lawModel.create({
        data: {
          title,
          description,
          content,
          category,
          image: secure_url,
          imageID: public_id,
          userID,
          rate: 0,
        },
      });

      user.law.push(law);
      return res.status(HTTP.CREATE).json({
        message: "Success",
        data: user,
      });
    } else {
      return res.status(HTTP.BAD).json({
        message: "you aren't allowed to access this",
      });
    }
  } catch (error: any) {
    return res.status(HTTP.NOT_FOUND).json({
      message: "Error creating law",
      data: error.message,
    });
  }
};

export const viewAll = async (req: Request, res: Response) => {
  try {
    const law = await prisma.lawModel.findMany({
      include: { comments: true },
    });
    return res.status(HTTP.OK).json({
      message: "Success",
      data: law,
    });
  } catch (error: any) {
    return res.status(HTTP.NOT_FOUND).json({
      message: "error",
      data: error.message,
    });
  }
};

export const viewOne = async (req: Request, res: Response) => {
  try {
    const { lawID } = req.params;
    const law = await prisma.lawModel.findUnique({
      where: { id: lawID },
      include: { comments: true },
    });
    return res.status(HTTP.OK).json({
      message: "success",
      data: law,
    });
  } catch (error: any) {
    return res.status(HTTP.NOT_FOUND).json({
      message: "error",
      data: error.message,
    });
  }
};

export const updateLaw = async (req: Request, res: Response) => {
  try {
    const { lawID } = req.params;
    const { title, description, content } = req.body;

    const law = await prisma.lawModel.update({
      where: { id: lawID },
      data: {
        title,
        description,
        content,
      },
    });
    return res.status(HTTP.CREATE).json({
      message: "Success",
      data: law,
    });
  } catch (error: any) {
    return res.status(HTTP.NOT_FOUND).json({
      message: "Error updating law",
      data: error.message,
    });
  }
};

export const updateImage = async (req: any, res: Response) => {
  try {
    const { lawID } = req.params;
    const { secure_url, public_id }: any = await streamUpload(req);
    const law = await prisma.lawModel.update({
      where: { id: lawID },
      data: {
        image: secure_url,
        imageID: public_id,
      },
    });
    return res.status(HTTP.CREATE).json({
      message: "Success",
      data: law,
    });
  } catch (error: any) {
    return res.status(HTTP.NOT_FOUND).json({
      message: "Error updating image",
      data: error.message,
    });
  }
};

export const deleteLaw = async (req: Request, res: Response) => {
  try {
    const { lawID, userID } = req.params;
    const user = await prisma.authModel.findUnique({
      where: { id: userID },
    });
    const law = await prisma.lawModel.findUnique({
      where: { id: lawID },
    });
    if (user?.id === law?.userID) {
      const lawyer = await prisma.lawModel.delete({
        where: { id: lawID },
      });
      return res.status(HTTP.OK).json({
        message: "success",
        data: lawyer,
      });
    } else {
      return res.status(HTTP.BAD).json({
        message: "you cannot access this page",
      });
    }
  } catch (error: any) {
    return res.status(HTTP.NOT_FOUND).json({
      message: "Error deleting",
      data: error.message,
    });
  }
};

export const viewAllLawyerLaw = async (req: Request, res: Response) => {
  try {
    const { userID } = req.params;

    const user = await prisma.authModel.findUnique({
      where: { id: userID },
      include: { law: true },
    });
    if (user) {
      return res.status(HTTP.OK).json({
        message: "Success",
        data: user.law,
      });
    } else {
      return res.status(HTTP.BAD).json({
        message: "register user please",
      });
    }
  } catch (error: any) {
    return res.status(HTTP.NOT_FOUND).json({
      message: "Error",
      data: error.message,
    });
  }
};

export const rateLaw = async (req: Request, res: Response) => {
  try {
    const { lawID, userID } = req.params;
    const { rating } = req.body;

    const user = await prisma.authModel.findUnique({
      where: { id: userID },
    });

    const law = await prisma.lawModel.findUnique({
      where: { id: lawID },
    });

    let total: any = law?.rating?.reduce((a: number, b: number) => {
      return a + b;
    }, 0);

    if (user) {
      let totalLength: any = law?.rating.length;
      law?.rating.push(rating);

      let rated: number = Math.ceil(total / totalLength);
      const lawyer = await prisma.lawModel.update({
        where: { id: lawID },
        data: { rating: law?.rating, rate: rated },
      });
      return res.status(HTTP.CREATE).json({
        message: "success",
        data: lawyer,
      });
    } else {
      return res.status(HTTP.BAD).json({
        message: "failed to rate",
      });
    }
  } catch (error: any) {
    return res.status(HTTP.NOT_FOUND).json({
      message: "error",
      data: error.message,
    });
  }
};

export const likeLaw = async (req: any, res: Response) => {
  try {
    const { id: userID } = req.user;
    const { lawID } = req.params;

    const law: any = await prisma.lawModel.findUnique({
      where: { id: lawID },
    });

    if (!law) {
      return res.status(HTTP.NOT_FOUND).json({
        message: "law not found",
      });
    }

    if (law?.like.includes(userID)) {
      return res.status(HTTP.BAD).json({
        message: "You have already liked this law",
      });
    } else {
      law.like.push(userID);
      await prisma.lawModel.update({
        where: { id: lawID },
        data: {
          like: law?.like,
        },
      });

      return res.status(HTTP.CREATE).json({
        message: "You just liked this law",
        data: law,
      });
    }
  } catch (error: any) {
    return res.status(HTTP.BAD).json({
      message: `Error loving law: ${error.message}`,
      data: error,
    });
  }
};

export const unlikeLaw = async (req: any, res: Response) => {
  try {
    const { id: userID } = req.user;
    const { lawID } = req.params;

    const law: any = await prisma.lawModel.findUnique({
      where: { id: lawID },
    });

    if (!law) {
      return res.status(HTTP.NOT_FOUND).json({
        message: "law not found",
      });
    }

    if (!law.like.includes(userID)) {
      return res.status(HTTP.BAD).json({
        message: "You have not liked this law",
      });
    }

    const unlikedUsers: any = law?.like.filter((user: any) => user !== userID);

    await prisma.lawModel.update({
      where: { id: lawID },
      data: {
        like: unlikedUsers,
      },
    });

    return res.status(HTTP.CREATE).json({
      message: "You just unliked this law",
      data: {
        like: unlikedUsers,
      },
    });
  } catch (error: any) {
    return res.status(HTTP.BAD).json({
      message: `Error unliking law: ${error.message}`,
      data: error,
    });
  }
};

export const findLawByCategory = async (req: Request, res: Response) => {
  try {
    const { category } = req.body;
    const law = await prisma.lawModel.findMany({
      where: { category },
    });

    return res.status(HTTP.OK).json({
      message: "getting all law categories",
      data: law,
    });
  } catch (error: any) {
    res.status(HTTP.NOT_FOUND).json({
      message: `Couldn't get all categories${error.message}`,
      data: error,
    });
  }
};
