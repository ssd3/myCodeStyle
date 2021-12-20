import { Request } from 'express'
import { User } from '../entity/User'
import { ICommonFilter } from './ICommonFilter'

export interface IUserRequest extends Request {
    userId?: number
}

export interface IUserUpdateInput {
    id?: number
    userName: string
    firstName: string
    lastName: string
    email: string
    phone: string
    isSuperuser: boolean
    isStaff: boolean
    isCustomer: boolean
    isActive: boolean
}

export interface IUserCreateInput extends IUserUpdateInput {
    password: string
}

export interface IUserChangePasswordInput {
    id: number
    password: string
    newPassword: string
}

export interface IUserChangeEmailInput {
    id: number
    email: string
    newEmail: string
}

export interface IUserResult {
    totalCount: number
    users: User[]
}

export interface IUserFilter extends ICommonFilter {
    id?: number
    ids?: number[]
    userName?: string
    firstName?: string
    lastName?: string
    email?: string
    isSuperuser?: boolean
    isStaff?: boolean
    isCustomer?: boolean
    isActive?: boolean
    phone?: string
}

export interface IUserLoginInput {
    username: string
    password: string
    remember?: boolean
}
