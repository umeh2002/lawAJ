import express from "express";
import { Router } from "express";
import {
  commentOnInterpretation,
  deleteTnterpretationComment,
  viewInterpretationComment,
} from "../controller/commentController";

const router: Router = express.Router();

router.route("/:userID/:lawID/comments").post(commentOnInterpretation),
  router
    .route("/:userID/:commentID/delete-comment")
    .delete(deleteTnterpretationComment),
  router.route("/:lawID/view-comments").get(viewInterpretationComment);

export default router;
