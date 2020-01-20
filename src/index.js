// Load the function spec
export function load(client, functionSpec) {
  if (!functionSpec.functions) {
    return {};
  }

  return functionSpec.functions.reduce((acc, cur) => {
    if (acc[cur.function]) {
      return acc;
    }
    return { ...acc, [cur.function]: sqlFn(client, cur.function) };
  }, {});
}

function sqlFn(client, name) {
  return async (...args) => {
    const argHolders = args.map((_, i) => `$${i + 1}`).join(",");
    const query = `SELECT * FROM "${name}"(${argHolders})`;
    return (await client.query(query, args)).rows;
  };
}
