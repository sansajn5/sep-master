import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class Client {
    
    @PrimaryColumn()
    public id: string;
    
    @Column()
    public successUrl: string;

    @Column()
    public failedUrl: string;
}