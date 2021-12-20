import { defaultFieldResolver, GraphQLObjectType } from 'graphql'
import { SchemaDirectiveVisitor } from 'graphql-tools'

/**
 * GraphQL AuthDirective: restricted access by user role (group)
 */
export class AuthDirective extends SchemaDirectiveVisitor {
    public visitObject(object): GraphQLObjectType | void | null {
        this.ensureFieldsWrapped(object)
        object._requiredAuthRole = this.args.requires
    }

    public visitFieldDefinition(field, details) {
        this.ensureFieldsWrapped(details.objectType)
        field._requiredAuthRole = this.args.requires
    }

    public ensureFieldsWrapped(objectType) {
        if (objectType._authFieldsWrapped) {
            return
        }

        objectType._authFieldsWrapped = true
        const fields = objectType.getFields()

        Object.keys(fields).forEach((fieldName) => {
            const field = fields[fieldName]
            const { resolve = defaultFieldResolver } = field
            field.resolve = async (...args) => {
                const { isSuperuser, groups: userGroups, userId } = args[2]

                if (isSuperuser) {
                    return resolve.apply(this, args)
                }

                const requiredRoles = field._requiredAuthRole || objectType._requiredAuthRole
                if (!requiredRoles) {
                    return resolve.apply(this, args)
                }

                if (userGroups.some((userGroup) => requiredRoles.includes(userGroup))) {
                    return resolve.apply(this, args)
                } else {
                    return null
                }
            }
        })
    }
}
