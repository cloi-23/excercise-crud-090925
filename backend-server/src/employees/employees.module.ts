import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployeesService } from './employees.service';
import { EmployeesController } from './employees.controller';
import { Employee, EmployeeSchema } from './entities/employee.entity';
import { AttachmentService } from 'src/attachments/attachment.service';
import {
  Attachment,
  AttachmentSchema,
} from 'src/attachments/entites/attachment.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Employee.name, schema: EmployeeSchema },
      { name: Attachment.name, schema: AttachmentSchema },
    ]),
  ],
  controllers: [EmployeesController],
  providers: [EmployeesService, AttachmentService],
})
export class EmployeesModule {}
