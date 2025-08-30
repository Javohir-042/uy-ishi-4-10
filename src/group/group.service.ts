import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { Repository } from 'typeorm';
import { University } from 'src/university/entities/university.entity';
import { ISuccessResponse } from 'src/interface/success-responst';
import { getSuccessRes } from 'src/utils/getSuccessRes';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group) private readonly groupRepo: Repository<Group>,
    @InjectRepository(University)
    private readonly universityRepo: Repository<University>,
  ) { }

  async create(createGroupDto: CreateGroupDto): Promise<ISuccessResponse> {     // create(createGroupDto: CreateGroupDto) – funksiya parametr sifatida CreateGroupDto obyektini oladi (unda masalan: name, universityId kabi ma’lumotlar bo‘ladi).
    const existsGroup = await this.groupRepo.findOne({
      where: { name: createGroupDto.name },
    });

    if (existsGroup) {                                                           // Agar existsGroup mavjud bo‘lsa, demak bu nomli group allaqachon bor.
      throw new ConflictException('Group alrady exists');                       // 409 Conflict error
    }

    const university = await this.universityRepo.findOne({                      // this.universityRepo.findOne(...) – university jadvalidan qidiradi.  university – agar topilsa obyekt bo‘ladi, topilmasa null.
      where: { id: createGroupDto.universityId },                               // where: { id: createGroupDto.universityId } – foydalanuvchi yuborgan universityId bo‘yicha universitet qidiriladi.
    });

    if (!university) {                                                           // Agar university topilmagan bo‘lsa (null bo‘lsa), demak bunday universitet mavjud emas.
      throw new NotFoundException('University not found');                      // Shunda 404 Not Found xatosi chiqariladi: "University not found"
    }

    const newGroup = this.groupRepo.create({                                    // this.groupRepo.create(...) – yangi Group obyektini yaratadi (lekin hozircha databasega yozmaydi).  
      ...createGroupDto,                                                        // DTOdagi barcha maydonlarni (name, universityId) oladi va ustiga university obyektini qo‘shadi.
      university,
    });

    await this.groupRepo.save(newGroup);                                        // newGroup obyektini databasega yozadi.

    return getSuccessRes(newGroup, 201);
  }

  async findAll(): Promise<ISuccessResponse> {
    const groups = await this.groupRepo.find({
      relations: { university: true },
      select: {
        id: true,
        name: true,
        university: {
          id: true,
          name: true,
          location: true,
          
        },
      },
      order: { createdAt: 'DESC' },
    });

    return getSuccessRes(groups);
  }

  async findOne(id: number): Promise<ISuccessResponse> {
    const group = await this.groupRepo.findOne({
      where: { id },
      relations: { university: true },
      select: {
        id: true,
        name: true,
        university: {
          id: true,
          name: true,
          location: true,
        }
      }
    });

    if (!group) {                                                    // Agar group topilmagan bo‘lsa (null bo‘lsa), unda xato chiqariladi.
      throw new NotFoundException('Group not found');               // throw new NotFoundException(...) – bu 404 xato qaytaradi (Group not found).
    }

    return getSuccessRes(group)
  }

  async update(id: number, updateGroupDto: UpdateGroupDto): Promise<ISuccessResponse> {
    const { name, universityId } = updateGroupDto;

    const group = await this.groupRepo.findOne({                                    // this.groupRepo.findOne(...) – database’dan shu id bo‘yicha groupni topadi.
      where: { id },  
      relations: { university: true },                                              // relations: { university: true } – shu group bilan bog‘langan universitetni ham qo‘shib oladi.
    
      // Natija group o‘zgaruvchisiga yoziladi. Agar topilmasa null.
    });

    if(!group){                                                                     // Agar group topilmagan bo‘lsa (null bo‘lsa), 404 xato qaytaradi: "Group not found".
      throw new NotFoundException('Group not found');
    }

    if(name) {
      const existsGroup = await this.groupRepo.findOne({ where: { name } });
      if(existsGroup && existsGroup.id != id) {
        throw new ConflictException('Group alrady exists');
      }
    }

    let university = group.university;                                              // Hozirgi group’ning universitetini university o‘zgaruvchisiga olinyapti.
    
    if(university) {                                                                // Agar group allaqachon biror universitetga bog‘langan bo‘lsa:
      const existsUniversity = await this.universityRepo.findOne({
        where: { id: universityId },                                                // Yuborilgan universityId bo‘yicha database’dan universitetni qidiradi.
      }); 

      if(!existsUniversity) {
        throw new NotFoundException('University not found');                        // Agar yangi universityId bo‘yicha universitet topilmasa, 404 xato chiqaradi.
      }

      university = existsUniversity;                                                // Agar universitet topilsa, university ni yangilaydi.
      delete updateGroupDto.universityId;                                           // delete updateGroupDto.universityId – DTO dan universityId ni olib tashlaydi, chunki typeorm uchun to‘g‘ridan-to‘g‘ri obyekt (university) kerak, faqat id emas.
    }

    await this.groupRepo.update({ id }, { ...updateGroupDto, university });         // this.groupRepo.update(...) – berilgan id bo‘yicha groupni yangilaydi. { ...updateGroupDto, university } – foydalanuvchi yuborgan yangilanish ma’lumotlari va yangilangan universitet obyektini qo‘shadi.
    
    const updatedGroup = await this.groupRepo.findOne({                             // Yangilanishdan keyin qayta findOne bilan groupni chaqiradi.
      where: { id },
      relations: { university: true },                                              // universitet ma’lumotlari bilan birga olib keladi.
    });

    return getSuccessRes(updatedGroup ?? group);                                    // updatedGroup ?? group – agar yangilangan group topilsa updatedGroup, bo‘lmasa eski group qaytariladi.
  }

  async remove(id: number): Promise<ISuccessResponse> {
    const group = await this.groupRepo.delete({ id });
    if(!group) {
      throw new NotFoundException('Group not found')
    }

    return getSuccessRes({});
  }
}


