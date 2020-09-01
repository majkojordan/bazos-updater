import { promises as fs } from 'fs';

export const createFolderIfNotExists = async (path: string) => fs.mkdir(path, { recursive: true });

export const deleteFile = (path: string) => fs.unlink(path);

export const deleteFiles = (paths: string[]) => Promise.all(paths.map((path) => deleteFile(path)));
