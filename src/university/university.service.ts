import { Injectable, NotFoundException } from '@nestjs/common';                                                // NestJS service dekoratorini import qilamiz

// DTO larni import qilamiz — ma'lumotlarni validation va typing uchun
import { CreateUniversityDto } from './dto/create-university.dto';
import { UpdateUniversityDto } from './dto/update-university.dto';

import { ISuccessResponse } from 'src/interface/success-responst';                          // service dan qaytadigan standart response turi
import { InjectRepository } from '@nestjs/typeorm';                                         // TypeORM repository ni inject qilish uchun dekorator
import { University } from './entities/university.entity';                                  // University entity ni import qilamiz (jadvalni ifodalovchi klass)
import { Repository } from 'typeorm';                                                       // TypeORM repository class
import { getSuccessRes } from 'src/utils/getSuccessRes';                                    // Ma'lumotlarni standart response formatida qaytaradigan util funksiyasi

@Injectable()                                                                               // Service klassi — business logicni bajaradi
export class UniversityService {

  constructor(                                                                              // Constructor — repository ni inject qilamiz
    @InjectRepository(University) private readonly universityRepo: Repository<University>   // TypeORM repository ni shu service ichida ishlatish imkonini beradi
    // universityRepo — DB bilan CRUD operatsiyalarini bajaradi
  ) { }

  async create(createUniversityDto: CreateUniversityDto): Promise<ISuccessResponse> {       // Yangi universitet yaratish funksiyasi

    const newUniversity = this.universityRepo.create(createUniversityDto);                  // repository.create() — DTO dan entity yaratadi, lekin hali DB ga saqlamaydi

    await this.universityRepo.save(newUniversity);                                          // repository.save() — entity ni DB ga saqlaydi

    return getSuccessRes(newUniversity, 201);                                               // standart response formatida ma'lumotni qaytaradi, HTTP status 201 (Created)
  }

  async findAll(): Promise<ISuccessResponse> {

    const university = await this.universityRepo.find({
      relations: { groups: { student: true } },
      select: {
        id: true,
        name: true,
        location: true,
        groups: {
          id: true,
          name: true,
          student: {
            id: true,
            firstName: true,
            lastName: true,
            age: true,
          }
        }
      },
      order: { createdAt: 'DESC' },
    });


    return getSuccessRes(university);                                                       // natijani standart response formatida qaytaradi
  }

  async findOne(id: number): Promise<ISuccessResponse> {

    const universitet = await this.universityRepo.findOne({
      where: { id },
      select: {
        id: true,
        name: true,
        location: true,
        groups: {
          id: true,
          name: true,
          student: {
            id: true,
            firstName: true,
            lastName: true,
            age: true,
          }
        },
      },
    });               // TypeORM repository orqali DB dan id ga teng bo‘lgan bitta universitetni oladi

    if (!universitet) {                                                                      // Agar universited topilmasa
      throw new NotFoundException('University not found')                                   // Bu HTTP 404 response ga olib keladi
    }

    return getSuccessRes(universitet);                                                      // Universitet topilsa, uni standart response formatida qaytaradi
  }

  async update(id: number, updateUniversityDto: UpdateUniversityDto): Promise<ISuccessResponse> {
    await this.universityRepo.update({ id }, updateUniversityDto);
    const universited = await this.universityRepo.findOne({ where: { id } });
    if (!universited) {
      throw new NotFoundException('University not found');
    }

    return getSuccessRes(universited);
  }

  async remove(id: number): Promise<ISuccessResponse> {

    const result = await this.universityRepo.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException('University not found');
    }

    return getSuccessRes({});
  }
}


// ================= create =====================

// Qo‘shimcha tushuntirishlar:

// @Injectable() — NestJS ga bu klass service ekanini bildiradi va uni dependency injection orqali boshqa modulda ishlatish mumkin bo‘ladi.

// @InjectRepository(University) — TypeORM repository ni service ga ulaydi, shunda siz DB bilan CRUD amallarini repository orqali qilasiz.

// create() metodi:

// DTO (Data Transfer Object) qabul qiladi,

// entity yaratadi (.create()),

// DB ga saqlaydi (.save()),

// standart formatda javob qaytaradi (getSuccessRes).

// ================ findAll =================================

// Qo‘shimcha tushuntirishlar:

// async — bu metod Promise qaytarishini bildiradi, shuning uchun await bilan DB operatsiyasini kutish mumkin.

// Promise<ISuccessResponse> — metoddan qaytadigan tip, ya’ni getSuccessRes() qaytaradigan interfeysga mos keladi.

// this.universityRepo.find() — barcha University entity larini DB dan oladi. Agar find({ where: { location: 'Tashkent' } }) ishlatilsa, shart bilan filterlash mumkin.

// getSuccessRes(university) — barcha ma’lumotlarni standart JSON formatida frontend ga yuboradi.

