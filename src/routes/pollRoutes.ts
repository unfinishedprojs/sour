import { Router } from "express";
import { verifyToken } from "../middleware/authentication";
import { createPoll, createVote, getPoll, getPolls } from "../controllers/pollController";

const router = Router();

router.post('/poll', verifyToken, createPoll);
router.get('/poll', verifyToken, getPolls);
router.get('/poll/:id', verifyToken, getPoll);
router.put('/poll/:id', verifyToken, createVote);

export default router;