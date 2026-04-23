import { Model, Types } from 'mongoose';

export interface IUser {
  _id?: Types.ObjectId;
  status: string;
  name: string;
  email: string;
  seat: string;
  section?: string;
  phoneNumber?: string;
  profile?: string;
  role: string;
  isDeleted: boolean;
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

export interface IExitUser {
  user: IUser;
  emailExists: boolean;
  phoneExists: boolean;
}

export interface UserModel extends Model<IUser> {
  isUserExist(phoneNumber: string): Promise<IUser>;
  isUserExistEmail(email: string): Promise<IUser>;
  isUserExist(
    phoneNumber: string | undefined,
    email: string | undefined,
  ): Promise<IExitUser>;
  IsUserExistId(id: string): Promise<IUser>;
  IsUserExistUserName(userName: string): Promise<IUser>;

  isPasswordMatched(
    plainTextPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}
