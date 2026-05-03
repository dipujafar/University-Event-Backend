import admin from 'firebase-admin';
import httpStatus from 'http-status';
import file from '../../firebase/firebase.json';
import AppError from '../../error/AppError';
import { User } from '../user/user.models';
// import { Notification } from '../notification/notification.model';

admin.initializeApp({
  credential: admin.credential.cert(file as any),
});

type NotificationPayload = {
  title: string;
  description: string;
};

export const sendNotification = async (
  fcmToken: string[],
  payload: NotificationPayload,
): Promise<any> => {
  try {
    const response = await admin.messaging().sendEachForMulticast({
      tokens: fcmToken,
      notification: {
        title: payload.title,
        body: payload.description,
      },
      apns: {
        headers: {
          'apns-push-type': 'alert',
        },
        payload: {
          aps: {
            badge: 1,
            sound: 'default',
          },
        },
      },
    });

    console.log(response?.responses, 'from send notification');

    // if (response.successCount) {
    //   fcmToken?.map(async token => {
    //     try {
    //       if (token) {
    //         const notification: any = {
    //           title: payload.title,
    //           body: payload.description,
    //           userId: payload.userId,
    //         };

    //         if (payload.data) {
    //           notification.data = payload.data;
    //         }

    //         payload.link = payload.link || '';

    //         const res = await Notification.create({
    //           data: notification,
    //         });
    //       } else {
    //         console.log('Token not found');
    //       }
    //     } catch (error) {
    //       console.log(error);
    //     }
    //   });
    // }

    // console.log('Response:', response.responses);

    return response;
  } catch (error: any) {
    console.error('Error sending message:', error);
    if (error?.code === 'messaging/third-party-auth-error') {
      return null;
    } else {
      console.error('Error sending message:', error);
      throw new AppError(
        httpStatus.NOT_IMPLEMENTED,
        error.message || 'Failed to send notification',
      );
    }
  }
};

export const getAllFcmTokens = async (): Promise<string[]> => {
  const result = await User.aggregate([
    {
      $match: {
        isDeleted: false,
        fcmToken: { $ne: null },
      },
    },
    {
      $group: {
        _id: null,
        fcmTokens: { $push: '$fcmToken' },
      },
    },
    {
      $project: {
        _id: 0,
        fcmTokens: 1,
      },
    },
  ]);

  return result[0]?.fcmTokens ?? [];
};
