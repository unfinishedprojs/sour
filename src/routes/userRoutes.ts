import { Router } from "express";
import { getUser, loginUser, registerUser } from "../controllers/userController";
import { verifyToken } from "../middleware/authentication";

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/user', verifyToken, getUser);

export default router;