import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  job: Date;

  @Prop({ enum: ['normal', 'admin'], default: 'normal' })
  role: string;

  @Prop({ required: true })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// UserSchema.pre<User>('save', async function (next) {
//   if (!this.isInit('password')) return next();
//   try {
//     this.password = await argon.hash(this.password);
//   } catch (error) {
//     next(error);
//   }

// if (!this.isModified('password')) return next();
// try {
//   this.password = bcrypt.hashSync(this.password, SALT);
//   console.log('pre save hook triggered');
//   this.isDocUpdated = true;
//   next();
// } catch (e) {
// }
// });
