
import { model, Schema } from 'mongoose';
import { IAllData, IAllDataModules } from './allData.interface';

const allDataSchema = new Schema<IAllData>(
  {
    isDeleted: { type: 'boolean', default: false },
  },
  {
    timestamps: true,
  }
);

//allDataSchema.pre('find', function (next) {
//  //@ts-ignore
//  this.find({ isDeleted: { $ne: true } });
//  next();
//});

//allDataSchema.pre('findOne', function (next) {
  //@ts-ignore
  //this.find({ isDeleted: { $ne: true } });
 // next();
//});

allDataSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

const AllData = model<IAllData, IAllDataModules>(
  'AllData',
  allDataSchema
);
export default AllData;