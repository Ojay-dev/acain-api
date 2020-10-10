import { Router } from 'express';
import PaymentController from '../../controllers/PaymentController';
import AuthService from '../../services/AuthService';
import PaymentValidation from '../../validation/PaymentValidation';

const router = Router();

router.use(AuthService.protectRoute());
router
  .route('/')
  .post(PaymentValidation.validatePaymentCreation, PaymentController.startPaymentProcess)
  .put(PaymentValidation.validatePaymentVerification, PaymentController.verifyPayment);

export default router;
