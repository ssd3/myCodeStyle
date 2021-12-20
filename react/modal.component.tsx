import React, {ReactNode} from 'react'
import {Backdrop, Button, Fade, IconButton, Modal, Typography} from '@material-ui/core'
import HighlightOffIcon from '@material-ui/icons/HighlightOff'
import {Localization} from '../../resources/localization'

/**
 * CommonModalProps interface
 */
interface CommonModalProps {
    title: string
    text: ReactNode
    isOpenModal: boolean
    handleOkModal?: any
    handleCloseModal: any
    isShowButtonPanel: boolean
    oneButtonPanel?: boolean
    oneBtnText?: string
    isShowCloseIcon?: boolean
}

/**
 * CommonModalDialog component
 * @param props
 * @constructor
 */
export const CommonModalDialog: React.FC<CommonModalProps> = (props: CommonModalProps) => {
    const {
        isShowCloseIcon = true,
        isOpenModal,
        handleCloseModal,
        handleOkModal,
        title,
        text,
        isShowButtonPanel,
        oneButtonPanel,
        oneBtnText
    } = props
    return (
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className="custom-modal"
            open={isOpenModal}
            onClose={handleCloseModal}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500
            }}>
            <Fade in={isOpenModal}>
                <div className="custom-modal-paper">
                    <div className="custom-modal-header">
                        <Typography className="modal-title" variant="h1" component="h4">
                            {title}
                        </Typography>
                        {
                            isShowCloseIcon ? (
                                <IconButton
                                    className="close-button"
                                    aria-label="expand row"
                                    size="small"
                                    onClick={handleCloseModal}>
                                    <HighlightOffIcon/>
                                </IconButton>
                            ) : null
                        }
                    </div>
                    <div className="custom-modal-body">
                        <div className="text">
                            {text}
                            {
                                isShowButtonPanel && !oneButtonPanel ? (
                                    <div className="panel-btns">
                                        <Button
                                            className="modal-btn no-btn"
                                            variant="contained"
                                            onClick={handleCloseModal}>
                                            {Localization.App.CommonModal.no}
                                        </Button>
                                        <Button
                                            className="modal-btn yes-btn"
                                            variant="contained"
                                            onClick={handleOkModal}>
                                            {Localization.App.CommonModal.yes}
                                        </Button>
                                    </div>
                                ) : isShowButtonPanel && oneButtonPanel ? (
                                    <div className="panel-btns">
                                        <Button
                                            className="modal-btn yes-btn"
                                            variant="contained"
                                            onClick={handleCloseModal}>
                                            {`${oneBtnText ? oneBtnText : 'Start'}`}
                                        </Button>
                                    </div>
                                ) : null}
                        </div>
                    </div>
                </div>
            </Fade>
        </Modal>
    )
}
