import { Router } from 'express';
import AuthService from '../../services/AuthService';

import auth from './auth';
import profile from './profile';
import publications from './publication';
import boardMember from './board_member';

const router = Router();

router.use('/auth', auth);
router.use('/profile', AuthService.protectRoute(), profile);
router.use('/publications', publications);
router.use('/board_members', boardMember);

export default router;
