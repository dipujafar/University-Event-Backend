import { model, Schema } from 'mongoose';
import {
  IAnnouncements,
  IAnnouncementsModules,
} from './announcements.interface';

const announcementsSchema = new Schema<IAnnouncements>(
  {
    title: { type: 'string', required: [true, 'Title is required'] },
    description: {
      type: 'string',
      required: [true, 'Description is required'],
    },
    isDeleted: { type: 'boolean', default: false },
  },
  {
    timestamps: true,
  },
);

announcementsSchema.pre('find', function (next) {
  //@ts-ignore
  this.where({ isDeleted: { $ne: true } });
  next();
});

announcementsSchema.pre('findOne', function (next) {
  this.where({ isDeleted: { $ne: true } });
  next();
});

announcementsSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

const Announcements = model<IAnnouncements, IAnnouncementsModules>(
  'Announcements',
  announcementsSchema,
);
export default Announcements;
