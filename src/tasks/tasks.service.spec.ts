import { Test } from '@nestjs/testing'
import { TasksService } from './tasks.service';
import { TaskRepository } from './tasks.repository';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';
import { CreateTaskDTO } from './dto/create-task.dto';

const mockUser = { id: 12, username: 'Test user'};

const mockTaskRepository = () => ({
    getTasks: jest.fn(),
    findOne: jest.fn(),
    createTask: jest.fn(),
    delete: jest.fn(),
    updateTaskStatus: jest.fn(),
});

describe('TasksService', () => {
    let tasksService;
    let taskRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                TasksService,
                { provide: TaskRepository, useFactory: mockTaskRepository },
            ]
        }).compile();

        tasksService = await module.get<TasksService>(TasksService);
        taskRepository = await module.get<TaskRepository>(TaskRepository);
    });

    describe('getTasks', () => {
        it('gets all tasks from the repository', async () => {
            taskRepository.getTasks.mockResolvedValue('some value');

            expect(taskRepository.getTasks).not.toHaveBeenCalled();
            const filters: GetTasksFilterDto = { status: TaskStatus.IN_PROGRESS, search: 'Some search query' };
            // call tasksService.getTasks
            const result = await tasksService.getTasks(filters, mockUser);
            expect(taskRepository.getTasks).toHaveBeenCalled();
            // expect taskRepository.getTasks TO HAVE BEEN CALLED
            expect(result).toEqual('some value');
        });
    });

    describe('getTaskById',() => {
        it('calls taskRepository.findOne() and succesfully retrieve and return the task', async () => {
            const mockTask = { 
                title: 'Test task', 
                description: 'Test description', 
            };
            taskRepository.findOne.mockResolvedValue(mockTask);
            
            const result = await tasksService.getTaskById(1, mockUser);
            expect(result).toEqual(mockTask);

            expect(taskRepository.findOne).toHaveBeenCalledWith({
                where: {
                    id: 1,
                    userId: mockUser.id,
                },
            });
        });

        it('throws an error as task is not found', () => {
            taskRepository.findOne.mockResolvedValue(null);
            expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow(NotFoundException);
        });

        //Test for the CreateTask method

        describe('createTask', () => {
            it('sends a post request and succesfully creates a task', async () =>{
                //Test that the method has not been called
                expect(taskRepository.createTask).not.toHaveBeenCalled();
                //Its going to be resolved when it returns mockCreatedTask
                taskRepository.createTask.mockResolvedValue('some Task');
                
                //It is called with two arguments (CreateTaskDto, User)
                const createTaskDto: CreateTaskDTO = {   
                    title: 'Test Task',
                    description: 'Test description',
                };
                //Call tasksService with the mock arguments
                const result = await tasksService.createTask(createTaskDto, mockUser);
                //Check if it was called correctly
                expect(taskRepository.createTask).toHaveBeenCalledWith(createTaskDto, mockUser);
                expect(result).toEqual('some Task');
            });
        });
        
        describe('deleteTask', ()=>  {
            it('calls taskRepository.deleteTask() to delete a task', async () => {
                //Test that the method has not been called yet
                expect(taskRepository.delete).not.toHaveBeenCalled();
                //Its going to resolve returning affected: 1
                taskRepository.delete.mockResolvedValue({ affected: 1 });
                //It is called with two arguments (id, user)
                await tasksService.deleteTask(1, mockUser);
                expect(taskRepository.delete).toHaveBeenCalledWith({id: 1, userId: mockUser.id});
            });

            it('Throws an error as task could not be found', () => {
                taskRepository.delete.mockResolvedValue({ affected: 0 });
                expect(tasksService.deleteTask(1, mockUser)).rejects.toThrow(NotFoundException);
            });
        });

        describe('updateTask', () => {
            const save = jest.fn().mockResolvedValue(true);
            it('calls taskRepository.updateTask() to update a Task', async () => {
                tasksService.getTaskById = jest.fn().mockResolvedValue({
                    status: TaskStatus.OPEN,
                    save,
                });

                expect(tasksService.getTaskById).not.toHaveBeenCalled();
                expect(save).not.toHaveBeenCalled();
                const result = await tasksService.updateTaskStatus(1, TaskStatus.DONE, mockUser);
                expect(tasksService.getTaskById).toHaveBeenCalled();
                expect(save).toHaveBeenCalled();
                expect(result.status).toEqual(TaskStatus.DONE);
            });
        });
    });
});