import { Model } from 'mongoose';

export interface ILocation {
  venue: string;
  address: string;
  mapLink?: string;
}

export interface IIncluded {
  title: string;
  image?: string;
}
export interface IEvents {
  name: string;
  location: ILocation;
  date: Date;
  startTime: Date;
  endTime: Date;
  instructions?: string[];
  included?: IIncluded[];
  isDeleted: boolean;
}



export interface EventsModel extends Model<IEvents> {
  IsEventsExist(): Promise<IEvents[]>;
}
