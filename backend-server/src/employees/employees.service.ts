import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Employee, EmployeeDocument } from './entities/employee.entity';
import { AttachmentService } from '../attachments/attachment.service';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectModel(Employee.name) private employeeModel: Model<EmployeeDocument>,
    private readonly attachmentService: AttachmentService,
  ) {}

  async create(body, file: any): Promise<Employee> {
    const existing = await this.employeeModel
      .findOne({
        $or: [{ username: body.username }, { email: body.email }],
      })
      .exec();

    if (existing) {
      throw new ConflictException(`Employee username or email already exists`);
    }

    const newEmployee = new this.employeeModel(body);
    if (!file) return await newEmployee.save();

    const attachment = await this.attachmentService.create(file);
    newEmployee.photo = attachment.fileId;

    return await newEmployee.save();
  }

  async findAll(): Promise<Employee[]> {
    return await this.employeeModel.find().exec();
  }

  async findOne(id: string): Promise<Employee> {
    const employee = await this.employeeModel.findById(id).exec();
    if (!employee) {
      throw new NotFoundException(`Employee ID not found`);
    }
    return employee;
  }

  async update(id: string, bodys: any, file?: any): Promise<Employee> {
    const employee = await this.employeeModel.findById(id).exec();
    if (!employee) {
      throw new NotFoundException(`Employee ID not found`);
    }

    if (file) {
      if (employee.photo) {
        await this.attachmentService.remove(employee.photo);
      }
      const attachment = await this.attachmentService.create(file);
      bodys.photo = attachment.fileId;
    }

    const updatedEmployee = await this.employeeModel
      .findByIdAndUpdate(id, bodys, { new: true })
      .exec();

    if (!updatedEmployee) {
      throw new NotFoundException(`Employee ID not found after update`);
    }

    return updatedEmployee;
  }

  async remove(id: string): Promise<Employee> {
    const deletedEmployee = await this.employeeModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedEmployee) {
      throw new NotFoundException(`Employee ID not found`);
    }
    return deletedEmployee;
  }

  async getEmployeePhoto(
    employeeId: string,
  ): Promise<{ buffer: Buffer; mimetype: string; filename: string }> {
    const employee = await this.employeeModel.findById(employeeId).exec();
    if (!employee) throw new NotFoundException('Employee not found');
    if (!employee.photo) throw new NotFoundException('Employee has no photo');

    const attachment = await this.attachmentService.findOne(employee.photo);
    const file = await this.attachmentService.getFile(attachment.fileId);
    return file;
  }
}
