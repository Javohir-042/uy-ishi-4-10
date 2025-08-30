
import { Group } from "src/group/entities/group.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('student')
export class Student {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar" })
    firstName: string;

    @Column({ type: "varchar" })
    lastName: string;

    @Column({ type: "int", nullable: true })
    age: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Group, (group) => group.student, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    })
    @JoinColumn({ name: 'groupId' })
    group: Group;
}
