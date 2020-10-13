import { Router } from 'express';
import PublicationController from '../../controllers/PublicationController';
import AuthService from '../../services/AuthService';
import PublicationValidation from '../../validation/PublicationValidation';

const router = Router();

router.param('id', PublicationController.pubIdParamRoute);

router.get('/', PublicationController.getAllPublications);

router.use('/my-publications', AuthService.protectRoute([], true));
router
  .route('/my-publications')
  .get(PublicationController.getAllPublicationsAuth)
  .post(
    PublicationValidation.validatePublicationCreation,
    PublicationController.createSinglePublication
  );
router.put(
  '/my-publications/:id/image',
  PublicationController.updateSinglePublicationImage
);
router
  .route('/my-publications/:id')
  .get(PublicationController.getSinglePublication)
  .put(
    PublicationValidation.validatePublicationUpdate,
    PublicationController.updateSinglePublication
  )
  .delete(PublicationController.deleteSinglePublication);
router.route('/:id').get(PublicationController.getSinglePublication);

export default router;
