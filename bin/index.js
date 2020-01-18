#!/usr/bin/env node
require("dotenv").config();

const yargs = require("yargs");
const { Client } = require("pg");
const chalk = require("chalk");

const JSON_VERSION = 0;

const options = yargs
  .scriptName("sqlfun")
  .usage("$0 [schema]")
  .string("d")
  .alias("d", "databaseUrl")
  .describe("d", "Specify the database url")
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

    console.log(
      JSON.stringify({ version: JSON_VERSION, functions: result.rows }, null, 2)
    );
  } catch (err) {
    console.error(chalk.red("Error"), err.message);
  }

  client.end();
})();
