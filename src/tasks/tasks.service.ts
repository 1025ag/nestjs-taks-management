import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskRepository } from './task.repository';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTasFilterDto } from './dto/get-task-filter.dto';

@Injectable()
export class TasksService {
    
    constructor(
        @InjectRepository(TaskRepository) 
        private taskRepository: TaskRepository
    ) { };
    
    async getTasks(filterDto:GetTasFilterDto): Promise<Task[]> { 
        return await this.taskRepository.getTasks(filterDto);
     };
 

    async getTaskById(id: number) :Promise<Task> { 
        const found = await this.taskRepository.findOne(id);
        if(!found) { 
            throw new NotFoundException(`Task with id: "${id}" not found`);
        };
        return found;
    };

   
    async createTask(task:CreateTaskDto): Promise<Task> { 
        const newTask = await this.taskRepository.createTask(task);
        return newTask;
    };

    async updateTaskStatus(id:number, status:TaskStatus):Promise<Task> {
        const task = await this.getTaskById(id);
        task.status = status;
        await task.save();
        return task;
    };
 
    async deleteTask(id:number): Promise<void> { 
      const result = await this.taskRepository.delete({id});
      if(result.affected === 0) { 
        throw new NotFoundException(`Task with id: ${id} not found!`); 
      };
    };
};