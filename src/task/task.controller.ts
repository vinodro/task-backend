import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Put,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.guard';
import { TaskService } from './task.service';

@Controller('tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getTasks(@Request() req) {
    return this.taskService.getTasks(req.user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateTask(
    @Param('id') id: string,
    @Body() body: { title?: string; description?: string; completed?: string },
    @Request() req,
  ) {
    return this.taskService.updateTask(id, body, req.user._id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async addTask(
    @Body() body: { title: string; description: string; completed?: Boolean },
    @Request() req,
  ) {
    return this.taskService.addTask(body, req.user._id);
  }
}
