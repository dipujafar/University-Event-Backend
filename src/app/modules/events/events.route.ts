import { Router } from 'express';
import { eventsController } from './events.controller';
import validateRequest from '../../middleware/validateRequest';
import { eventValidation } from './events.validation';

const router = Router();

router.post(
  '/',
  validateRequest(eventValidation.createEventZodSchema),
  eventsController.createEvents,
);
router.patch(
  '/:id',
  validateRequest(eventValidation.updateEventZodSchema),
  eventsController.updateEvents,
);
router.delete('/:id', eventsController.deleteEvents);
router.get('/:id', eventsController.getEventsById);
router.get('/', eventsController.getAllEvents);

export const eventsRoutes = router;
