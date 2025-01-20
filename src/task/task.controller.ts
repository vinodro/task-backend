import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.guard';
import { TaskService } from './task.service';

@Controller('tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getTasks(@Request() req) {
    return this.taskService.getTasks(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async addTask(@Body() body: { title: string }, @Request() req) {
    return this.taskService.addTask(body.title, req.user.userId);
  }
}
