import { DynamicModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';


export const getMongooseDbCongif = () : DynamicModule => {
  return MongooseModule.forRoot('mongodb+srv://admin:articledbnx123@cluster0.va25p.mongodb.net/');
};
