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
router.get('/:id', announcementsController.getAnnouncementsById);
router.get('/', announcementsController.getAllAnnouncements);

export const announcementsRoutes = router;
