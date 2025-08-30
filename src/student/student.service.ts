import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from './entities/student.entity';
import { Repository } from 'typeorm';
import { Group } from 'src/group/entities/group.entity';
import { ISuccessResponse } from 'src/interface/success-responst';
import { getSuccessRes } from 'src/utils/getSuccessRes';

@Injectable()
export class StudentService {
  constructor(
    @InjectRepository(Student)
    private readonly studentRepo: Repository<Student>,
    @InjectRepository(Group) private readonly groupRepo: Repository<Group>,
  ) { }

  async create(createStudentDto: CreateStudentDto): Promise<ISuccessResponse> {
    const { groupId } = createStudentDto;
    const group = await this.groupRepo.findOne({ where: { id: groupId } });
    if (!group) {
      throw new NotFoundException('Group not found')
    }

    const newSturdent = this.studentRepo.create({
      ...createStudentDto,
      group,
    });

    await this.studentRepo.save(newSturdent);
    return getSuccessRes(newSturdent, 201);
  }

  async findAll(): Promise<ISuccessResponse> {
    const student = await this.studentRepo.find({
      relations: {
        group: {
          university: true,
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        age: true,
        group: {
          id: true,
          name: true,
          university: {
            id: true,
            name: true,
            location: true
          },
        },
      },
      order: { createdAt: 'DESC' },
    });

    return getSuccessRes(student);
  }

  async findOne(id: number): Promise<ISuccessResponse> {
    const student = await this.studentRepo.findOne({
      where: { id },
      relations: {
        group: {
          university: true,
        },
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        age: true,
        group: {
          id: true,
          name: true,
          university: {
            id: true,
            name: true,
            location: true,
          },
        },
      },
    });
    
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return getSuccessRes(student);
  }

  async update(id: number, updateStudentDto: UpdateStudentDto): Promise<ISuccessResponse> {
    const { groupId } = updateStudentDto;
    const student = await this.studentRepo.findOne({
      where: { id },
      relations: { group: true },
    });
    
    if(!student) {
      throw new NotFoundException('Student not found')
    }

    let group = student.group;
    if(groupId) {
      const existsGroup = await this.groupRepo.findOne({
        where: { id: groupId },
      });

      if(!existsGroup){
        throw new NotFoundException('University not found');
      }

      group = existsGroup;
      delete updateStudentDto.groupId;
    }

    await this.studentRepo.update({ id }, { ...updateStudentDto, group });
    const updateStudent = await this.studentRepo.findOne({
      where: {id},
      relations: { group:true },
    });

    return getSuccessRes(updateStudent ?? student); 
  }

  async remove(id: number): Promise<ISuccessResponse> {
    const student = await this.studentRepo.delete({ id });
    if(!student){
      throw new NotFoundException('Student not found');
    }

    return getSuccessRes({});
  }
}
