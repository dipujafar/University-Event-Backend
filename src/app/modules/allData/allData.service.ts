import Events from '../events/events.models';
import { User } from '../user/user.models';
import Announcements from '../announcements/announcements.models';

const getAllAllData = async (userId: string) => {
  const event = await Events.find();
  const user = await User.findById(userId).select('-password');
  const announcements = await Announcements.find();

  return {
    event: event?.[0],
    user,
    announcements,
  };
};

export const allDataService = {
  getAllAllData,
};
