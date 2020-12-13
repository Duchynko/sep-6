import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Pool, PoolClient } from "pg";

const httpTrigger: AzureFunction = async function (
  context: Context,
  _: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");

  try {
    const pool = new Pool({
      connectionString: process.env.PG_CONNECTION_STRING,
    });
    const client = await pool.connect();

    const data = {
      total: {},
      airports: {},
    };

    data.total = await getWeather(client);

    context.res = {
      status: 200,
      body: data
    };
  } catch (error) {
    console.error("Unexpected error on idle client. Error:", error);
    context.res = {
      status: 500,
      body: "Unexpected error when connecting to the database.",
    };
  }
};

async function getWeather(client: PoolClient) {
  let data;
  data = await client.query(
    `SELECT * FROM weather;`
  )

  return data;
}

export default httpTrigger;
