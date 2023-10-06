import { Router } from "express";
import {
  findLawByCategory,
  likeLaw,
  unlikeLaw,
} from "../controller/lawController";

const router = Router();

router.route("/:lawID/like-law").get(likeLaw);

router.route("/:lawID/unlike-law").get(unlikeLaw);

router.route("/find-law-category").get(findLawByCategory);

export default router;
