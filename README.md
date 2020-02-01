# sqlfun

![NPM](https://img.shields.io/npm/v/sqlfun?style=for-the-badge)
![Build Status](https://img.shields.io/github/workflow/status/with-cardinal/sqlfun/CI?style=for-the-badge)

Import postgresql functions into your project

## Generating Function Defs

The easiest way to work with sqlfun is to generate a functions json file each
time you update your functions. The sqlfun command line interface relies on the
DATABASE_URL environment variable for connecting to PostgreSQL. It will load a
.env file if one is defined in the current directory. The format of DATABASE_URL
is determined by pg-connection-string.

Once you've got either a .env file or environment variable set:

```sh
sqlfun -o functions.json
```

Will run sqlfun and output a functions.json file.

If you need to specify a schema, include it in the command line:

```sh
sqlfun -o functions.json my-schema
```

## Loading Function Defs

sqlfun includes a small library for loading function definitions. The library
converts all function names to camelCase since that's a bit more idiomatic. So,
in a database with a function named `insert_blog_post`:

```javascript
const { Client } = require("pg");
const { load } = require("sqlfun");
const defs = require("./functions.json");

const client = new Client({ connectionString: process.env.DATABASE_URL });
client.connect();
const fns = load(client, defs);

const result = fns.insertBlogPost("A Title", "A short post body");
console.log(result);

client.end();
```

Functions always return an array of rows, or undefined if the function
has a void return type.

## License

MIT. See LICENSE for more information.
