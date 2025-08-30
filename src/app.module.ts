import { Module } from '@nestjs/common';                              // Nest.js modulini import qilish

import { AppController } from './app.controller';                     // AppController ni import qilish
import { AppService } from './app.service';                           // AppService ni import qilish

import { ConfigModule } from '@nestjs/config';                        // ConfigModule - .env faylidan konfiguratsiyani o'qish uchun
import { TypeOrmModule } from '@nestjs/typeorm';                      // TypeORM modulini import qilamiz (PostgreSQL, MySQL, va boshqa DB bilan ishlash uchun)
import { UniversityModule } from './university/university.module';    // UniversityModule ni import qilamiz (loyihada universitetlar bilan ishlash logikasi)
import { GroupModule } from './group/group.module';
import { StudentModule } from './student/student.module';
import { TeacherModule } from './teacher/teacher.module';

@Module({                                           // Nest.js moduleni yaratish
  imports: [
    ConfigModule.forRoot({                          // ConfigModule.forRoot() - global konfiguratsiya modulini o‘rnatish
      envFilePath: '.env',                          // .env faylini o‘qiydi
      isGlobal: true                                // Barcha modulda global bolsin 
    }),

    TypeOrmModule.forRoot({                         // TypeOrm orqali DB bilan ulanish 
      type: 'postgres',
      url: String(process.env.DB_URI),              // .env faylidan DB url olish
      synchronize: true,                            // Avtomatik ravishda entity ga qarab jadval yaratadi (dev uchun)
      autoLoadEntities: true,                       // Barcha entitylar avtomatik load qilinadi
      entities: []                                  // entity larni qo‘lda qo‘shish mumkin, lekin autoLoadEntities true bo‘lsa kerak emas
    }),

    UniversityModule,

    GroupModule,

    StudentModule,

    TeacherModule,                              // Loyihadagi University modulini import qilish
  ],
  controllers: [AppController],                     // Controller lar ro‘yxati (HTTP request larni qabul qiladi)
  providers: [AppService],                          // Service lar ro‘yxati (biznes logikani bajaradi)
})

export class AppModule {}


// ============================================================

// Qo‘shimcha tushuntirishlar:

// ConfigModule orqali siz .env fayldagi ma’lumotlarni (DB_URI, PORT va boshqa) global tarzda olishingiz mumkin.

// TypeOrmModule.forRoot() orqali siz DB bilan ulanish parametrlarini berasiz.

// synchronize: true — faqat developmentda ishlatish tavsiya etiladi, productionda zarar yetkazishi mumkin (jadvalni avtomatik o‘zgartiradi).

// autoLoadEntities: true — barcha @Entity() bilan belgilangan classlar avtomatik qo‘shiladi, shuning uchun entities: [] bo‘sh bo‘lishi mumkin.