import { Module } from '../../entities/Module'
import { Payment } from '../../entities/Payment'
import { WebhookType } from '../../enums/WebhookType'

/**
 * IWebhookEventEmitterData interface
 */
export interface IWebhookEventEmitterData {
    eventType: string
    webhookData: Module | Payment
    webhookServiceData: IWebhookServiceData
    organizationId: number
}

/**
 * IWebhookServiceData interface
 */
export interface IWebhookServiceData {
    endpointUrl: string
    timeout: number
    attempts: number
    created: boolean
    updated: boolean
    deleted: boolean
    webhookTypeId: WebhookType
    accessToken?: string
    refreshToken?: string
    webhookJobId?: number
}

/**
 * IWebhookItem interface
 */
export interface IWebhookItem {
    timestamp: number
    timeout: number
    attempts: number
}
