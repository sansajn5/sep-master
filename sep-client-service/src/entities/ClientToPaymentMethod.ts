import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

import { Client } from './Client';
import { PaymentMethod } from './PaymentMethod';

@Entity()
export class ClientToPaymentMethod {
    
    @PrimaryGeneratedColumn("uuid")
    public id: string;
    
    // TODO remove this
    @Column()
    public userId: string;
    
    @Column()
    public paymentMethodId: string;

    @ManyToOne(type => Client, client => client.clientToPaymentMethod)
    public client!: Client;

    @ManyToOne(type => PaymentMethod, paymentMethod => paymentMethod.clientToPaymentMethod)
    public paymentMethod!: PaymentMethod;
    
}