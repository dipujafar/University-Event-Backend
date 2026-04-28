import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import {
  IJwtPayload,
  TChangePassword,
  TLogin,
  TResetPassword,
} from './auth.interface';
import config from '../../config';
import { createToken, verifyToken } from './auth.utils';
import { User } from '../user/user.models';
import UAParser from 'ua-parser-js';
import { Request } from 'express';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { generateOtp } from '../../utils/otpGenerator';
import moment from 'moment';
import { IUser } from '../user/user.interface';
import { sendEmail } from '../../utils/mailSender';
import fs from 'fs';
import path from 'path';

// import firebaseAdmin from '../../utils/firebase';

// Login
const login = async (payload: { email: string }, req: Request) => {
  const user = await User.isUserExist(payload.email as string);

  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'This email is not listed yet!. Please contact with admin',
    );
  }

  if (user?.isDeleted) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'This email user removed from list. Please contact with admin',
    );
  }

  if (user?.role === 'admin') {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'This email is reserved for admin. Please use admin login',
    );
  } else if (user?.role === 'staff') {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'This email is reserved for staff. Please use staff login',
    );
  }

  if (!user?.fistTimeRegistered) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'Please at first register your account!.',
    );
  }

  const ip =
    req.headers['x-forwarded-for']?.toString().split(',')[0] ||
    req.socket.remoteAddress ||
    '';

  const userAgent = req.headers['user-agent'] || '';
  //@ts-ignore
  const parser = new UAParser(userAgent);
  const result = parser.getResult();
  const data = {
    device: {
      ip: ip,
      browser: result.browser.name,
      os: result.os.name,
      device: result.device.model || 'Desktop',
      lastLogin: new Date().toISOString(),
    },
  };

  await User.findByIdAndUpdate(user?._id, data, {
    new: true,
    upsert: false,
  });

  return user;
};

// --------------------------------------- login admin  ----------------
const loginAdmin = async (payload: TLogin, req: Request) => {
  const user = await User.isUserExist(payload?.email);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (user?.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted');
  }

  if (!(await User.isPasswordMatched(payload.password, user?.password!))) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Password does not match');
  }

  if (user?.role !== 'admin') {
    throw new AppError(httpStatus.FORBIDDEN, 'You are not valid admin');
  }

  if (!user?.verification?.status) {
    throw new AppError(httpStatus.FORBIDDEN, 'User account is not verified');
  }

  const jwtPayload: { userId: string; role: string; email: string } = {
    userId: user?._id?.toString() as string,
    email: user?.email,
    role: user?.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  const ip =
    req.headers['x-forwarded-for']?.toString().split(',')[0] ||
    req.socket.remoteAddress ||
    '';

  const userAgent = req.headers['user-agent'] || '';
  //@ts-ignore
  const parser = new UAParser(userAgent);
  const result = parser.getResult();
  const data = {
    device: {
      ip: ip,
      browser: result.browser.name,
      os: result.os.name,
      device: result.device.model || 'Desktop',
      lastLogin: new Date().toISOString(),
    },
  };

  await User.findByIdAndUpdate(user?._id, data, {
    new: true,
    upsert: false,
  });

  return {
    user,
    accessToken,
    refreshToken,
  };
};
// --------------------------------------- login admin or staff  ----------------
const loginStaff = async (payload: TLogin, req: Request) => {
  const user = await User.isUserExist(payload?.email);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (user?.isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted');
  }

  if (!(await User.isPasswordMatched(payload.password, user?.password!))) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Password does not match');
  }

  if (user?.role !== 'staff') {
    throw new AppError(httpStatus.FORBIDDEN, 'You are not valid staff');
  }

  console.log(user?.verification);
  if (!user?.verification?.status) {
    throw new AppError(httpStatus.FORBIDDEN, 'User account is not verified');
  }

  const jwtPayload: { userId: string; role: string; email: string } = {
    userId: user?._id?.toString() as string,
    email: user?.email,
    role: user?.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret as string,
    config.jwt_refresh_expires_in as string,
  );

  const ip =
    req.headers['x-forwarded-for']?.toString().split(',')[0] ||
    req.socket.remoteAddress ||
    '';

  const userAgent = req.headers['user-agent'] || '';
  //@ts-ignore
  const parser = new UAParser(userAgent);
  const result = parser.getResult();
  const data = {
    device: {
      ip: ip,
      browser: result.browser.name,
      os: result.os.name,
      device: result.device.model || 'Desktop',
      lastLogin: new Date().toISOString(),
    },
  };

  await User.findByIdAndUpdate(user?._id, data, {
    new: true,
    upsert: false,
  });

  return {
    user,
    accessToken,
    refreshToken,
  };
};

