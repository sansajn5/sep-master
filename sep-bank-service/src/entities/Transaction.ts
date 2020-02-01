import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Transaction {
    
    @PrimaryGeneratedColumn("uuid")
    public id: string;
    
    @Column()
    public clientId: string;
    
    @Column()
    public status: string;
    
    // for NK
    @Column()
    public referenceId: string;

    // For bank
    @Column()
    public merchantIdOrderId: string;
}