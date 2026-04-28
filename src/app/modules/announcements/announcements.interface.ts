import { Model } from 'mongoose';

export interface IAnnouncements {
  title: string;
  description: string;
  isDeleted: boolean;
}

export type IAnnouncementsModules = Model<
  IAnnouncements,
  Record<string, unknown>
>;
