import { Module } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { TeacherController } from './teacher.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Teacher } from './entities/teacher.entity';
import { University } from 'src/university/entities/university.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Teacher, University])],
  controllers: [TeacherController],
  providers: [TeacherService],
})
export class TeacherModule {}
