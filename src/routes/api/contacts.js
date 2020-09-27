import { Router } from 'express';
import ContactController from '../../controllers/ContactController';
import AuthService from '../../services/AuthService';
import ContactValidation from '../../validation/ContactValidation';

const router = Router();

router.post(
  '/',
  ContactValidation.validateContact,
  ContactController.createContact
);
router.use(AuthService.protectRoute(['admin']));
router.get('/', ContactController.getAllContact);

router.param('id', ContactController.contactIdParam);
router
  .route('/:id')
  .get(ContactController.getSingleContact)
  .delete(ContactController.deleteSingleContact);

export default router;
