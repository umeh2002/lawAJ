import express from "express";
import { Router } from "express";
import {
  deleteReply,
  replyComment,
  viewAllReplies,
} from "../controller/replyController";

const router: Router = express.Router();

router.route("/:userID/:commentID/reply").post(replyComment),
  router.route("/:userID/:replyID/delete-reply").delete(deleteReply),
  router.route("/:userID/:commentID/view-replies").get(viewAllReplies);

export default router;
