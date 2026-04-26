import { Schema, model } from 'mongoose';
import { IUser, UserModel } from './user.interface';
import { Role, USER_ROLE } from './user.constants';
import bcrypt from 'bcrypt';
import config from '../../config';

const userSchema: Schema<IUser> = new Schema(
  {
    //basic info
    name: {
      type: String,
      required: true,
      default: null,
    },
    password: {
      type: String,
      required: false,
      default: null,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    role: {
      type: String,
      enum: Role,
      default: USER_ROLE.student,
    },
    profile: {
      type: String,
      default: null,
    },
    phoneNumber: {
      type: String,
      required: false,
      unique: true,
      sparse: true,
      trim: true,
      validate: {
        validator: function (v: string) {
          return /^(\+?\d{8,15})$/.test(v);
        },
        message: (props: any) => `${props.value} is not a valid phone number!`,
      },
      default: null,
    },
    status: {
      type: String,
      enum: ['attended', 'absent'],
      default: 'absent',
    },
    section: {
      type: String,
      default: null,
    },
    seat: {
      type: String,
      default: null,
    },
    fistTimeRegistered: {
      type: Boolean,
      default: false,
    },
    verification: {
      otp: {
        type: Schema.Types.Mixed,
        default: 0,
      },
      expiresAt: {
        type: Date,
      },
      status: {
        type: Boolean,
        default: false,
      },
    },
    device: {
      ip: {
        type: String,
      },
      browser: {
        type: String,
      },
      os: {
        type: String,
      },
      device: {
        type: String,
      },
      lastLogin: {
        type: String,
      },
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre('save', async function (next) {
  const user = this;
  if (this?.password) {
    user.password = await bcrypt.hash(
      user?.password!,
      Number(config.bcrypt_salt_rounds),
    );
  }

  next();
});

userSchema.statics.isPasswordMatched = async function (
  plainTextPassword,
  hashedPassword,
) {
  console.log({
    plainTextPassword,
    hashedPassword,
  });
  return await bcrypt.compare(plainTextPassword, hashedPassword);
};

userSchema.statics.isUserExist = async function (email: string) {
  return await User.findOne({ email: email }).select('+password');
};

userSchema.statics.IsUserExistId = async function (id: string) {
  return await User.findById(id).select('+password');
};

userSchema.post('save', function (doc) {
  doc.verification.otp = 0;
});

userSchema.post('findOneAndUpdate', function (doc) {
  if (doc) doc.verification.otp = 0;
});

export const User = model<IUser, UserModel>('User', userSchema);
