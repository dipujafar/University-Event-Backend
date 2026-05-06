import httpStatus from 'http-status';
import { IAnnouncements } from './announcements.interface';
import Announcements from './announcements.models';
import AppError from '../../error/AppError';
import QueryBuilder from '../../class/builder/QueryBuilder';
import { getAllFcmTokens, sendNotification } from './announcements.utils';

const createAnnouncements = async (payload: IAnnouncements) => {
  const fcmTokens = await getAllFcmTokens();

  if (fcmTokens.length) {
    const sendAnnouncement = await sendNotification(fcmTokens, payload);

    console.log('sendAnnouncement', sendAnnouncement);
    if (!sendAnnouncement.successCount) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Failed to send announcements',
      );
    }
  }

  const result = await Announcements.create(payload);
  if (!result) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to create announcements',
    );
  }

  return result;
};

const getAllAnnouncements = async (query: Record<string, any>) => {
  query['isDeleted'] = false;
  const announcementsModel = new QueryBuilder(Announcements.find(), query)
    .search([])
    .filter()
    .paginate()
    .sort()
    .fields();

  const data = await announcementsModel.modelQuery;
  const meta = await announcementsModel.countTotal();

  return {
    data,
    meta,
  };
};

const getAnnouncementsById = async (id: string) => {
  const result = await Announcements.findById(id);
  if (!result || result?.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND, 'Announcements not found');
  }
  return result;
};

const updateAnnouncements = async (
  id: string,
  payload: Partial<IAnnouncements>,
) => {
  const result = await Announcements.findByIdAndUpdate(id, payload, {
    new: true,
  });
  if (!result) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to update Announcements',
    );
  }
  return result;
};

const deleteAnnouncements = async (id: string) => {
  const result = await Announcements.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true },
  );
  if (!result) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Failed to delete announcements',
    );
  }
  return result;
};

export const announcementsService = {
  createAnnouncements,
  getAllAnnouncements,
  getAnnouncementsById,
  updateAnnouncements,
  deleteAnnouncements,
};

// import admin from 'firebase-admin';
// import { StatusCodes } from 'http-status-codes';
// import file from '../firebase/firebase.json';
// import AppError from '../errors/AppError';
// import prisma from '../shared/prisma';

// admin.initializeApp({
//   credential: admin.credential.cert(file as any),
// });

// type NotificationPayload = {
//   title: string;
//   body: string;
//   data?: { [key: string]: string };
//   link?: string;
//   userId: string;
//   time?: string;
// };

// export const sendNotification = async (
//   fcmToken: string[],
//   payload: NotificationPayload,
// ): Promise<any> => {
//   try {
//     const response = await admin.messaging().sendEachForMulticast({
//       tokens: fcmToken,
//       notification: {
//         title: payload.title,
//         body: payload.body,
//       },
//       apns: {
//         headers: {
//           'apns-push-type': 'alert',
//         },
//         payload: {
//           aps: {
//             badge: 1,
//             sound: 'default',
//           },
//         },
//       },
//     });

//     console.log(response?.responses, 'from send notification');

//     if (response.successCount) {
//       fcmToken?.map(async token => {
//         try {
//           if (token) {
//             const notification: any = {
//               title: payload.title,
//               body: payload.body,
//               userId: payload.userId,
//             };

//             if (payload.data) {
//               notification.data = payload.data;
//             }

//             payload.link = payload.link || '';

//             const res = await prisma.notification.create({
//               data: notification,
//             });
//           } else {
//             console.log('Token not found');
//           }
//         } catch (error) {
//           console.log(error);
//         }
//       });
//     }

//     console.log('Response:', response.responses);

//     return response;
//   } catch (error: any) {
//     console.error('Error sending message:', error);
//     if (error?.code === 'messaging/third-party-auth-error') {
//       return null;
//     } else {
//       console.error('Error sending message:', error);
//       throw new AppError(
//         StatusCodes.NOT_IMPLEMENTED,
//         error.message || 'Failed to send notification',
//       );
//     }
//   }
// };
