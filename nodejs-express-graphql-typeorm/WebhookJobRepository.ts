import {EntityRepository, getCustomRepository, Repository} from 'typeorm'
import {WebhookJob} from '../entities/WebhookJob'
import {IWebhookJob, IWebhookJobFilter, IWebhookJobResult} from '../interfaces/webhook/IWebhookJob'
import {IContext} from '../interfaces/IContext'
import {Localization} from '../resources/Localization'

@EntityRepository(WebhookJob)
class WebhookJobRepository extends Repository<WebhookJob> {
    /**
     * Get all webhookJob
     * @param filter
     * @param ctx
     */
    public async getAllWebhookJob(filter: IWebhookJobFilter, ctx: IContext): Promise<IWebhookJobResult> {
        const { page = 1, perPage = 10 } = filter
        const result = await this.findAndCount({
            take: perPage,
            skip: page > 0 ? (page - 1) * perPage : 1
        })

        return {
            result: result[0],
            count: result[1]
        }
    }

    /**
     * Get webhookJobType by Id
     * @param id
     * @param ctx
     */
    public async getWebhookJobById(id: number, ctx: IContext): Promise<IWebhookJob | undefined> {
        return await this.findOne({ id })
    }

    /**
     * Get active WebhookJobs by webhookEndpointId and webhookJobTypeId
     * @param webhookEndpointId
     * @param webhookJobTypeId
     */
    public async getActiveWebhookJobs(webhookEndpointId: number, webhookJobTypeId: number): Promise<IWebhookJob[]> {
        return await this.find({
            where: {
                isActive: true,
                isDeleted: false,
                webhookEndpointId,
                webhookJobTypeId
            }
        })
    }

    /**
     * Create webhookJob
     * @param input
     * @param ctx
     */
    public async createWebhookJob(input: IWebhookJob, ctx: IContext): Promise<IWebhookJob | undefined> {
        const { userId } = ctx
        const result = await this.insert(
            {
                ...input,
                createdBy: userId,
                updatedBy: userId,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        )
        if (result.identifiers.length === 0) {
            throw new Error(Localization.Webhook.JOB_NOT_CREATED)
        } else {
            const { id } = result.identifiers[0]
            return await this.findOne({ id })
        }
    }

    /**
     * Update webhookJob
     * @param input
     * @param ctx
     */
    public async updateWebhookJob(input: IWebhookJob, ctx: IContext): Promise<IWebhookJob | undefined> {
        const { id } = input
        const { userId } = ctx
        delete input.id
        const result = await this.update(
            { id },
            {
                ...input,
                updatedBy: userId,
                updatedAt: new Date()
            })
        if (result.affected === 0) {
            throw new Error(Localization.Webhook.JOB_NOT_UPDATED)
        } else {
            return await this.findOne({ id })
        }
    }
}

const repository = {
    get WebhookJobRepository(){
        return getCustomRepository(WebhookJobRepository)
    }
}

export = repository
