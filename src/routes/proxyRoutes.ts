import { Router } from "express";
import { verifyToken } from "../middleware/authentication";
import { getProfilePicture, getProfilePictureFromId } from "../controllers/proxyController";

const router = Router();

router.get('/pfp/:url', getProfilePictureFromId);

export default router;