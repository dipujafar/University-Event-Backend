import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { allDataService } from './allData.service';
import sendResponse from '../../utils/sendResponse';

const getAllAllData = catchAsync(async (req: Request, res: Response) => {
  const result = await allDataService.getAllAllData(req?.user?.userId);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: 'All allData fetched successfully',
    data: result,
  });
});

export const allDataController = {
  getAllAllData,
};
