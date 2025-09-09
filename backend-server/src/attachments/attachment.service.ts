import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import { Attachment, AttachmentDocument } from './entites/attachment.entity';
import { ObjectId, Binary } from 'mongodb';

interface FileData {
  buffer: Buffer;
  mimetype: string;
  filename: string;
}

interface UploadedFile {
  originalname: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
  fieldname?: string;
  encoding?: string;
}

interface GridFSCollection {
  insertOne(doc: {
    filename: string;
    contentType: string;
    data: Binary;
  }): Promise<{ insertedId: ObjectId }>;
  findOne(
    query: object,
  ): Promise<{ data: Binary; filename: string; contentType: string } | null>;
  deleteOne(query: object): Promise<{ deletedCount: number }>;
}

@Injectable()
export class AttachmentService {
  private bucket: GridFSCollection;

  constructor(
    @InjectModel(Attachment.name)
    private attachmentModel: Model<AttachmentDocument>,
    @InjectConnection() private readonly connection: Connection,
  ) {
    this.bucket = this.connection.db!.collection('attachments.files');
  }

  async create(file: UploadedFile): Promise<Attachment> {
    if (!file) throw new Error('File is required');

    const result = await this.bucket.insertOne({
      filename: file.originalname,
      contentType: file.mimetype,
      data: new Binary(file.buffer),
    });

    const attachment = new this.attachmentModel({
      filename: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      fileId: result.insertedId.toHexString(),
    });

    return attachment.save();
  }

  async findOne(id: string): Promise<Attachment> {
    const attachment = await this.attachmentModel
      .findOne({ fileId: id })
      .exec();
    if (!attachment) throw new NotFoundException('Attachment not found');
    return attachment;
  }

  async remove(fileId: string): Promise<Attachment> {
    const attachment = await this.attachmentModel
      .findOneAndDelete({ fileId })
      .exec();
    if (!attachment) {
      throw new NotFoundException('Attachment not found');
    }

    if (attachment.fileId) {
      await this.bucket.deleteOne({
        _id: new Types.ObjectId(attachment.fileId),
      });
    }

    return attachment;
  }

  async getFile(fileId: string): Promise<FileData> {
    const fileDoc = await this.bucket.findOne({
      _id: new Types.ObjectId(fileId),
    });

    if (!fileDoc) throw new NotFoundException('File not found');

    return {
      buffer: Buffer.from(fileDoc.data.buffer),
      mimetype: fileDoc.contentType,
      filename: fileDoc.filename,
    };
  }
}
