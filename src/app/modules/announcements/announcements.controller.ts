import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { announcementsService } from './announcements.service';
import sendResponse from '../../utils/sendResponse';

const createAnnouncements = catchAsync(async (req: Request, res: Response) => {
  const result = await announcementsService.createAnnouncements(req.body);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: 'Announcements created successfully',
    data: result,
  });
});

const getAllAnnouncements = catchAsync(async (req: Request, res: Response) => {
  const result = await announcementsService.getAllAnnouncements(req.query);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All announcements fetched successfully',
    data: result,
  });
});

const getAnnouncementsById = catchAsync(async (req: Request, res: Response) => {
  const result = await announcementsService.getAnnouncementsById(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Announcements fetched successfully',
    data: result,
  });
});
const updateAnnouncements = catchAsync(async (req: Request, res: Response) => {
  const result = await announcementsService.updateAnnouncements(
    req.params.id,
    req.body,
  );
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Announcements updated successfully',
    data: result,
  });
});

const deleteAnnouncements = catchAsync(async (req: Request, res: Response) => {
  const result = await announcementsService.deleteAnnouncements(req.params.id);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'Announcements deleted successfully',
    data: result,
  });
});

export const announcementsController = {
  createAnnouncements,
  getAllAnnouncements,
  getAnnouncementsById,
  updateAnnouncements,
  deleteAnnouncements,
};
