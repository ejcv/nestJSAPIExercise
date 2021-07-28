import { Repository, EntityRepository } from "typeorm";
import { Task } from "./task.entity";
import { CreateTaskDTO } from "./dto/create-task.dto";
import { TaskStatus } from "./task-status.enum";
import { GetTasksFilterDto } from "./dto/get-tasks-filter.dto";
import { User } from "src/auth/user.entity";
import { Logger, InternalServerErrorException } from "@nestjs/common";

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
    //The repository allows us to add custom methods
    private logger = new Logger('TaskRepository');
    async getTasks(
        filterDto: GetTasksFilterDto,
        user: User,
        ): Promise <Task[]>{
        const { status, search } = filterDto;
        const query = this.createQueryBuilder('task');

        query.where('task.userId = :userId', { userId: user.id});
        //Add conditions
        if (status) {
            query.andWhere('task.status = :status',  { status });
        }

        if (search) {
            query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', { search: `%${search}%` });
        }

        try {
            const tasks = await query.getMany();
            return tasks;
        } catch (error) {
            this.logger.error(`Failed to get tasks for user "${user.username}", DTO: ${JSON.stringify(filterDto)}$ `, error.stack);
            throw new InternalServerErrorException();
        }
    }

    async createTask(
        createTaskDto: CreateTaskDTO,
        user: User,
        ): Promise<Task> {
        const { title, description } = createTaskDto;

            const task = new Task();

            task.title = title;
            task.description = description;
            task.status = TaskStatus.OPEN;
            task.user = user;
            
            try{
                await task.save();    //This might take time, so we need to wait for it
            } catch (error) {
                this.logger.error(`Failed to create a task for user "${user.username}". Data "${createTaskDto}"`, error.stack)
            }

            delete task.user;
            return task;
    }
}