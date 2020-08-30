import * as Joi from 'joi';

// creates schema objects for multiple keys that use the same schema
export const createSchemaObjects = (keys: string[], schema: Joi.Schema) => {
  const schemaObj = {};
  keys.forEach(key => schemaObj[key] = schema);

  return schemaObj;
}
