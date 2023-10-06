import {Request,Response} from "express"
import {PrismaClient} from "@prisma/client"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import bcrypt from "bcrypt";
import { role } from "../utils/role";
import {HTTP} from "../errors/mainError"


const prisma = new PrismaClient();

export const registerUSer = async (req:any,res:Response)=>{
    try {
        const {name,email,password} = req.body

        const salt = await bcrypt.genSalt(10)

        const hashed = await bcrypt.hash(password,salt);

        const value = crypto.randomBytes(16).toString("hex")

        const token = jwt.sign(value, "justRand")

        const user = await prisma.authModel.create({
            data:{
                name,
                email,
                password:hashed,
                token,
                role:role.USER,
            }
        })

            return res.status(HTTP.CREATE).json({
                message: "User created",
                data: user,
              });

    } catch (error) {
        return res.status(HTTP.BAD).json({
            message:"Error Registing into our platform"
        })
    }
}

export const SignInUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.authModel.findUnique({
      where: { email },
    });

    if (user) {
      const check = await bcrypt.compare(password, user.password);

      if (check) {
        if (user.verified && user.token === "") {
          const token = jwt.sign(
            {
              id: user.id,
            },
            "secret",
            { expiresIn: "3d" }
          );

          return res.status(HTTP.CREATE).json({
            message: `Welcome back ${user.email}`,
            user: token,
          });
        } else {
          return res.status(HTTP.BAD).json({
            message: "Please go and verify your account",
          });
        }
      } else {
        return res.status(HTTP.BAD).json({
          message: "check your password",
        });
      }
    } else {
      return res.status(HTTP.BAD).json({
        message: "cannot find user",
      });
    }
  } catch (error) {
    return res.status(HTTP.BAD).json({
      message: "Error signing in",
    });
  }
};

export const verifyUSer = async (req: Request, res: Response) => {
    try {
      const { token } = req.params;
  
      const getID: any = jwt.verify(token, "justRand", (err, payload: any) => {
        if (err) {
          return err;
        } else {
          return payload;
        }
      });

      const user = await prisma.authModel.update({
        where: { id: getID },
        data: {
          verified: true,
          token: "",
        },
      });
      return res.status(HTTP.CREATE).json({
        message: "Account verified",
        data: user,
      });
    } catch (error) {
      return res.status(HTTP.BAD).json({
        message: "Error verifying Account",
      });
    }
  };
  
  export const viewUsers = async (req: Request, res: Response) => {
    try {
      const user = await prisma.authModel.findMany({});
  
      return res.status(HTTP.OK).json({
        message: "Users found",
        data: user,
      });
    } catch (error) {
      return res.status(HTTP.BAD).json({
        message: "Error viewing Users",
      });
    }
  };

  export const viewOneUser = async (req: Request, res: Response) => {
    try {
      const { userID } = req.params;
      const user = await prisma.authModel.findUnique({
        where: { id: userID },
      });
  
      return res.status(HTTP.OK).json({
        message: "User found",
        data: user,
      });
    } catch (error) {
      return res.status(HTTP.BAD).json({
        message: "Error viewing single User",
      });
    }
  };

  export const updateUserInfo = async (req: Request, res: Response) => {
    try {
      const { userID } = req.params;
      const { name } = req.body;
  
      const user = await prisma.authModel.update({
        where: { id: userID },
        data: { name },
      });
  
      return res.status(HTTP.CREATE).json({
        message: "user updated",
        data: user,
      });
    } catch (error) {
      return res.status(HTTP.BAD).json({
        message: "Error updating user",
      });
    }
  };
  
  export const updateUserAvatar = async (req: any, res: Response) => {
    try {
      const { userID } = req.params;

      return res.status(HTTP.CREATE).json({
        message: "User image updated",
      });
    } catch (error) {
      return res.status(HTTP.BAD).json({
        message: "Error updating User Image",
      });
    }
  };

  export const deleteUser = async (req: Request, res: Response) => {
    try {
      const { userID } = req.params;
  
      await prisma.authModel.delete({
        where: { id: userID },
      });
  
      return res.status(HTTP.CREATE).json({
        message: "User deleted",
      });
    } catch (error) {
      return res.status(HTTP.BAD).json({
        message: "Error deleting User",
      });
    }
  };


  export const changeAccountPassword = async (req: Request, res: Response) => {
    try {
      const { token } = req.params;
      const { password } = req.body;
  
      const getID: any = jwt.verify(token, "justRand", (err, payload: any) => {
        if (err) {
          return err;
        } else {
          return payload.id;
        }
      });
  
      const user = await prisma.authModel.findUnique({
        where: { id: getID },
      });
  
      if (user?.verified && user.token !== "") {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);
  
      const changed =  await prisma.authModel.update({
          where: { id: user.id },
          data: {
            password: hashed,
          },
        });
  
        return res.status(HTTP.CREATE).json({
          message: "Your password has been changed",
          data:changed
        });
      } else {
        return res.status(HTTP.BAD).json({
          message: "can't reset this password",
        });
      }
    } catch (error) {
      return res.status(HTTP.BAD).json({
        message: "Error verifying Account",
      });
    }
  };