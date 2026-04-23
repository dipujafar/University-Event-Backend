import { model, Schema } from 'mongoose';
import {
  IEvents,
  IEventsModules,
  IIncluded,
  ILocation,
} from './events.interface';

const locationSchema = new Schema<ILocation>({
  venue: { type: 'string', required: [true, 'Event venue is required'] },
  address: { type: 'string', required: [true, 'Event address is required'] },
  mapLink: { type: 'string', required: false },
});
const includedSchema = new Schema<IIncluded>({
  title: { type: 'string', required: [true, 'Included title is required'] },
  image: { type: 'string', required: false },
});

const eventsSchema = new Schema<IEvents>(
  {
    name: { type: 'string', required: [true, 'Event name is required'] },
    location: {
      type: locationSchema,
      required: [true, 'Event location is required'],
    },
    date: { type: 'date', required: [true, 'Event date is required'] },
    startTime: {
      type: 'date',
      required: [true, 'Event start time is required'],
    },
    endTime: { type: 'date', required: [true, 'Event end time is required'] },
    instructions: { type: [String], required: false },
    included: { type: [includedSchema], required: false },
    isDeleted: { type: 'boolean', default: false },
  },
  {
    timestamps: true,
  },
);

//eventsSchema.pre('find', function (next) {
//  //@ts-ignore
//  this.find({ isDeleted: { $ne: true } });
//  next();
//});

//eventsSchema.pre('findOne', function (next) {
//@ts-ignore
//this.find({ isDeleted: { $ne: true } });
// next();
//});

eventsSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

const Events = model<IEvents, IEventsModules>('Events', eventsSchema);
export default Events;
