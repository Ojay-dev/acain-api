import { Router } from 'express';
import AuthController from '../../controllers/AuthController';
import AuthValidation from '../../validation/AuthValidation';

const router = Router();

router.post(
  '/signup',
  AuthValidation.validateUserCreation,
  AuthController.createSingleUser
);
router.post(
  '/signin',
  AuthValidation.validateSignIn,
  AuthController.signInUser
);

export default router;
