import { Router } from 'express';
import BoardMemberController from '../../controllers/BoardMemberController';
import AuthService from '../../services/AuthService';
import BoardMemberValidation from '../../validation/BoardMemberValidation';

const router = Router();

router
  .route('/')
  .get(BoardMemberController.getAllBoardMembers)
  .post(
    AuthService.protectRoute(['admin']),
    BoardMemberValidation.validateBoardMemberCreation,
    BoardMemberController.createSingleBoardMember
  );
router.get('/:id', BoardMemberController.getSingleBoardMember);

export default router;
