import express from "express";
import validatorHolder from "../utils/validatorHandlers";
import { createUserValidator } from "../utils/validator";
const router = express.Router();
import multer from "multer";
import { SignInUser, changeAccountPassword, deleteUser, registerUSer, updateUserAvatar, verifyUSer, viewOneUser, viewUsers } from "../controller/AuthController";

const myUpload = multer().single("avatar");

router.route("/all-accounts").get(viewUsers);
router.route("/:userID/single-account").get(viewOneUser);
router.route("/:userID/delete").delete(deleteUser);

router
  .route("/create-account")
  .post(validatorHolder(createUserValidator), registerUSer);

router.route("/sign-in-account").post(SignInUser);

router.route("/:token/verify-account").post(verifyUSer);

router
  .route("/:userID/update-account-avatar")
  .patch(myUpload, updateUserAvatar);

router.route("/:token/change-account-password").patch(changeAccountPassword);

export default router;
