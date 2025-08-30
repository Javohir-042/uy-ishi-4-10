import { University } from "src/university/entities/university.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('teacher')
export class Teacher {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar'})
    firstName: string;

    @Column({ type: 'varchar'})
    lastName: string;

    @Column({ type: 'varchar', nullable: true })
    specialization: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => University, (university) => university.teacher, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'universityId' })
    university: University;
}
