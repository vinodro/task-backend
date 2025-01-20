import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from './task.schema';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  async getTasks(userId: string): Promise<Task[]> {
    return this.taskModel.find({ userId }).exec();
  }

  async addTask(title: string, userId: string): Promise<Task> {
    const newTask = new this.taskModel({ title, userId });
    return newTask.save();
  }
}
