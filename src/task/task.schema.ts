import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Task extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  userId: string; // Foreign key to associate tasks with users
}

export const TaskSchema = SchemaFactory.createForClass(Task);
