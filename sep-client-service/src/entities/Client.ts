import { Entity, PrimaryGeneratedColumn, Column, Generated, OneToMany } from 'typeorm';

import { ClientToPaymentMethod } from './ClientToPaymentMethod';

@Entity()
export class Client {
    
    @PrimaryGeneratedColumn("uuid")
    public id: string;
    
    @Column()
    public username: string;
    
    @Column()
    @Generated("uuid")
    public merchantId: string;

    @Column()
    public secret: string;

    @Column()
    public successUrl: string;

    @Column()
    public failedUrl: string;

    @OneToMany(type => ClientToPaymentMethod, clientToPaymentMethod => clientToPaymentMethod.client)
    public clientToPaymentMethod!: ClientToPaymentMethod;
}