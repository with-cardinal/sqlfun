const { read, load } = require(".");
const { Client } = require("pg");

let client;
let fnSpec;
let fns;
beforeEach(async () => {
  client = new Client({ connectionString: process.env.DATABASE_URL });
  client.connect();
  fnSpec = await read(client, "public");
  fns = load(client, fnSpec);
});

afterEach(() => {
  client.end();
});

describe("read", () => {
  test("reads the schema", async () => {
    expect(fnSpec.version).toEqual(0);
    expect(fnSpec.functions.length).toEqual(4);
  });

  test("loads the functions", async () => {
    expect(Object.keys(fns).length).toEqual(3);
  });

  test("creates a callable function", async () => {
    const result = await fns.findShowByName("Bewitched");
    expect(result.length).toEqual(1);
    expect(result[0].id).toEqual(3);
  });
});
