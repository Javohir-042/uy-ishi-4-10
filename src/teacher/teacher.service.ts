import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTeacherDto } from './dto/create-teacher.dto';
import { UpdateTeacherDto } from './dto/update-teacher.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Teacher } from './entities/teacher.entity';
import { Repository } from 'typeorm';
import { University } from 'src/university/entities/university.entity';
import { ISuccessResponse } from 'src/interface/success-responst';
import { getSuccessRes } from 'src/utils/getSuccessRes';

@Injectable()
export class TeacherService {
  constructor(
    @InjectRepository(Teacher) private readonly teacherRepo: Repository<Teacher>,
    @InjectRepository(University) private readonly universityRepo: Repository<University>,
  ) { }

  async create(createTeacherDto: CreateTeacherDto): Promise<ISuccessResponse> {

    const existsTeacher = await this.teacherRepo.findOne({
      where: {
        lastName: createTeacherDto.lastName,
        firstName: createTeacherDto.firstName,
        university: { id: createTeacherDto.universityId }
      },
      relations: ["university"],
    });

    if (existsTeacher) {
      throw new ConflictException('Teacher already exists');
    }

    const university = await this.universityRepo.findOne({
      where: { id: createTeacherDto.universityId },
    });

    if (!university) {
      throw new NotFoundException('University not found')
    }

    const newTeacher = this.teacherRepo.create({
      ...createTeacherDto,
      university,
    });
    await this.teacherRepo.save(newTeacher);

    return getSuccessRes(newTeacher, 201);
  }

  async findAll(): Promise<ISuccessResponse> {
    const teacher = await this.teacherRepo.find({
      relations: ['university'],
      select: {
        id: true,
        firstName: true,
        lastName: true,
        specialization: true,
        university: {
          id: true,
          name: true,
          location: true
        },
      },
      order: { createdAt: 'DESC'}
    });

    return getSuccessRes(teacher);
  }

  async findOne(id: number): Promise<ISuccessResponse> {
    const teacher = await this.teacherRepo.findOne({
      where: { id },
      relations: { university: true },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        specialization: true,
        university: {
          id: true,
          name: true,
          location: true,
        }
      }
    });

    if(!teacher){
      throw new NotFoundException(" Teacher not found")
    }

    return getSuccessRes(teacher);
  }

  async update(id: number, updateTeacherDto: UpdateTeacherDto): Promise<ISuccessResponse> {
    const teacher = await this.teacherRepo.findOne({ where: { id } });

    if(!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    Object.assign(teacher, updateTeacherDto);

    await this.teacherRepo.save(teacher);

    return getSuccessRes(teacher);
  }

  async remove(id: number): Promise<ISuccessResponse> {
    const teacher = await this.teacherRepo.findOne({ where: { id } });

    if(!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    await this.teacherRepo.remove(teacher);

    return getSuccessRes({})
  }
}
