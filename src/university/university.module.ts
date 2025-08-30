import { Module } from '@nestjs/common';
import { UniversityService } from './university.service';
import { UniversityController } from './university.controller';

import { TypeOrmModule } from '@nestjs/typeorm';                      // DB bilan ishlash uchun, entity larni modulga ulash uchun
import { University } from './entities/university.entity';            // University entity sini import qilamiz (jadvalni ifodalovchi klass)

@Module({                                                             // NestJS modulini yaratamiz

  imports: [TypeOrmModule.forFeature([University])],                  // forFeature([University]) — shu modul ichida University entity bilan DB operatsiyalarini qilishga ruxsat beradi

  controllers: [UniversityController],                                // HTTP request larni qabul qiladigan controller lar
  providers: [UniversityService],                                     // business logicni bajaradigan service lar
})

export class UniversityModule {}                                      // bu NestJS modul bo‘lib, universitetlar bilan ishlash logikasini encapsulate qiladi



// ===========================================================================

// Qo‘shimcha tushuntirishlar:

// TypeOrmModule.forFeature([University]) — bu modul ichida University entity bilan CRUD operatsiyalarini qilish imkonini beradi. 
// Shu orqali siz UniversityService da @InjectRepository(University) orqali repository olishingiz mumkin.

// controllers — HTTP so‘rovlarni (GET, POST, PATCH, DELETE) qabul qiladi va service ga uzatadi.

// providers — business logic, ya’ni ma’lumotlarni DB ga yozish, o‘qish, o‘chirish, yangilash funksiyalari shu yerda bo‘ladi.

// Modulning maqsadi — loyihani kichik, mustaqil bloklarga bo‘lish, har bir modul o‘z entity, service va controller bilan ishlaydi.