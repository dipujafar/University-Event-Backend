/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from 'http-status';
import AppError from '../../error/AppError';
import { IUser } from './user.interface';
import { User } from './user.models';
import QueryBuilder from '../../class/builder/QueryBuilder';

export type IFilter = {
  searchTerm?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};
const createUser = async (payload: IUser): Promise<IUser> => {
  const isExist = await User.isUserExist(payload.email as string);
  const isSeatBooked = await User.isUserSeatBooked(payload.seat as string);

  if (isExist) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'User already exists with this email',
    );
  }

  if (isSeatBooked) {
    throw new AppError(httpStatus.FORBIDDEN, 'This seat is already booked');
  }

  const user = await User.create(payload);
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User creation failed');
  }
  return user;
};

// ----------------------------------- user registration for first time entry ---------------------
const registerUser = async (email: string, payload: Partial<IUser>) => {
  const isExist = await User.isUserExist(payload.email as string);

  if (!isExist) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'This email is not listed yet. Please contact with admin',
    );
  }

  if (isExist?.isDeleted) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'This email user removed from list. Please contact with admin',
    );
  }

  if (isExist.role === 'admin') {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'This email is registered as admin. Please use for admin login',
    );
  } else if (isExist.role === 'staff') {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'This email is registered as staff. Please use for staff login',
    );
  }

  const user = await User.findOneAndUpdate({ email }, payload, { new: true });
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User registration failed');
  }
  return user;
};
// -----------------------------------------------------------------------------------------------

const getAllUser = async (query: Record<string, any>) => {
  const userModel = new QueryBuilder(User.find().select('-password'), query)
    .search(['name', 'email', 'phoneNumber', 'status'])
    .filter()
    .paginate()
    .sort()
    .fields();
  const data: any = await userModel.modelQuery;
  const meta = await userModel.countTotal();
  return {
    data,
    meta,
  };
};

const getUserById = async (id: string) => {
  const result = await User.findById(id).select('-password');
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }
  return result;
};

const qrCodeScan = async (email: string) => {
  const user = await User.isUserExist(email);

  if (user?.status === 'attended') {
    throw new AppError(httpStatus.BAD_REQUEST, 'User already checked in');
  }

  const updatedData = { status: 'attended', checkInTime: new Date() };
  const result = await User.findOneAndUpdate({ email }, updatedData, {
    new: true,
  });
  return result;
};

const updateUser = async (id: string, payload: Partial<IUser>) => {
  const user = await User.findByIdAndUpdate(id, payload, { new: true });
  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'User updating failed');
  }

  return user;
};

const deleteUser = async (id: string) => {
  const user = await User.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );

  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'user deleting failed');
  }

  return user;
};

export const userService = {
  createUser,
  getAllUser,
  getUserById,
  updateUser,
  deleteUser,
  registerUser,
  qrCodeScan,
};
