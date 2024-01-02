const Ajv = require("ajv");
const ajv = new Ajv({ allErrors: true });
require("ajv-formats")(ajv);

exports.validateObject = (object, schema) => {
  const validate = ajv.compile(schema);
  const valid = validate(object);
  return [valid, validate];
};
