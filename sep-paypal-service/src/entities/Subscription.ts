import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Subscription {
    
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

    @Column()
    public frequency: string;
    
    @Column()
    public period: string;

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

    // External Props
    
    /**
     * Paypal reference
     */
    @Column()
    public paypalAgreementId: string;

}