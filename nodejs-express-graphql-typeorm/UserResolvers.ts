import { getCustomRepository } from 'typeorm'
import { GraphQLResolveInfo } from 'graphql'
import { User } from '../entity/User'
import { IDeleteResult } from '../interfaces/IDeleteResult'
import { IUserResult } from '../interfaces/IUser'
import { IContext } from '../models'
import { UserRepository } from '../models/UserRepository'

/**
 * Queries (User graphQL)
 */
export const Queries = {
    /**
     * User GraphQL resolver: get all users by filter criterias
     * @param _
     * @param filter
     * @param ctx
     * @param info
     */
    async users(_: void, { filter }, ctx: IContext, info: GraphQLResolveInfo): Promise<IUserResult> {
        return getCustomRepository(UserRepository).filterBy(filter)
    },
    /**
     * User GraphQL resolver: get user by id
     * @param _
     * @param id
     * @param ctx
     * @param info
     */
    async userById(_: void, id: number, ctx: IContext, info: GraphQLResolveInfo): Promise<User | undefined> {
        return getCustomRepository(UserRepository).getByUserId(id)
    },
    /**
     * User GraphQL resolver: get user by email
     * @param _
     * @param email
     * @param ctx
     * @param info
     */
    async userByEmail(_: void, email: string, ctx: IContext, info: GraphQLResolveInfo): Promise<User | undefined> {
        return getCustomRepository(UserRepository).getByEmail(email)
    },
    /**
     * User GraphQL resolver: get user by userName
     * @param _
     * @param userName
     * @param ctx
     * @param info
     */
    async userByUsername(_: void, userName: string, ctx: IContext, info: GraphQLResolveInfo): Promise<User | undefined> {
        return getCustomRepository(UserRepository).getByUsername(userName)
    },
    /**
     * User GraphQL resolver: login user
     * @param _
     * @param input
     * @param ctx
     * @param info
     */
    async userLogin(_: void, { input }, ctx: IContext, info: GraphQLResolveInfo): Promise<boolean> {
        return getCustomRepository(UserRepository).login(input)
    }
}

/**
 * Mutations (User graphQL)
 */
export const Mutations = {
    /**
     * User GraphQL resolver: create new user
     * @param _
     * @param input
     * @param ctx
     * @param info
     */
    async userCreate(_: void, { input }, ctx: IContext, info: GraphQLResolveInfo): Promise<User | undefined> {
        return await getCustomRepository(UserRepository).createAndSave(input, ctx)
    },
    /**
     * User GraphQL resolver: update exists user
     * @param _
     * @param input
     * @param ctx
     * @param info
     */
    async userUpdate(_: void, { input }, ctx: IContext, info: GraphQLResolveInfo): Promise<User | undefined> {
        return await getCustomRepository(UserRepository).updateAndSave(input, ctx)
    },
    /**
     * User GraphQL resolver: change user password
     * @param _
     * @param input
     * @param ctx
     * @param info
     */
    async userChangePassword(_: void, { input }, ctx: IContext, info: GraphQLResolveInfo): Promise<User | undefined> {
        return await getCustomRepository(UserRepository).changePassword(input, ctx)
    },
    /**
     * User GraphQL resolver: change user email
     * @param _
     * @param input
     * @param ctx
     * @param info
     */
    async userChangeEmail(_: void, { input }, ctx: IContext, info: GraphQLResolveInfo): Promise<User | undefined> {
        return await getCustomRepository(UserRepository).changeEmail(input, ctx)
    },
    /**
     * User GraphQL resolver: delete exists user
     * @param _
     * @param userId
     * @param ctx
     * @param info
     */
    async userDelete(_: void, { id }, ctx: IContext, info: GraphQLResolveInfo): Promise<IDeleteResult | undefined> {
        return await getCustomRepository(UserRepository).deleteUser(id, ctx)
    }
}
