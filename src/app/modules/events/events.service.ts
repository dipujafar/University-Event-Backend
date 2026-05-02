import httpStatus from 'http-status';
import { IEvents } from './events.interface';
import Events from './events.models';
import AppError from '../../error/AppError';
import QueryBuilder from '../../class/builder/QueryBuilder';
import { User } from '../user/user.models';

const createEvents = async (payload: IEvents) => {
  const event = await Events.IsEventsExist();
  if (event?.length) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'Event already exists and only one event can be created',
    );
  }
  const result = await Events.create(payload);
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create events');
  }
  return result;
};

const getAllEvents = async (query: Record<string, any>) => {
  query['isDeleted'] = false;
  const eventsModel = new QueryBuilder(Events.find(), query)
    .search([])
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await eventsModel.modelQuery;
  const meta = await eventsModel.countTotal();

  return {
    data,
    meta,
  };
};

const getEventsById = async (id: string) => {
  const result = await Events.findById(id);
  if (!result || result?.isDeleted) {
    throw new Error('Events not found!');
  }
  return result;
};

// ----------------------------------- get check-in overview chart for admin dashboard -----------------------------------
const getCheckInChartOverview = async (intervalMinutes: number = 60) => {
  const eventData = await Events.find();
  const event = eventData?.[0];

  if (!event) throw new AppError(httpStatus.NOT_FOUND, 'Event not found!');

  const { startTime, endTime } = event;

  // Floor startTime to the hour → 7:15 PM becomes 7:00 PM
  const flooredStart = new Date(startTime);
  flooredStart.setMinutes(0, 0, 0);

  // Ceil endTime to next hour → 4:20 PM becomes 5:00 PM
  const ceiledEnd = new Date(endTime);
  if (ceiledEnd.getMinutes() > 0 || ceiledEnd.getSeconds() > 0) {
    ceiledEnd.setHours(ceiledEnd.getHours() + 1, 0, 0, 0);
  }

  // Build 1-hour buckets
  const buckets: { label: string; from: Date; to: Date }[] = [];
  let cursor = new Date(flooredStart);

  while (cursor < ceiledEnd) {
    const next = new Date(cursor);
    next.setHours(next.getHours() + 1);

    buckets.push({
      label: cursor.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
      from: new Date(cursor),
      to: next,
    });

    cursor = next;
  }

  // Single aggregate using $bucket — efficient for hourly intervals
  const boundaries = buckets.map(b => b.from);
  boundaries.push(ceiledEnd);

  const aggregated = await User.aggregate([
    {
      $match: {
        status: 'attended',
        checkInTime: { $gte: flooredStart, $lt: ceiledEnd },
      },
    },
    {
      $bucket: {
        groupBy: '$checkInTime',
        boundaries,
        default: 'other',
        output: { count: { $sum: 1 } },
      },
    },
  ]);

  // Map aggregate results back to labeled buckets
  // $bucket returns { _id: <boundary date>, count: N }
  const bucketMap = new Map(
    aggregated.map(b => [new Date(b._id).getTime(), b.count]),
  );

  const data = buckets.map(bucket => ({
    time: bucket.label,
    count: bucketMap.get(bucket.from.getTime()) ?? 0,
  }));

  return data;
};

const updateEvents = async (id: string, payload: Partial<IEvents>) => {
  const result = await Events.findByIdAndUpdate(id, payload, { new: true });
  if (!result) {
    throw new Error('Failed to update Events');
  }
  return result;
};

const deleteEvents = async (id: string) => {
  const result = await Events.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Failed to delete events');
  }
  return result;
};

export const eventsService = {
  createEvents,
  getAllEvents,
  getEventsById,
  updateEvents,
  deleteEvents,
  getCheckInChartOverview,
};
