import { Model, Types } from 'mongoose';

export interface IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  seat: string;
  section?: string;
  phoneNumber?: string;
  password?: string;
  profile?: string;
  role: string;
  isDeleted: boolean;
  status: string;
  fistTimeRegistered: boolean;
  registeredAt: Date | null;
  checkInTime: Date | null;
  fcmToken?: string;
  verification: {
    otp: string | number;
    expiresAt: Date;
    status: boolean;
  };
  device: {
    ip: string;
    browser: string;
    os: string;
    device: string;
    lastLogin: string;
  };
}

export interface UserModel extends Model<IUser> {
  isUserExist(email: string): Promise<IUser>;
  IsUserExistId(id: string): Promise<IUser>;
  IsUserExistUserName(userName: string): Promise<IUser>;
  isUserSeatBooked(seat: string): Promise<IUser>;

  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}
