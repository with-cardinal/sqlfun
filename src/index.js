const camelCase = require("lodash/camelCase");
const mapKeys = require("lodash/mapKeys");

const JSON_VERSION = 0;

// Read the function definitions from the database connected to by client in the
// given schema
async function read(client, schema) {
  const result = await client.query(
    `SELECT routines.routine_name as function, 
        routines.specific_name as "specificName",
        parameters.parameter_name as "parameterName",
        parameters.ordinal_position as "parameterOrdinal"
      FROM information_schema.routines
      LEFT JOIN information_schema.parameters 
        ON parameters.specific_name = routines.specific_name
      WHERE routines.routine_schema = $1 
        AND parameters.parameter_mode != 'OUT'
      ORDER BY routines.specific_name,
        routines.routine_name, 
        parameters.ordinal_position ASC;`,
    [schema]
  );

  return { version: JSON_VERSION, functions: result.rows };
}

// Load the function spec
function load(client, functionSpec) {
  if (!functionSpec.functions) {
    return {};
  }

  return functionSpec.functions.reduce((acc, cur) => {
    if (acc[camelCase(cur.function)]) {
      return acc;
    }
    return {
      ...acc,
      [camelCase(cur.function)]: sqlFn(client, cur.function)
    };
  }, {});
}

function sqlFn(client, name) {
  return async (...args) => {
    const argHolders = args.map((_, i) => `$${i + 1}`).join(",");
    const query = `SELECT * FROM "${name}"(${argHolders})`;
    const rows = (await client.query(query, args)).rows;
    return rows.map(row => mapKeys(row, (v, k) => camelCase(k)));
  };
}

module.exports = { read, load };
