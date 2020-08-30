import * as Joi from 'joi';
import * as dotenv from 'dotenv';

import { createSchemaObject } from './utils';

dotenv.config();

const schema = Joi.object({
  ...createSchemaObject(['NAME', 'EMAIL', 'PHONE_NUMBER', 'PASSWORD'], Joi.string().required()),
  ZIP_CODE: Joi.string().length(5).required(),
  COOKIE_VALIDATION_URL: Joi.string().default('https://auto.bazos.sk/pridat-inzerat.php'),
}).unknown();

const { error, value } = schema.validate(process.env);
if (error) {
  throw new Error(error.message);
}

const config = {
  contactInfo: {
    name: value.NAME,
    email: value.EMAIL,
    phoneNumber: value.PHONE_NUMBER,
    zipCode: value.ZIP_CODE,
    password: value.PASSWORD,
  },
  cookieValidationUrl: value.COOKIE_VALIDATION_URL,
};

export default config;
