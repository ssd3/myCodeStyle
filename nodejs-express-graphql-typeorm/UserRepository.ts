import { DeleteResult, EntityRepository, FindManyOptions, getCustomRepository, InsertResult, Repository, UpdateResult } from 'typeorm'
import { User } from '../entity/User'
import { IContext } from '../interfaces/IContext'
import { IDeleteResult } from '../interfaces/IDeleteResult'
import { IUserChangePasswordInput, IUserChangeEmailInput, IUserFilter, IUserResult, IUserUpdateInput, IUserCreateInput, IUserLoginInput } from '../interfaces/IUser'
import { Localization } from '../resources/Localization'
import { QueryUtils } from '../utils/query/Query'
import { CredentialsRepository } from './CredentialsRepository'

/**
 * User repository
 */
@EntityRepository(User)
export class UserRepository extends Repository<User> {
    private keyField: string = 'id'

    /**
     * Search users by filter values
     * @param filter
     */
    public async filterBy(filter: IUserFilter): Promise<IUserResult> {
        const {
            page = 1,
            perPage = 10,
            sortOrder = { id: 'ASC' },
            sortField
        } = filter

        const where = QueryUtils.createWhere<IUserFilter>(filter, this.keyField)

        const findManyOptions: FindManyOptions<User> = {
            relations: [],
            order: sortOrder,
            take: perPage,
            skip: (page - 1) * perPage,
            where
        }

        const result = await this.findAndCount({ ...findManyOptions } )
        return {
            users: result[0],
            totalCount: result[1]
        }
    }

    /**
     * Get user by id
     * @param id
     */
    public async getByUserId(id: number): Promise<User | undefined> {
        return await this.findOne(id, { relations: [] })
    }

    /**
     * Get user by username
     * @param userName
     */
    public async getByUsername(userName: string): Promise<User | undefined> {
        return await this.findOne({ userName }, { relations: [] })
    }

    /**
     * Get user by email
     * @param email
     */
    public async getByEmail(email: string): Promise<User | undefined> {
        return await this.findOne({ email }, { relations: [] })
    }

    /**
     * Create and save user
     * @param input
     * @param ctx
     */
    public async createAndSave(input: IUserCreateInput, ctx: IContext): Promise<User | undefined> {
        delete input.id
        const { password } = input
        input.password = await CredentialsRepository.hashPassword(password)

        const result: InsertResult = await this.insert({ ...input, createdBy: ctx.userId })
        if (result.identifiers.length === 0) {
            throw new Error(Localization.User.USER_NOT_CREATED)
        } else {
            const { id } = result.identifiers[0]
            return await this.getByUserId(id)
        }
    }

    /**
     * Update and save user
     * @param input
     * @param ctx
     */
    public async updateAndSave(input: IUserUpdateInput, ctx: IContext): Promise<User | undefined> {
        const result: UpdateResult = await this.update({ id: Number(input.id) }, { ...input })
        if (result.affected === 0) {
            throw new Error(Localization.User.USER_NOT_UPDATED)
        } else {
            return await this.getByUserId(Number(input.id))
        }
    }

    /**
     * Change user password
     * @param input
     * @param ctx
     */
    public async changePassword(input: IUserChangePasswordInput, ctx: IContext): Promise<User | undefined> {
        const user = await getCustomRepository(UserRepository).getByUserId(input.id)
        if (user) {
            let isMatching = await CredentialsRepository.comparePassword(input.newPassword, user.password!)
            if (isMatching) {
                throw new Error(Localization.User.NEW_PWD_CANT_BE_SAME)
            }

            isMatching = await CredentialsRepository.comparePassword(input.password, user.password!)
            if (!isMatching) {
                throw new Error(Localization.User.WRONG_OLD_PWD)
            }
        } else {
            throw new Error(Localization.User.CANT_CHANGE_PWD)
        }

        input.password = await CredentialsRepository.hashPassword(input.newPassword)
        const result: UpdateResult = await this.update({ id: input.id }, { password: input.password})
        if (result.affected === 0) {
            throw new Error(Localization.User.PWD_NOT_CHANGED)
        } else {
            return await this.getByUserId(input.id)
        }
    }

    /**
     * Change user e-mail address
     * @param input
     * @param ctx
     */
    public async changeEmail(input: IUserChangeEmailInput, ctx: IContext): Promise<User | undefined> {
        const result: UpdateResult = await this.update({ id: input.id }, { email: input.newEmail })
        if (result.affected === 0) {
            throw new Error(Localization.User.USER_EMAIL_NOT_CHANGED)
        } else {
            return await this.getByUserId(input.id)
        }
    }

    /**
     * Delete user by id
     * @param id
     * @param ctx
     */
    public async deleteUser(id: number, ctx: IContext): Promise<IDeleteResult | undefined> {
        const result: DeleteResult = await this.delete({ id })
        if (result.affected === 0) {
            throw new Error(Localization.User.USER_NOT_DELETED)
        } else {
            return {
                affected: result.affected,
                deletedIds: [id]
            }
        }
    }

    /**
     * Login user action
     * @param input
     */
    public async login(input: IUserLoginInput): Promise<boolean> {
        const user = await this.getByUsername(input.username)
        if (user === undefined) {
            return false
        } else {
            return await CredentialsRepository.comparePassword(input.password, String(user.password))
        }
    }
}
