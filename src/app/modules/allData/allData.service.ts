import Events from '../events/events.models';
import { User } from '../user/user.models';
import { Notification } from '../notification/notification.model';

const getAllAllData = async (userId: string) => {
  const event = await Events.find();
  const user = await User.findById(userId).select('-password');
  const announcements = await Notification.find();

  return {
    event: event?.[0],
    user,
    announcements,
  };
};

export const allDataService = {
  getAllAllData,
};
