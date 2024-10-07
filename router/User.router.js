import express from 'express'
import { createAccount, getUser, loginController } from '../controller/createAccont.controller.js';
import authenticateToken from "../utils.js"

const router = express.Router(); 

router.post ("/sign-up", createAccount);
router.post ("/login", loginController);
router.get("/get-user",authenticateToken,getUser)

export default router;