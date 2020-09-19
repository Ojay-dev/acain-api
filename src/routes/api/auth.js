import { Router } from 'express';
import AuthController from '../../controllers/AuthController';
import AuthValidation from '../../validation/AuthValidation';

const router = Router();

router.post(
  '/signup',
  AuthValidation.validateUserCreation,
  AuthController.createSingleUser
);

export default router;
