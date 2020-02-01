import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Client {
    
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    // BANK
    @Column()
    public merchantId: string;
    
    // BANK
    @Column()
    public organizationId: string;
    
    // NK
    @Column()
    public userId: string;

    // NK
    @Column()
    public vendorId: string;

    // BANK
    @Column()
    public password: string;
}