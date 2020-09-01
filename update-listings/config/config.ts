import * as Joi from 'joi';
import * as dotenv from 'dotenv';

import { createSchemaObject } from '../helpers/config';

dotenv.config();

const schema = Joi.object({
  ...createSchemaObject(
    [
      'NAME',
      'EMAIL',
      'PHONE_NUMBER',
      'PASSWORD',
      'AZURE_FUNCTIONS_ENVIRONMENT',
      'BLOB_STORAGE_CONNECTION_STRING',
      'BLOB_STORAGE_CONTAINER_NAME',
      'DB_CONNECTION_STRING',
      'COOKIE_VALUE',
    ],
    Joi.string().required(),
  ),
  COOKIE_VALIDATION_URL: Joi.string().default('https://auto.bazos.sk/pridat-inzerat.php'),
  DB_ID: Joi.string().default('bazos-updater-db'),
  BASE_DOWNLOAD_FOLDER: Joi.string().default('downloads'),
  ZIP_CODE: Joi.string().length(5).required(),
}).unknown();

const { error, value } = schema.validate(process.env);
if (error) {
  throw new Error(error.message);
}

const config = {
  blobStorage: {
    connectionString: value.BLOB_STORAGE_CONNECTION_STRING,
    containerName: value.BLOB_STORAGE_CONTAINER_NAME,
  },
  db: {
    connectionString: value.DB_CONNECTION_STRING,
    id: value.DB_ID,
  },
  userInfo: {
    name: value.NAME,
    email: value.EMAIL,
    phoneNumber: value.PHONE_NUMBER,
    zipCode: value.ZIP_CODE,
    password: value.PASSWORD,
  },
  cookie: {
    value: value.COOKIE_VALUE,
    validationUrl: value.COOKIE_VALIDATION_URL,
  },
  baseDownloadFolder: value.BASE_DOWNLOAD_FOLDER,
  env: value.AZURE_FUNCTIONS_ENVIRONMENT,
};

export default config;
