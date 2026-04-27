import { Router } from 'express';
import { allDataController } from './allData.controller';
import { USER_ROLE } from '../user/user.constants';
import auth from '../../middleware/auth';

const router = Router();
router.get(
  '/',
  auth(USER_ROLE.student, USER_ROLE.faculty),
  allDataController.getAllAllData,
);

export const allDataRoutes = router;
