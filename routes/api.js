import {Router} from "express";
import AuthController from "../controllers/AuthController.js";
import multer from 'multer';
import ProfileController from "../controllers/ProfileController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();
const upload = multer();

router.post('/auth/register',upload.none(),AuthController.register);
router.post('/auth/login',upload.none(),AuthController.login);


router.post('/profile',authMiddleware,ProfileController.index);
router.put('/profile/:id',authMiddleware,ProfileController.update);


export default router;