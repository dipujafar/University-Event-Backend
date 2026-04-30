import { Router } from 'express';
import { eventsController } from './events.controller';
import validateRequest from '../../middleware/validateRequest';
import { eventValidation } from './events.validation';
import auth from '../../middleware/auth';
import { USER_ROLE } from '../user/user.constants';
import multer, { memoryStorage } from 'multer';

const router = Router();
const upload = multer({ storage: memoryStorage() });

router.post(
  '/',
  auth(USER_ROLE.admin),
  validateRequest(eventValidation.createEventZodSchema),
  eventsController.createEvents,
);
router.post(
  '/add-event',
  auth(USER_ROLE.admin),
  validateRequest(eventValidation.createEventZodSchema),
  eventsController.createEvents,
);
router.post(
  '/upload-image',
  auth(USER_ROLE.admin),
  upload.single('image'),
  eventsController.uploadImage,
);
router.patch(
  '/:id',
  auth(USER_ROLE.admin),
  validateRequest(eventValidation.updateEventZodSchema),
  eventsController.updateEvents,
);
router.delete('/:id', auth(USER_ROLE.admin), eventsController.deleteEvents);
router.get('/:id', eventsController.getEventsById);
router.get('/', eventsController.getAllEvents);

export const eventsRoutes = router;
