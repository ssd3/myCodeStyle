/**
 * Prepare consumer function
 * @param channel
 */
async function prepareConsumer(channel: Channel) {
    await channel.assertQueue(String(process.env.AMQP_QUEUE), {durable: true})
    await channel.prefetch(10)
}

/**
 * Start consumer function
 */
export async function startConsumer(): Promise<void> {
    const connection = new Connection({connectionString: String(process.env.AMQP_URL)}, console)
    await connection.connect()
    const consumer = new QueueConsumer(connection, prepareConsumer)
    await consumer.consume(String(process.env.AMQP_QUEUE), {noAck: false})

    const publisher = new QueuePublisher()
    await publisher.connect()
    consumer.setQueuePublisher(publisher)
}

/**
 * Queue consumer class
 */
export class QueueConsumer extends Consumer {
    private readonly connection?: Connection
    private queuePublisher?: QueuePublisher
    private downloader?: DocumentDownloader
    private fileMap?: Map<string, ICsvFileData>

    /**
     * ctor
     * @param conn
     * @param prepareFn
     */
    constructor(conn: Connection, prepareFn: any) {
        super(conn, prepareFn, false, console)
        this.initializeListeners()
        this.connection = conn
        this.downloader = new DocumentDownloader()
        this.fileMap = new Map<string, ICsvFileData>()
    }

    /**
     * Init listeners
     */
    private initializeListeners() {
        process.off('SIGINT', this.disposeHandler)
        process.once('SIGINT', this.disposeHandler)
    }

    /**
     * Close connection
     */
    private async disposeHandler(): Promise<void> {
        if (this.connection !== undefined) {
            await this.connection.close()
        }
    }

    /**
     * Set queuePublisher
     * @param publisher
     */
    public setQueuePublisher(publisher: QueuePublisher) {
        this.queuePublisher = publisher
    }

    /**
     * Process message
     * @param msg
     * @param channel
     */
    public processMessage(msg: Message, channel: Channel): void {
        (async () => {
            try {
                const data = JSON.parse(msg.content.toString()) as unknown as IQueueData

                switch (data.type) {
                    case LinkType.DOCUMENT_INDEX: {
                        const {id, url, year, isNew} = data.payload as DocumentIndex
                        await getCustomRepository(DocumentIndexRepository).updateStatus(Number(id), false)
                        const file = await this.downloader?.download(url, DownloadType.HTTP)
                        channel.ack(msg)
                        if (file === undefined) {
                            await Logger.log(Localization.Download.CANT_DOWNLOAD, {document: data.payload}, 'error')
                        } else {
                            await getCustomRepository(DocumentIndexRepository).updateStatus(Number(id), true)
                            await JsonProcessor.DocumentIndexProcessing(file, `Filings${year}`, isNew)
                        }
                        break
                    }
                    case LinkType.DOCUMENT_SQL:
                    case LinkType.DOCUMENT_LIST_SQL: {
                        const {path} = data.payload as IFile
                        channel.ack(msg)
                        await getCustomRepository(DocumentListRepository).executeSql(String(path))
                        break
                    }
                    case LinkType.DOCUMENT_LIST_SQL_SELECT: {
                        const { path } = data.payload as IFile
                        const isNew  = data.isNew as boolean
                        channel.ack(msg)

                        const res = await FileUtil.readFile(String(path).split(' ')[0])
                        await FileUtil.removeFile(String(path).split(' ')[0])

                        const result = await getConnection().query(res)
                        await getCustomRepository(DocumentListRepository).insertOrUpdate(result, String(path), isNew)

                        break
                    }
                    case LinkType.DOCUMENT_LIST_SQL_UPDATE: {
                        const {path} = data.payload as IFile
                        channel.ack(msg)
                        const res = await FileUtil.readFile(String(path))
                        await FileUtil.removeFile(String(path))

                        await getConnection().query(res)

                        break
                    }
                }
            } catch (e) {
                console.log(`Error on consumer: ${e.message}`)
                channel.ack(msg)
            }
        })()
    }

    /**
     * Get tick value from publish process object
     * @param name
     */
    public getTickFromPublishProcess(name: string): number {
        if (this.fileMap?.has(name)) {
            const fileData = this.fileMap?.get(name)
            const {tick} = fileData as ICsvFileData
            return tick
        } else {
            return -1
        }
    }

    /**
     * Publish initial progress
     * @param name
     */
    public static async startPublishProcess(name: string): Promise<void> {
        await publishCsvFileProgress({
            name,
            tick: 0,
            total: 1
        })
    }
}
