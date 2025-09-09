import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  UseInterceptors,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { EmployeesService } from './employees.service';
import type { Response } from 'express';

interface IUploadedFile {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
  size: number;
}

@Controller('employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  @Post()
  @UseInterceptors(FileInterceptor('photo'))
  create(@Body() body, @UploadedFile() file: IUploadedFile) {
    if (file && !file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Only image files are allowed!');
    }
    return this.employeesService.create(body, file);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('photo'))
  update(
    @Param('id') id: string,
    @Body() body,
    @UploadedFile() file: IUploadedFile,
  ) {
    if (file && !file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Only image files are allowed!');
    }
    return this.employeesService.update(id, body, file);
  }

  @Get()
  findAll() {
    return this.employeesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.employeesService.findOne(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.employeesService.remove(id);
  }

  @Get(':id/photo')
  async getPhoto(@Param('id') id: string, @Res() res: Response) {
    const file = await this.employeesService.getEmployeePhoto(id);
    res.setHeader('Content-Type', file.mimetype);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${file.filename}"`,
    );
    res.send(file.buffer);
  }
}
