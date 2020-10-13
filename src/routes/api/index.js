import { Router } from 'express';
import AuthService from '../../services/AuthService';

import auth from './auth';
import profile from './profile';
import publications from './publication';
import boardMember from './board_member';
import subscribers from './subscribers';
import contacts from './contacts';
import events from './events';
import pay from './pay';

const router = Router();

router.use('/auth', auth);
router.use('/profile', AuthService.protectRoute([], true), profile);
router.use('/publications', publications);
router.use('/board_members', boardMember);
router.use('/subscribers', subscribers);
router.use('/contacts', contacts);
router.use('/events', events);
router.use('/pay', pay);

export default router;
