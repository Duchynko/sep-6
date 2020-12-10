import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Pool, PoolClient } from "pg";

const httpTrigger: AzureFunction = async function (
  context: Context,
  _: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");

  const pool = new Pool({
    connectionString: process.env.PG_CONNECTION_STRING,
  });

  await pool
    .connect()
    .then(async (client) => {
      const data = {
        months: {},
        airports: {},
      };

      data.months = await getDataPerMonth(client);
      data.airports = await getDataPerAirport(client);

      context.res = {
        status: 200,
        body: {
          data,
        },
      };
    })
    .catch((err) => {
      console.error("Unexpected error on idle client", err);
      context.res = {
        status: 500,
        body: "Unexpected error when connecting to the database.",
      };
    });
};

async function getDataPerMonth(client: PoolClient) {
  const data = {};

  for (const month in months) {
    data[month] = (
      await client.query(
        `SELECT COUNT(*) FROM flights WHERE flights.month = '${months[month]}';`
      )
    ).rows[0].count;
  }

  return data;
}

async function getDataPerAirport(client: PoolClient) {
  const data = {};
  for (const airport of airports) {
    for (const month in months) {
      if (!data[airport]) {
        data[airport] = {};
      }
      data[airport][month] = (
        await client.query(
          `SELECT COUNT(*) FROM flights WHERE flights.month = '${months[month]}' AND flights.origin = '${airport}';`
        )
      ).rows[0].count;
    }
  }
  return data;
}

const airports = ["JFK", "LGA", "EWR"];

const months = {
  january: "1",
  february: "2",
  march: "3",
  april: "4",
  may: "5",
  june: "6",
  july: "7",
  august: "8",
  september: "9",
  october: "10",
  november: "11",
  december: "12",
};

export default httpTrigger;
