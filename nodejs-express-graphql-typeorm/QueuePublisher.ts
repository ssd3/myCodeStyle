import { ConfirmChannel, connect, Connection } from 'amqplib'
import { Localization } from '../../resources/Localization'
import { IQueueData } from '../../interfaces/queue/IQueueData'

/**
 * Queue publisher class
 */
export class QueuePublisher {
    private connection?: Connection
    private confirmChannel?: ConfirmChannel

    /**
     * Connect to message service
     * @private
     */
    public async connect() {
        this.connection = await connect(String(process.env.AMQP_URL))
        this.confirmChannel = await this.connection.createConfirmChannel()
        await this.confirmChannel.assertExchange(String(process.env.AMQP_EXCHANGE), 'x-delayed-message', {autoDelete: false, durable: true, arguments: {'x-delayed-type': 'direct'}})
        await this.confirmChannel.bindQueue(String(process.env.AMQP_QUEUE), String(process.env.AMQP_EXCHANGE), String(process.env.AMQP_QUEUE))
    }

    /**
     * Disconnect message service
     */
    public async disconnect() {
        if (this.confirmChannel !== undefined) {
            await this.confirmChannel.close()
        }

        if (this.connection !== undefined) {
            await this.connection?.close()
        }
    }

    /**
     * Get channel connection
     */
    public getChannelConnection(): Connection {
        return this.connection as Connection
    }

    /**
     * Get confirm channel
     */
    public getConfirmChannel(): ConfirmChannel {
        return this.confirmChannel as ConfirmChannel
    }

    /**
     * Send data to queue
     * @param data
     * @param timeout
     */
    public async sendToQueue(data: IQueueData, timeout: number = 0): Promise<void> {
        try {
            const queueOptions = {
                contentType: 'application/json',
                headers: { 'x-delay': timeout }
            }

            if (timeout === 0) {
                delete queueOptions.headers
            }

            const channel = this.getConfirmChannel()
            channel.publish(String(process.env.AMQP_EXCHANGE), String(process.env.AMQP_QUEUE), Buffer.from(JSON.stringify(data)), queueOptions)
        } catch (e) {
            console.error(`${Localization.AMQP.CANT_CONNECT}: ${e.message}`)
        }
    }
}
