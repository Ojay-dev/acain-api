import { Router } from 'express';
import EventsController from '../../controllers/EventsController';
import AuthService from '../../services/AuthService';
import EventsValidation from '../../validation/EventsValidation';

const router = Router();

router.param('id', EventsController.eventIdParam);
router.route('/').get(EventsController.getAllEvents);
router.get('/:id', EventsController.getSingleEvent);
router.use(AuthService.protectRoute(['admin']));
router.post(
  '/',
  EventsValidation.validateEventCreation,
  EventsController.createEvent
);
router
  .route('/:id')
  .put(EventsValidation.validateEventUpdate, EventsController.updateSingleEvent)
  .delete(EventsController.deleteSingleEvent);
router.put('/:id/image', EventsController.updateEventImage);

export default router;
