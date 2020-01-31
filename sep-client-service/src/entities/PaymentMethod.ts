import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

import { ClientToPaymentMethod } from './ClientToPaymentMethod';

@Entity()
export class PaymentMethod {
    
    @PrimaryGeneratedColumn("uuid")
    public id: string;
    
    @Column()
    public name: string;
    
    @Column()
    public signinUrl: string;

    @Column()
    public paymentUrl: string;

    @OneToMany(type => ClientToPaymentMethod, clientToPaymentMethod => clientToPaymentMethod.paymentMethod)
    public clientToPaymentMethod!: ClientToPaymentMethod;
}