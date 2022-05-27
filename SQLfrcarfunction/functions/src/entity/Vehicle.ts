import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany, BeforeInsert } from 'typeorm';
import { Hat } from './backup';

@Entity()
export class car extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    VehicleID:number;

    @Column()
    createdAt: Date;


    @BeforeInsert()
    addTimestamp() {
        this.createdAt = new Date();
    }

    @OneToMany(type => Hat, hat => hat.owner)
    hats: Hat[];
}