/**
 * UserSettings DAL
 */
export class UserSettingsData extends BaseData {
    /**
     * UserSettingsData ctor
     */
    constructor() {
        super(Table.UserSettings)
    }

    /**
     * Get user settings by id
     * @param id
     */
    public async getUserSettings(id: string): Promise<UserSettings | undefined> {
        if (await this.isExists()) {
            const [userSettings] = await Query.getExactRecords<UserSettings>('Id', id)
            return userSettings
        }
        return undefined
    }

    /**
     * Get user settings by user settings type
     * @param userSettingsTypeId
     */
    public async getUserSettingsByType(userSettingsTypeId: UserSettingsType): Promise<UserSettings | undefined> {
        if (await this.isExists()) {
            const [userSettings] = await Query.getExactRecords<UserSettings>('SettingsTypeId', userSettingsTypeId)
            return userSettings
        }
        return undefined
    }

    /**
     * Get all user settings
     */
    public async getAllUserSettings(): Promise<UserSettings[] | undefined> {
        if (await this.isExists()) {
            return await Query.getAllRecords<UserSettings>()
        }
        return undefined
    }

    /**
     * Create or update user settings record
     * @param userSettings
     */
    public async setUserSettings(userSettings: UserSettings): Promise<UserSettings | undefined> {
        if (await this.isExists()) {
            const [result] = await Query.upsertEntries<UserSettings>([userSettings])
            return result
        }
        return undefined
    }
}
