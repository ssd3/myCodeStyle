import { LinkType } from '../../enums/LinkType'
import { DocumentIndex } from '../../entity/DocumentIndex'
import { DocumentList } from '../../entity/DocumentList'

/**
 * IFile interface
 */
export interface IFile {
    path?: string
    body?: string
    name?: string
    qty?: number
}

/**
 * IDocuments interface
 */
export interface IDocuments {
    documents: DocumentList[]
    name: string
    qty: number
}

/**
 * IQueueData interface
 */
export interface IQueueData {
    type: LinkType
    payload: DocumentIndex | DocumentList | IFile | IDocuments
    next?: string | number
    isNew? : boolean
    typeGenerate?: number
}
