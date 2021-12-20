import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

/**
 * User entity
 */
@Entity('user' , { schema: 'schema' } )
export class User {
    @PrimaryGeneratedColumn({
        type: 'integer',
        name: 'id'
    })
    public id?: number

    @Column('character varying', {
        nullable: false,
        unique:  true,
        length: 32,
        name: 'username'
        })
    public userName!: string

    @Column('character varying', {
        nullable: true,
        length: 32,
        name: 'firstName'
        })
    public firstName?: string

    @Column('character varying', {
        nullable: true,
        length: 32,
        name: 'lastName'
        })
    public lastName?: string

    @Column('character varying', {
        nullable: false,
        length: 254,
        name: 'email'
        })
    public email!: string

    @Column('character varying', {
        nullable: false,
        length: 128,
        name: 'password'
        })
    public password!: string

    @Column('boolean', {
        nullable: false,
        name: 'isSuperuser'
        })
    public isSuperuser!: boolean

    @Column('boolean', {
        nullable: false,
        name: 'isStaff'
        })
    public isStaff!: boolean

    @Column('boolean', {
        nullable: false,
        name: 'isCustomer'
    })
    public isCustomer!: boolean

    @Column('boolean', {
        nullable: false,
        name: 'isActive'
        })
    public isActive!: boolean

    @Column('timestamp with time zone', {
        nullable: false,
        default:  () => 'now()',
        name: 'createdAt'
        })
    public createdAt!: Date

    @Column('character varying', {
        nullable: true,
        unique:  false,
        length: 15,
        name: 'phone'
    })
    public phone?: string

    @Column('integer', {
        nullable: false,
        name: 'createdBy'
    })
    public createdBy!: number
}
