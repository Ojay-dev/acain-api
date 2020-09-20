import { Router } from 'express';
import ProfileController from '../../controllers/ProfileController';
import ProfileValidation from '../../validation/ProfileValidation';

const router = Router();

router
  .route('/')
  .get(ProfileController.getSingleUserProfile)
  .put(
    ProfileValidation.validateBasicProfileUpdate,
    ProfileController.updateBasicInfo
  );
router.put(
  '/username',
  ProfileValidation.validateUsernameUpdate,
  ProfileController.updateUsername
);
router.put(
  '/email',
  ProfileValidation.validateEmailUpdate,
  ProfileController.updateEmail
);
router.put(
  '/password',
  ProfileValidation.validatePasswordUpdate,
  ProfileController.updatePassword
);
router.put(
  '/phone',
  ProfileValidation.validatePhoneUpdate,
  ProfileController.updatePhone
);

router.put('/avatar', ProfileController.updateAvatar);

export default router;
