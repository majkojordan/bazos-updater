import { ContainerClient } from '@azure/storage-blob';
import * as path from 'path';

import { createFolderIfNotExists } from './local';
import config from '../config/config';

const {
  blobStorage: { connectionString, containerName },
  downloadFolder,
} = config;

const containerClient = new ContainerClient(connectionString, containerName);

export const downloadFile = async (filename: string) => {
  const downloadPath = path.join(downloadFolder, filename);

  await createFolderIfNotExists(downloadFolder);
  const blockBlobClient = containerClient.getBlockBlobClient(filename);
  await blockBlobClient.downloadToFile(downloadPath);

  return downloadPath;
};

export const downloadFiles = async (filenames: string[] = []) =>
  Promise.all(filenames.map((name) => downloadFile(name)));
