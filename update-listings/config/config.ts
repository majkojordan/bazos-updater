import * as Joi from 'joi';
import * as dotenv from 'dotenv';

import { createSchemaObject } from './utils';

dotenv.config();

const schema = Joi.object({
  ...createSchemaObject(['NAME', 'EMAIL', 'PHONE_NUMBER', 'PASSWORD'], Joi.string()),
  ZIP_CODE: Joi.string().length(5),
})
  .unknown()
  .options({ presence: 'required' });

const { error, value } = schema.validate(process.env);
if (error) {
  throw new Error(error.message);
}

const config = {
  name: value.NAME,
  email: value.EMAIL,
  phoneNumber: value.PHONE_NUMBER,
  zipCode: value.ZIP_CODE,
  password: value.PASSWORD,
};

export default config;
