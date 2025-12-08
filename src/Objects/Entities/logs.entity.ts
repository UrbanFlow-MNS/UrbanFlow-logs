import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

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
    @Column({ type: 'timestamp', default: new Date() })
    createdAt: Date;
}