import { group } from "console";
import { Group } from "src/group/entities/group.entity";
import { Teacher } from "src/teacher/entities/teacher.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";           // TypeORM dan kerakli dekoratorlarni import qilish

@Entity('university')                                   // bu klass DB dagi 'university' nomli jadval bilan bog‘lanadi
export class University {

    @PrimaryGeneratedColumn()                           // primary key, avtomatik o‘suvchi raqam (id)
    id: number;

    @Column({ type: 'varchar', nullable: true })        // type: 'varchar' — matn turi,  nullable: true — qiymat bo‘lmasa ham bo‘ladi
    name: string;

    @Column({ type: 'varchar' })                        // nullable yozilmagan => qiymat majburiy
    location: string;

    @CreateDateColumn()                                 // row yaratilgan vaqtni avtomatik saqlaydi
    createdAt: Date;

    @UpdateDateColumn()                                 // row oxirgi yangilanish vaqtini avtomatik saqlaydi
    updatedAt: Date;

    @OneToMany(() => Group, (group) => group.university)
    groups: Group[];    

    @OneToMany(() => Teacher, (teacher) => teacher.university)
    teacher: Teacher[];
}


// ==============================================================
// Qo‘shimcha tushuntirishlar:

// Entity — TypeORM da jadvalni ifodalovchi klass.

// PrimaryGeneratedColumn — birlamchi kalit, odatda id sifatida ishlatiladi, DB tomonidan avtomatik o‘sadi.

// Column — jadval ustunini yaratadi. Parametrlar:

// type — DBdagi ma’lumot turi (varchar, int, boolean va boshqalar)

// nullable — ustun bo‘sh bo‘lishi mumkinligini belgilaydi

// CreateDateColumn / UpdateDateColumn — avtomatik timestamp lar, siz qo‘lda qiymat kiritishingiz shart emas.