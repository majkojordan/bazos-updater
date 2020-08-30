import * as Joi from 'joi';

interface SchemaObject {
  [key: string]: Joi.Schema;
}

// creates schema objects for multiple keys that use the same schema
export const createSchemaObject = (keys: string[], schema: Joi.Schema): SchemaObject => {
  const schemaObj = {};
  keys.forEach((key) => {
    schemaObj[key] = schema;
  });

  return schemaObj;
};
