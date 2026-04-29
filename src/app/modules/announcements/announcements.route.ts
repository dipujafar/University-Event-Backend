import { Router } from 'express';
import { announcementsController } from './announcements.controller';
import validateRequest from '../../middleware/validateRequest';
import { announcementsValidations } from './announcements.validation';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';

const router = Router();

router.post(
  '/',
  auth(USER_ROLE.admin),
  validateRequest(announcementsValidations.createAnnouncementsZodSchema),
  announcementsController.createAnnouncements,
);
router.patch(
  '/:id',
  auth(USER_ROLE.admin),
  validateRequest(announcementsValidations.updateAnnouncementsZodSchema),
  announcementsController.updateAnnouncements,
);
router.delete(
  '/:id',
  auth(USER_ROLE.admin),
  announcementsController.deleteAnnouncements,
);
router.get(
  '/:id',
  auth(
    USER_ROLE.admin,
    USER_ROLE.user,
    USER_ROLE.staff,
    USER_ROLE.student,
    USER_ROLE.faculty,
  ),
  announcementsController.getAnnouncementsById,
);
router.get(
  '/',
  auth(
    USER_ROLE.admin,
    USER_ROLE.user,
    USER_ROLE.staff,
    USER_ROLE.student,
    USER_ROLE.faculty,
  ),
  announcementsController.getAllAnnouncements,
);

export const announcementsRoutes = router;
