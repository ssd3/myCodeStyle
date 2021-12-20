import { Action, Dispatch } from 'redux'
import { UserSettings, UserSettingsActionType, UserSettingsType } from './types'
import { UserSettingsData } from '../../dataLayer/userSettingsData'
import { UserSettingsType as UserSettingsTypeId } from '../../enums/userSettingsType'

/**
 * User settings action interface
 */
export interface UserSettingsAction extends Action {
    payload: Partial<UserSettingsType>
}

/**
 * User settings actions
 */
export class UserSettingsActions {
    private readonly userSettingsData: UserSettingsData

    /**
     * ctor
     * @param dispatch
     */
    constructor(private readonly dispatch: Dispatch<UserSettingsAction>) {
        this.userSettingsData = new UserSettingsData()
    }

    /**
     * Create or update user settings
     * @param userSettings
     */
    setUserSettings = async(userSettings: UserSettings) => {
        const result = await this.userSettingsData.setUserSettings(userSettings)
        this.dispatch({
            type: UserSettingsActionType.CreateOrUpdateUserSettings,
            payload: { userSettings: result }
        })
    }

    /**
     * Get user settings by id
     * @param id
     */
    getUserSettingsById = async(id: string) => {
        const userSettings = await this.userSettingsData.getUserSettings(id)
        this.dispatch({
            type: UserSettingsActionType.GetUserSettings,
            payload: { userSettings }
        })
    }

    /**
     * Get all user settings
     */
    getAllUserSettings = async() => {
        const allUserSettings = await this.userSettingsData.getAllUserSettings()
        this.dispatch({
            type: UserSettingsActionType.GetAllUserSettings,
            payload: { allUserSettings }
        })
    }

    /**
     * Get user settings by type
     * @param userSettingsTypeId
     */
    getUserSettingsByType = async(userSettingsTypeId: UserSettingsTypeId) => {
        const userSettings = await this.userSettingsData.getUserSettingsByType(userSettingsTypeId)
        this.dispatch({
            type: UserSettingsActionType.GetUserSettings,
            payload: { userSettings }
        })
    }
}
