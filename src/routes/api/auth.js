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
router.post(
  '/resend',
  AuthValidation.validateVerificationResend,
  AuthController.resendVerificationEmail
);
router
  .route('/forgot-password')
  .put(
    AuthValidation.validatePasswordChangeFromCode,
    AuthController.changePasswordFromCode
  )
  .post(
    AuthValidation.validateVerificationResend,
    AuthController.forgotPassword
  );
router.put('/verify-email', AuthController.verifyUserEmail);

export default router;
