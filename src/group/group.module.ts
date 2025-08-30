import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupController } from './group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { University } from 'src/university/entities/university.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Group, University])],
  controllers: [GroupController],
  providers: [GroupService],
})
export class GroupModule {}
