import { promisify } from 'util'
import * as path from 'path'
import * as fs from 'fs'
import { Stats } from 'fs'

/**
 * FileUtil class
 */
export class FileUtil {
    /**
     * Async remove file
     * @param filePath
     */
    public static async removeFile(filePath: string): Promise<void> {
        try {
            const unlink = promisify(fs.unlink)
            return await unlink(filePath)
        } catch (error) {
            throw error
        }
    }

    /**
     * Get file info
     * @param filePath
     */
    public static async fileInfo(filePath: string): Promise<Stats> {
        const fileStat = promisify(fs.stat)
        return await fileStat(filePath)
    }

    /**
     * Is file exists
     * @param filePath
     */
    public static async fileExists(filePath: string): Promise<boolean> {
        try {
            await FileUtil.fileInfo(filePath)
            return true
        } catch (e) {
            return false
        }
    }

    /**
     * Get full file name from the path
     * @param filePath
     * @param uri
     */
    public static getFullFileName(filePath: string, uri: boolean = false): string {
        try {
            if (!uri) {
                return path.basename(filePath)
            } else {
                return filePath.split('\\').reverse()[0]
            }
        } catch (e) {
            return filePath
        }
    }

    /**
     * Get file name
     * @param filePath
     */
    public static getFileName(filePath: string): string {
        return path.basename(filePath, path.extname(filePath))
    }

    /**
     * Get file extention
     * @param filePath
     */
    public static getFileExt(filePath: string): string {
        return path.extname(filePath)
    }

    /**
     * Read file to string
     * @param filePath
     */
    public static async readFile(filePath: string): Promise<string> {
        const readFile = promisify(fs.readFile)
        return await readFile(filePath, {
            encoding: 'utf-8'
        })
    }

    /**
     * Is dir exists
     * @param dirPath
     */
    public static async dirExists(dirPath: string): Promise<boolean> {
        const exists = promisify(fs.exists)
        return await exists(dirPath)
    }
}
