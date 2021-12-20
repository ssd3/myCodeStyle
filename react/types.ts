import { BaseEntity } from '../common/BaseEntity'

/**
 * SettingsType enum
 */
export enum SettingsType {
    QuickSyncFilter
}

/**
 * UserSettings index
 */
export const UserSettingsSpecs = [
    { path: 'Id', type: 'string' },
    { path: 'UserId', type: 'string' },
    { path: 'SettingsTypeId', type: 'integer' },
    { path: 'Value', type: 'json1' },
    { path: 'IsGlobal', type: 'integer' },
    { path: 'LastModifiedDate', type: 'string' }
]

/**
 * UserSettings interface
 */
export interface UserSettings extends BaseEntity {
    Id?: string
    UserId?: string
    SettingsTypeId: number
    Value?: any
    IsGlobal: number
    LastModifiedDate: Date
}

/**
 * UserSettingsType interface
 */
export interface UserSettingsType {
    userSettings?: UserSettings
    allUserSettings?: UserSettings[]
    error?: Error
}

/**
 * UserSettings action type
 */
export enum UserSettingsActionType {
    CreateOrUpdateUserSettings,
    GetUserSettings,
    GetAllUserSettings,
    DeleteUserSettings,
    ErrorUserSettings
}