// Change password
const changePassword = async (id: string, payload: TChangePassword) => {
  const user = await User.IsUserExistId(id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (!(await User.isPasswordMatched(payload?.oldPassword, user.password!))) {
    throw new AppError(httpStatus.FORBIDDEN, 'Old password does not match');
  }
  if (payload?.newPassword !== payload?.confirmPassword) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'New password and confirm password do not match',
    );
  }

  const hashedPassword = await bcrypt.hash(
    payload?.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  const result = await User.findByIdAndUpdate(
    id,
    {
      $set: {
        password: hashedPassword,
        passwordChangedAt: new Date(),
      },
    },
    { new: true },
  );

  return result;
};

// Forgot password
const forgotPassword = async (email: string) => {
  const user = await User.isUserExist(email);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (user?.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const jwtPayload = {
    email: email,
    userId: user?._id,
  };

  const token = jwt.sign(jwtPayload, config.jwt_access_secret as Secret, {
    expiresIn: '3m',
  });

  const currentTime = new Date();
  const otp = generateOtp();
  const expiresAt = moment(currentTime).add(3, 'minute');

  await User.findByIdAndUpdate(user?._id, {
    needsPasswordChange: true,
    verification: {
      otp,
      expiresAt,
      status: true,
    },
  });

  const otpEmailPath = path.join(
    __dirname,
    '../../../../public/view/forgot_pass_mail.html',
  );

  await sendEmail(
    user?.email,
    'Your reset password OTP is',
    fs
      .readFileSync(otpEmailPath, 'utf8')
      .replace('{{otpCode}}', otp)
      .replace('{{fullName}}', user?.name)
      .replace(
        '{{resetUrl}}',
        `${config.server_url}/auth/reset-password-page?token=${token}`.trim(),
      ),
  );
  return { email, token };
};

// Reset password
const resetPassword = async (token: string, payload: TResetPassword) => {
  let decode;
  try {
    decode = jwt.verify(
      token,
      config.jwt_access_secret as string,
    ) as JwtPayload;
  } catch (err) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'Session has expired. Please try again',
    );
  }

  const user: IUser | null = await User.findById(decode?.userId).select(
    'isDeleted verification',
  );

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (new Date() > user?.verification?.expiresAt) {
    throw new AppError(httpStatus.FORBIDDEN, 'Session has expired');
  }
  if (!user?.verification?.status) {
    throw new AppError(httpStatus.FORBIDDEN, 'OTP is not verified yet');
  }
  if (payload?.newPassword !== payload?.confirmPassword) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'New password and confirm password do not match',
    );
  }

  const hashedPassword = await bcrypt.hash(
    payload?.newPassword,
    Number(config.bcrypt_salt_rounds),
  );

  const result = await User.findByIdAndUpdate(decode?.userId, {
    password: hashedPassword,
    needsPasswordChange: false,
    passwordChangedAt: new Date(),
    verification: {
      otp: 0,
      status: true,
    },
  });

  return result;
};

// Refresh token
const refreshToken = async (token: string) => {
  // Checking if the given token is valid
  const decoded = verifyToken(token, config.jwt_refresh_secret as string);
  const { userId } = decoded;
  const user = await User.IsUserExistId(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  const isDeleted = user?.isDeleted;

  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted');
  }

  const jwtPayload: IJwtPayload = {
    userId: user?._id?.toString() as string,
    email: user?.email,
    role: user.role,
  };

  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret as string,
    config.jwt_access_expires_in as string,
  );

  return {
    accessToken,
  };
};

export const authServices = {
  login,
  loginAdmin,
  loginStaff,
  refreshToken,
  forgotPassword,
  resetPassword,
  changePassword,
};
