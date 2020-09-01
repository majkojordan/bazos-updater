import { ContainerClient } from '@azure/storage-blob';
import * as path from 'path';

import { createFolderIfNotExists } from './local';
import config from '../config/config';

let containerClient = null;
const {
  blobStorage: { connectionString, containerName },
  downloadFolder,
} = config;

export const getContainerClient = async (): Promise<ContainerClient> => {
  if (!containerClient) {
    containerClient = new ContainerClient(connectionString, containerName);
  }

  return containerClient;
};

export const downloadFile = async (filename: string) => {
  const downloadPath = path.join(downloadFolder, filename);

  await createFolderIfNotExists(downloadFolder);
  const blockBlobClient = (await getContainerClient()).getBlockBlobClient(filename);
  await blockBlobClient.downloadToFile(downloadPath);

  return downloadPath;
};

export const downloadFiles = async (filenames: string[]) => Promise.all(filenames.map((name) => downloadFile(name)));
