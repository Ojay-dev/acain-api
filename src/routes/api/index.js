import { Router } from 'express';
import AuthService from '../../services/AuthService';

import auth from './auth';
import profile from './profile';
import publications from './publication';
import boardMember from './board_member';
import subscribers from './subscribers';

const router = Router();

router.use('/auth', auth);
router.use('/profile', AuthService.protectRoute(), profile);
router.use('/publications', publications);
router.use('/board_members', boardMember);
router.use('/subscribers', subscribers);

export default router;
