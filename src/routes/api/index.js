import { Router } from 'express';
import AuthService from '../../services/AuthService';

import auth from './auth';
import profile from './profile';
import publications from './publication';

const router = Router();

router.use('/auth', auth);
router.use('/profile', AuthService.protectRoute(), profile);
router.use('publications', publications);

export default router;
