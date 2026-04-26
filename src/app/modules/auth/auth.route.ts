import { Router } from 'express';
import { authControllers } from './auth.controller';
import validateRequest from '../../middleware/validateRequest';
import { authValidation } from './auth.validation';
import { USER_ROLE } from '../user/user.constants';
import auth from '../../middleware/auth';

const router = Router();

router.post(
  '/login',
  validateRequest(authValidation.loginZodValidationSchema),
  authControllers.login,
);

router.post(
  '/login/admin',

  validateRequest(authValidation.loginAdminZodValidationSchema),
  authControllers.loginAdmin,
);

router.post(
  '/refresh-token',
  validateRequest(authValidation.refreshTokenValidationSchema),
  authControllers.refreshToken,
);

router.patch(
  '/change-password',
  validateRequest(authValidation.changePasswordZodValidationSchema),
  auth(
    USER_ROLE.super_admin,
    USER_ROLE.sub_admin,
    USER_ROLE.admin,
    USER_ROLE.user,
    USER_ROLE.staff,
  ),
  authControllers.changePassword,
);

router.patch(
  '/forgot-password',
  validateRequest(authValidation.forgotPasswordZodValidationSchema),
  authControllers.forgotPassword,
);
router.patch(
  '/reset-password',
  validateRequest(authValidation.resetPasswordZodValidationSchema),
  authControllers.resetPassword,
);

export const authRoutes = router;
