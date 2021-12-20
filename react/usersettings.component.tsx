import React, {ChangeEvent, useEffect, useState} from 'react'
import {Button, Container, Link, Typography} from '@material-ui/core'
import {Localization} from '../../resources/localization'
import {UserSettingsOptions} from './usersettings.options.component'
import {useDispatch, useSelector} from 'react-redux'
import {UserSettingsType} from '../../enums/userSettingsType'
import {useHistory} from 'react-router-dom'
import {ApplicationActions} from '../../store/application/actions'
import {BottomBarButton} from '../../enums/bottomBarButton'
import {SiteActions} from '../../store/site/actions'
import {CommonModalDialog} from '../common/modal.component'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import {TimeFormat} from '../../enums/timeFormat'
import {reselectData} from '../../reselect'

/**
 * UserSettings component
 */
export const UserSettings: React.FC = () => {
    const history = useHistory()
    const dispatch = useDispatch()
    const applicationActions = new ApplicationActions(dispatch)
    const siteActions = new SiteActions(dispatch)

    const appData = useSelector(reselectData)
    const {
        application: {
            languages,
            onlineOfflineMode
        },
        siteData: {
            selectedSites
        }
    } = appData

    const [isOpenModal, setIsOpenModal] = useState<boolean>(false)
    const [isNextDisabled, setIsNextDisabled] = useState<boolean>(true)

    /**
     * Move to site sync
     */

    const moveToSiteSync = () => {
        (async() => {
            await clearSelectedSites()
            history.push('/')
        })()
    }

    /**
     * Change online or offline mode
     * @param value
     */
    const changeOnlineOfflineMode = (value: string) => async(_event: ChangeEvent<HTMLInputElement>) => {
        await applicationActions.setOnlineOfflineMode(value)
    }

    /**
     * Change language
     * @param language
     */
    const changeLanguage = (language: string) => async(_event: ChangeEvent<HTMLInputElement>) => {
        await applicationActions.setLanguage(language)
    }

    /**
     * Change time format
     * @param timeFormat
     */
    const changeTimeFormat = (timeFormat: TimeFormat) => async(_event: ChangeEvent<HTMLInputElement>) => {
        await applicationActions.setTimeFormat(timeFormat)
    }

    /**
     * onChangeSite handler
     * @param siteId
     */
    const onChangeSite = (siteId: string) => async(event: ChangeEvent<HTMLInputElement>) => {
        event.persist()
        await changeSite(siteId, event.target.checked)
    }

    /**
     * Change site
     * @param siteId
     * @param checked
     */
    const changeSite = async(siteId: string, checked: boolean) => {
        await applicationActions.setSelectedSites(siteId)
        await siteActions.getSite(siteId)
    }

    /**
     * Clear selected sites, site and operator names
     */
    const clearSelectedSites = async() => {
        await applicationActions.setAllSitesSelected([])
    }

    /**
     * Show logout dialog
     */
    const logout = () => {
        setIsOpenModal(true)
    }

    /**
     * Log Out
     */
    const handleOkModal = () => {
        (async() => {
            await applicationActions.logout()
        })()
        setIsOpenModal(false)
    }

    /**
     * Cancel click modal
     */
    const handleCloseModal = () => {
        setIsOpenModal(false)
    }

    useEffect(() => {
        setIsNextDisabled(false)
    }, [])

    return (
        <>
            <div className="user-settings-page">
                <div className="user-settings-body">
                    <div className="page-wrapper">
                        <Container>
                            <div className="modal-table user-settings-table app-paper user-settings-container">
                                <UserSettingsOptions
                                    onlineOfflineMode={onlineOfflineMode}
                                    languages={languages}
                                    selectedSites={selectedSites}
                                    changeOnlineOfflineMode={changeOnlineOfflineMode}
                                    changeLanguage={changeLanguage}
                                />
                            </div>
                            <div className="user-settings-btn-container">
                                <Button className="user-settings-sync-btn" variant="contained" onClick={moveToSiteSync}>
                                    {Localization.App.UserSettings.siteSync}
                                </Button>
                            </div>
                            <div className="after-list-button-wrapper">
                                <Button
                                    disabled={isNextDisabled}
                                    variant="contained"
                                    className="after-list-button user-settings-next-button"
                                    onClick={() => {
                                        history.push(getPath())
                                    }}
                                >
                                    Next
                                </Button>
                            </div>
                        </Container>
                    </div>
                </div>
                <div className="bottom-panel">
                    <div className="user-settings-section">
                        <Container className="user-settings-container">
                            <Typography className="user-settings-back" variant="inherit" component="span">
                                <Link
                                    component="button"
                                    variant="body2"
                                    onClick={logout}
                                >
                                    <ExitToAppIcon/>
                                </Link>
                            </Typography>
                            <Typography className="logout-label" variant="h1" component="h1" onClick={logout}>
                                {Localization.App.UserSettings.logout}
                            </Typography>
                        </Container>
                    </div>
                </div>
            </div>
            <CommonModalDialog
                title={Localization.App.Logout.logout}
                text={
                    <Typography
                        className="modal-question"
                        variant="h1"
                        component="h4">
                        <span className="bold sure">{Localization.App.Logout.logoutQuestion}</span>
                    </Typography>
                }
                isOpenModal={isOpenModal}
                handleOkModal={handleOkModal}
                handleCloseModal={handleCloseModal}
                isShowButtonPanel={true}
            />
        </>
    )
}
