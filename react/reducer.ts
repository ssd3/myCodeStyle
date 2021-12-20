import { Reducer } from 'redux'
import { UserSettingsActionType, UserSettingsType } from './types'
import { UserSettingsAction } from './actions'

/**
 * User settings initial state
 */
export const initialState: UserSettingsType = {
    //
}

/**
 * User settings reducer implementation
 * @param state
 * @param action
 */
export const userSettingsReducer: Reducer<UserSettingsType, UserSettingsAction> = (state = initialState, action) => {
    switch (action.type) {
        case UserSettingsActionType.CreateOrUpdateUserSettings:
        case UserSettingsActionType.GetUserSettings: {
            const { userSettings } = action.payload
            state.userSettings = userSettings
            return { ...state }
        }
        case UserSettingsActionType.GetAllUserSettings: {
            const { allUserSettings } = action.payload
            state.allUserSettings = allUserSettings
            return { ...state }
        }
        case UserSettingsActionType.DeleteUserSettings:
            return { ...state }
        case UserSettingsActionType.ErrorUserSettings: {
            const { error } = action.payload
            state.error = error
            return { ...state }
        }
        default:
            return state
    }
}