// ============================ Ozroq tushuntirishlar =============================================

// create(createGroupDto: CreateGroupDto) –> funksiya parametr sifatida CreateGroupDto obyektini oladi (unda masalan: name, universityId kabi ma’lumotlar bo‘ladi).

// : Promise<ISuccessResponse> –> funksiya natijada ISuccessResponse turidagi promise qaytarishini bildiradi (ya’ni, muvaffaqiyatli javob qaytadi).

// where: { name: createGroupDto.name } –> name ustuni createGroupDto.name ga teng bo‘lgan Groupni izlaydi.

// relations – bu yerda qaysi bog‘langan entitylarni ham olib kelish kerakligi ko‘rsatiladi.

// select – bu qaysi ustunlar olinishi kerakligini bildiradi (hamma maydonni emas, faqat keraklilarini oladi).

// =============================== create ===========================================

// Yangi group nomi bo‘yicha qidiradi → agar mavjud bo‘lsa 409 xato chiqaradi.

// Universitetni qidiradi → agar topilmasa 404 xato chiqaradi.

// Yangi group obyektini yaratadi.

// Uni databasega saqlaydi.

// Muvaffaqiyatli natijani (201 Created) qaytaradi.

// =============================== findAll() =============================================

// this.groupRepo.find(...) – bu group jadvalidan barcha yozuvlarni olish uchun ishlatiladi.
// groups – olingan barcha guruhlar ro‘yxati shu o‘zgaruvchiga yoziladi.


// relations – bu yerda qaysi bog‘langan entitylarni ham olib kelish kerakligi ko‘rsatiladi.
// { university: true } – demak, har bir group bilan bog‘langan University ma’lumotlari ham qo‘shib olinadi.

// select – bu qaysi ustunlar olinishi kerakligini bildiradi (hamma maydonni emas, faqat keraklilarini oladi).
// id: true, name: true – Group jadvalidan faqat id va name ustunlarini oladi.
// university: { ... } – bog‘langan University jadvalidan faqat id, name, location ustunlarini oladi.

// order – natijalarni tartiblash uchun ishlatiladi.
// { createdAt: 'DESC' } – createdAt ustuni bo‘yicha oxirgi qo‘shilgan group birinchi chiqadi (DESC = kamayish tartibida).

// ---- Xulosa =>

// Barcha guruhlarni olish uchun groupRepo.find ishlatadi.

// Ular bilan birga University ma’lumotlarini ham qo‘shib oladi.

// Faqat kerakli ustunlarni tanlaydi (id, name, location).

// createdAt bo‘yicha tartiblaydi (oxirgi qo‘shilganlar oldin chiqadi).

// Natijani formatlangan holda qaytaradi.

// =============================== findOne() ====================================================

// this.groupRepo.findOne(...) – group jadvalidan bitta yozuvni (groupni) olish uchun ishlatiladi.
// group – natijada topilgan obyekt shu o‘zgaruvchiga yoziladi. Agar topilmasa null.

// where: { id } – qaysi yozuvni olish kerakligi ko‘rsatilmoqda. Bu yerda id bo‘yicha qidiryapti (group.id = id).

// relations – bog‘langan jadvallarni ham qo‘shib olish uchun ishlatiladi.
// { university: true } – demak, bu groupga tegishli University ma’lumotlari ham keltiriladi.

// ---Xulosa =>

// id bo‘yicha groupni qidiradi.

// Shu group bilan bog‘langan university ma’lumotlarini ham qo‘shib oladi.

// Faqat kerakli ustunlarni tanlaydi (id, name, location).

// Agar group topilmasa → 404 Not Found.

// Agar topsa → muvaffaqiyatli natijani qaytaradi.

// ================================ update ===============================

//const { name, universityId } = updateGroupDto; =>

// updateGroupDto ichidan name va universityId qiymatlari destrukturatsiya qilinyapti.
// Endi kerakli joylarda updateGroupDto.name deb yozish o‘rniga bevosita name va universityId ishlatish mumkin.

