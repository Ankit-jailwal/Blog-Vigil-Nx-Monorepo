import { DynamicModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';


export const getMongooseDbCongif = () : DynamicModule => {
  return MongooseModule.forRoot('mongodb://mongodb/articledbnx');
};
