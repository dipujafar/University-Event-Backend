
import { Model } from 'mongoose';

export interface IAllData {}

export type IAllDataModules = Model<IAllData, Record<string, unknown>>;