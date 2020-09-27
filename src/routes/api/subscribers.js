import { Router } from 'express';
import SubscriberController from '../../controllers/SubscriberController';
import AuthService from '../../services/AuthService';
import SubscriberValidation from '../../validation/SubsriberValidation';

const router = Router();

router
  .route('/')
  .get(AuthService.protectRoute(['admin']), SubscriberController.getSubscribers)
  .post(
    SubscriberValidation.validateSubs,
    SubscriberController.createSingleSubscriber
  )
  .delete(
    SubscriberValidation.validateSubs,
    SubscriberController.unsubscribeSingleSubscriber
  );

export default router;
