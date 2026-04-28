import httpStatus from 'http-status';
import { IEvents } from './events.interface';
import Events from './events.models';
import AppError from '../../error/AppError';
import QueryBuilder from '../../class/builder/QueryBuilder';

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
};
