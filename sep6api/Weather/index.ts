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
      observations: {},
      temperature: {},
    };

    data.observations = await GetNumberOfObservations(client);
    data.temperature = await GetTemperature(client);

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

const origins = ["JFK", "LGA", "EWR"];

async function GetNumberOfObservations(client: PoolClient) {
  const data = {};
  for (const origin of origins) {
    data[origin] = (await client.query(
      `SELECT  * FROM weather where weather.origin ='${origin}';`
    )).rowCount
  }
  return data;
}

async function GetTemperature(client: PoolClient) {
  const data = {};
  for (const origin of origins) {
    data[origin] = (await client.query(
      `SELECT (temp − 32) × 5/9 as celcius_temp FROM weather where weather.origin ='${origin}';`
    )).rows
  }
  return data;
}

export default httpTrigger;
