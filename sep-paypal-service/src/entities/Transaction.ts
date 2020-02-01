import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Transaction {
    
    // Common transaction props
    
    @PrimaryGeneratedColumn("uuid")
    public id: string;

    @Column()
    public status: string;

    @Column()
    public timestamp: Date;

    @Column()
    public currency: string;
    
    @Column()
    public amount: string;

    /**
     * System client id
     */
    @Column()
    public sellerId: string;

    /**
     * Integrated system id
     */
    @Column()
    public vendorId: string;
    
    @Column()
    public referenceBuyerId: string;

    @Column()
    public referenceSellerId: string;

    @Column()
    public referenceTransactionId: string;

    // External Props
    
    /**
     * Paypal reference
     */
    @Column()
    public paypalTransactionReference: string;

    @Column()
    public paypalStatusReference: string;

    
}