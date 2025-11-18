import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class logsModel {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    microservice: string;
    @Column()
    microservice_id: number;
    @Column()
    code_of_event: string;
    @Column()
    event: string;
}