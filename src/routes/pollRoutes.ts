import { Router } from "express";
import { getUser, loginUser, registerUser } from "../controllers/userController";
import { verifyToken } from "../middleware/authentication";
import { createPoll, getPoll } from "../controllers/pollController";

const router = Router();

router.post('/poll', verifyToken, createPoll);
router.get('/poll', verifyToken, getPoll);

export default router;