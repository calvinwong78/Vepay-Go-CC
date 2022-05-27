import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne } from 'typeorm';
import { car } from './Vehicle'

@Entity()
export class Hat extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    color: string;

    @ManyToOne(type => car, hippo => hippo.hats)
    owner: car;
}