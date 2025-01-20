import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from './task.schema';

@Injectable()
export class TaskService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  async getTasks(userId: string): Promise<Task[]> {
    return this.taskModel.find({ userId }).exec();
  }

  async updateTask(id: string, body: any, userId: string) {
    const task = await this.taskModel.findById(id);

    if (!task) {
      throw new NotFoundException('Task not found');
    }
    console.log(task);
    // // Ensure the user owns the task
    // if (task.user.toString() !== userId) {
    //   throw new ForbiddenException('You do not have permission to update this task');
    // }

    // Update and return the updated task
    Object.assign(task, body);
    return task.save();
  }

  async addTask(body: any, userId: string): Promise<Task> {
    const newTask = new this.taskModel({ ...body, userId });
    return newTask.save();
  }
}
