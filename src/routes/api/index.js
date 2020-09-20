import { Router } from 'express';
import AuthService from '../../services/AuthService';

import auth from './auth';
import profile from './profile';

const router = Router();

router.use('/auth', auth);
router.use('/profile', AuthService.protectRoute(), profile);

export default router;
