import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class LogsEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    microserviceName: string;
    @Column()
    codeOfEvent: string;
    @Column()
    event: string;
    @CreateDateColumn()
    createdAt: Date;
}