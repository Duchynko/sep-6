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
      max: 3
    });
    const client = await pool.connect();

    const data = {
      airports: {},
      total: {},
    };

    data.airports = await getDataPerAirport(client);
    data.total = await getTotalData(client);

    client.release()

    context.res = {
      status: 200,
      body: data,
    };
  } catch (error) {
    console.error(
      "Unexpected error when fetching Destinations data. Error:",
      error
    );
    context.res = {
      status: 500,
      body: "Unexpected error when fetching Destinations data.",
    };
  }
};

async function getTotalData(client: PoolClient) {
  const args = airports.map((a) => "'" + a + "'").join(", ");
  const response = await client.query(
    `SELECT COUNT(*), dest FROM flights WHERE origin IN (${args}) GROUP BY dest ORDER BY COUNT(dest) DESC LIMIT 10;`
  );
  return response.rows;
}

async function getDataPerAirport(client: PoolClient) {
  const data = {};

  for (const airport of airports) {
    const response = await client.query(
      `SELECT COUNT(*), dest FROM flights WHERE origin='${airport}' GROUP BY dest ORDER BY COUNT(dest) DESC LIMIT 10;`
    );
    data[airport] = response.rows;
  }
  return data;
}

const airports = ["JFK", "LGA", "EWR"];

export default httpTrigger;
