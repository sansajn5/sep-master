import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Client {
    
    // System Props

    @PrimaryGeneratedColumn("uuid")
    public id: string;

    /**
     * Entity id of integrated system
     */
    @Column()
    public referenceId: string;

    /**
     * Integrated system id
     */
    @Column()
    public vendorId: string;


    // External Props

    /**
     * Paypal Client value 
     */
    @Column()
    public client: string;

    /**
     * Token Value for paypal secret
     */
    @Column()
    public secret: string;
}