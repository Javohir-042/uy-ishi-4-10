import { Student } from "src/student/entities/student.entity";
import { University } from "src/university/entities/university.entity";                                                 // University – bu boshqa entity (jadval) bilan bog‘lanish uchun kerak.
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";        // typeormdan esa entity yaratish va ustunlarni belgilash uchun kerakli dekoratorlar chaqirilmoqda.

@Entity('group')                                                            // bu class Group ni database jadvali sifatida belgilaydi va uni group jadvaliga bog‘laydi. 
export class Group{                                                         // Group degan TypeScript class yaratildi. Har bir Group obyekti – group jadvalidagi bitta qatorni ifodalaydi.
    
    @PrimaryGeneratedColumn()                                               // bu ustun asosiy kalit (PRIMARY KEY) bo‘ladi va avtomatik tarzda id qiymatini beradi (auto increment).
    id: number;

    @Column({ type: 'varchar', unique: true })  
    name: string;

    @CreateDateColumn()                                                     // bu ustun avtomatik tarzda yaratilgan vaqtni saqlaydi (timestamp).
    createdAt: Date;

    @UpdateDateColumn()                                                     // Bu ustun avtomatik oxirgi yangilangan vaqtini saqlaydi(timestamp)
    updatedAt: Date;

    @OneToMany(() => Student, (student) => student.group)
    student: Student[];

    @ManyToOne(() => University, (university) => university.groups, {       
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    university: University;
}


// ======================= 19 - qatordan boshlangan ===========================================================

// @ManyToOne(...) – bu Group va University o‘rtasida Many-to-One bog‘lanishni belgilaydi.

// Bir nechta Group bitta University ga tegishli bo‘ladi.

// () => University – bog‘lanayotgan model bu University ekanini bildiradi.

// (university) => university.groups – University modelidagi groups maydoniga qarab bog‘lanishini ko‘rsatadi.

// { onDelete: 'CASCADE', onUpdate: 'CASCADE' } – agar universitet o‘chirib tashlansa yoki id o‘zgarsa, unga tegishli Group lar ham avtomatik o‘chiriladi yoki yangilanadi.

// university: University; – bu Group entity ichida universitet obyektini ko‘rsatib turadigan property.

// ======================================================================================