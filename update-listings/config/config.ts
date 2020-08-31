import * as Joi from 'joi';
import * as dotenv from 'dotenv';

import { createSchemaObject } from '../helpers/config';

dotenv.config();

const schema = Joi.object({
  ...createSchemaObject(['NAME', 'EMAIL', 'PHONE_NUMBER', 'PASSWORD'], Joi.string().required()),
  AZURE_FUNCTIONS_ENVIRONMENT: Joi.string().required(),
  COOKIE_VALIDATION_URL: Joi.string().default('https://auto.bazos.sk/pridat-inzerat.php'),
  ZIP_CODE: Joi.string().length(5).required(),
}).unknown();

const { error, value } = schema.validate(process.env);
if (error) {
  throw new Error(error.message);
}

const config = {
  userInfo: {
    name: value.NAME,
    email: value.EMAIL,
    phoneNumber: value.PHONE_NUMBER,
    zipCode: value.ZIP_CODE,
    password: value.PASSWORD,
  },
  env: value.AZURE_FUNCTIONS_ENVIRONMENT,
  cookieValidationUrl: value.COOKIE_VALIDATION_URL,
};

export default config;
