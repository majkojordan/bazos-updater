import * as Joi from 'joi';
import * as dotenv from 'dotenv';

import { createSchemaObject } from '../helpers/config';

dotenv.config();

const schema = Joi.object({
  ...createSchemaObject(
    [
      'USER_INFO_NAME',
      'USER_INFO_EMAIL',
      'USER_INFO_PHONE_NUMBER',
      'USER_INFO_PASSWORD',
      'AZURE_FUNCTIONS_ENVIRONMENT',
      'BLOB_STORAGE_CONNECTION_STRING',
      'BLOB_STORAGE_CONTAINER_NAME',
      'DB_CONNECTION_STRING',
      'COOKIE_VALUE',
    ],
    Joi.string().required(),
  ),
  COOKIE_VALIDATION_URL: Joi.string().default('https://auto.bazos.sk/pridat-inzerat.php'),
  DB_NAME: Joi.string().default('bazos-updater-db'),
  BASE_DOWNLOAD_FOLDER: Joi.string().default('/tmp/downloads'),
  USER_INFO_ZIP_CODE: Joi.string().length(5).required(),
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
    name: value.DB_NAME,
  },
  userInfo: {
    name: value.USER_INFO_NAME,
    email: value.USER_INFO_EMAIL,
    phoneNumber: value.USER_INFO_PHONE_NUMBER,
    zipCode: value.USER_INFO_ZIP_CODE,
    password: value.USER_INFO_PASSWORD,
  },
  cookie: {
    value: value.COOKIE_VALUE,
    validationUrl: value.COOKIE_VALIDATION_URL,
  },
  baseDownloadFolder: value.BASE_DOWNLOAD_FOLDER,
  env: value.AZURE_FUNCTIONS_ENVIRONMENT,
};

export default config;
