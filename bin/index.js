#!/usr/bin/env node
require("dotenv").config();

const yargs = require("yargs");
const { Client } = require("pg");
const chalk = require("chalk");

const options = yargs
  .scriptName("sqlfun")
  .usage("$0 [schema]")
  .string("d")
  .alias("d", "databaseUrl")
  .describe("d", "Specify the database url")
  .help().argv;

const schema = options._[0] || "public";
const databaseUrl = options.databaseUrl || process.env.DATABASE_URL;

const client = new Client({ connectionString: process.env.DATABASE_URL });
client.connect(err => {
  if (err) {
    console.error(chalk.red("Error"), err.message);
    process.exit(1);
  }
});

(async function() {
  try {
    const result = await client.query(
      `SELECT routine_name 
      FROM information_schema.routines 
      WHERE routine_schema = $1
      ORDER BY routine_name ASC;`,
      [schema]
    );
    console.log(JSON.stringify(result.rows));
  } catch (err) {
    console.error(chalk.red("Error"), err.message);
  }

  client.end();
})();
