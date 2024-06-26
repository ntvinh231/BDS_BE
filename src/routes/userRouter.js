import express from 'express';
const router = express.Router();

import {
	getAllUser,
	getDetailsUser,
	loggout,
	refreshToken,
	signIn,
	signUp,
	updateUser,
	updateUserForAdmin,
	deleteUser,
	deleteManyUser,
	updatePassword,
	forgotPassword,
	resetPassword,
	registerTemp,
} from '../controllers/authController.js';
import isLoggedIn from '../middleware/isLoggedIn.js';
import restricTo from '../middleware/checkRole.js';

router.post('/refresh-token', refreshToken);
router.post('/signup-temp', registerTemp);
router.post('/signup', signUp);
router.post('/signin', signIn);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);
router.post('/loggout', loggout);
router.use(isLoggedIn);
router.get('/getAll', isLoggedIn, getAllUser);
router.get('/details/:id', isLoggedIn, getDetailsUser);
export default router;
