import fs from 'fs/promises'

export async function removeFile(path: string) {
    await fs.rm(path, {
        recursive: true,
        force: true
    })
}