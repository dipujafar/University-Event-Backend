import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { eventsService } from './events.service';
import sendResponse from '../../utils/sendResponse';
import AppError from '../../error/AppError';
import httpStatus from 'http-status';
import { uploadToS3 } from '../../utils/s3';

const createEvents = catchAsync(async (req: Request, res: Response) => {
  const result = await eventsService.createEvents(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Events created successfully',
    data: result,
  });
});

const uploadImage = catchAsync(async (req: Request, res: Response) => {
  if (!req.file) {
    throw new AppError(httpStatus.BAD_REQUEST, 'image file is required');
  }

  const image = await uploadToS3({
    file: req.file,
    fileName: `images/event/icon/${Math.floor(100000 + Math.random() * 900000)}`,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Image uploaded successfully',
    data: image,
  });
});

const getAllEvents = catchAsync(async (req: Request, res: Response) => {
  const result = await eventsService.getAllEvents(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Events fetched successfully',
    data: result?.data?.[0],
  });
});

const getEventsById = catchAsync(async (req: Request, res: Response) => {
  const result = await eventsService.getEventsById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Events fetched successfully',
    data: result,
  });
});

// ------------------------------------- get check-in overview chart for admin dashboard -----------------------------------
const getCheckInChartOverview = catchAsync(
  async (req: Request, res: Response) => {
    const result = await eventsService.getCheckInChartOverview(
      parseInt(req?.query?.intervalMinutes as string) || 60,
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: 'Check-in chart overview fetched successfully',
      data: result,
    });
  },
);

const updateEvents = catchAsync(async (req: Request, res: Response) => {
  const result = await eventsService.updateEvents(req.params.id, req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Events updated successfully',
    data: result,
  });
});

const deleteEvents = catchAsync(async (req: Request, res: Response) => {
  const result = await eventsService.deleteEvents(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Events deleted successfully',
    data: result,
  });
});

export const eventsController = {
  createEvents,
  getAllEvents,
  getEventsById,
  updateEvents,
  deleteEvents,
  uploadImage,
  getCheckInChartOverview,
};
