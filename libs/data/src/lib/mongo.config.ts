import { DynamicModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';


export const getMongooseDbCongif = () : DynamicModule => {
  return MongooseModule.forRoot(`${process.env['MONGO_URI']}`);
};
