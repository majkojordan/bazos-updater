import { ContainerClient } from '@azure/storage-blob';
import { join as joinPath, dirname } from 'path';

import { ensureDir } from 'fs-extra';
import config from '../config/config';

interface DownloadOptions {
  remoteFolder?: string;
}

const { connectionString, containerName } = config.blobStorage;

const containerClient = new ContainerClient(connectionString, containerName);

export const downloadFile = async (
  filename: string,
  downloadFolder: string = '',
  { remoteFolder = '' }: DownloadOptions,
) => {
  const remotePath = joinPath(remoteFolder, filename);
  const localPath = joinPath(downloadFolder, remotePath);

  global.log.verbose(`Downloading: ${remotePath}`);

  await ensureDir(dirname(localPath));
  const blockBlobClient = containerClient.getBlockBlobClient(remotePath);
  await blockBlobClient.downloadToFile(localPath);

  return localPath;
};

export const downloadFiles = async (filenames: string[] = [], downloadFolder: string = '', options: DownloadOptions) =>
  Promise.all(filenames.map((name) => downloadFile(name, downloadFolder, options)));
