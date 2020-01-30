#!/usr/bin/env node
require("dotenv").config();

const yargs = require("yargs");
const { Client } = require("pg");
const chalk = require("chalk");
const fs = require("fs");
const { read } = require("../src/index");

const options = yargs
  .scriptName("sqlfun")
  .usage("$0 [schema]")
  .string("d")
  .alias("d", "databaseUrl")
  .describe("d", "Specify the database url")
  .string("o")
  .alias("o", "outFile")
  .describe("o", "Write output to outFile rather than STDOUT")
  .help().argv;

const schema = options._[0] || "public";
const databaseUrl = options.databaseUrl || process.env.DATABASE_URL;

const client = new Client({ connectionString: databaseUrl });
client.connect(err => {
  if (err) {
    console.error(chalk.red("Error"), err.message);
    process.exit(1);
  }
});

(async function() {
  try {
    const data = await read(client, schema);

    if (options.outFile) {
      fs.writeFileSync(options.outFile, JSON.stringify(data));
    } else {
      console.log(JSON.stringify(data, null, 2));
    }
  } catch (err) {
    console.error(chalk.red("Error"), err.message);
  }

  client.end();
})();
