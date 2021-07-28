import { PipeTransform, BadRequestException } from '@nestjs/common';
import { TaskStatus } from '../task-status.enum';
//How to do a custom validation pipe

export class TaskStatusValidationPipe implements PipeTransform {
    readonly allowedStatuses = [      //include the valid statuses
        TaskStatus.OPEN,
        TaskStatus.IN_PROGRESS,
        TaskStatus.DONE,
    ];

    transform(value: any) {    //The interface needs a transform method
        value = value.toUpperCase();
        
        if (!this.isStatusValid(value)) {
            throw new BadRequestException(`"${value}" is an invalid status`);
        }
        return value;
    }

    private isStatusValid(status: any) {   //This method checks if the status is valid or not
        const idx = this.allowedStatuses.indexOf(status);
        return idx !== -1;
    }

}