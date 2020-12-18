import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Pool, PoolClient } from "pg";

const airports = ["JFK", "LGA", "EWR"];
// prettier-ignore
const months = {
  january: "1", february: "2", march: "3", april: "4", may: "5", june: "6", july: "7", 
  august: "8", september: "9", october: "10", november: "11", december: "12",
};

const httpTrigger: AzureFunction = async function (
  context: Context,
  _: HttpRequest
): Promise<void> {
  context.log("HTTP trigger function processed a request.");

  try {
    const pool = new Pool({
      connectionString: process.env.PG_CONNECTION_STRING,
      max: 1,
    });
    
    const data = {
      total: {},
      airports: {},
    };

    data.total = await getTotalFlights(pool);
    data.airports = await getFlightsPerAirport(pool);

    pool.end()

    context.res = {
      status: 200,
      body: data,
    };
  } catch (error) {
    console.error(
      "Unexpected error when fetching data from the database. Error:",
      error
    );
    context.res = {
      status: 500,
      body: "Unexpected error when fetching data from the database.",
    };
  }
};

async function getTotalFlights(pool: Pool) {
  const data = {};

  for (const month in months) {
    data[month] = (
      await pool.query(`
        SELECT COUNT(*) FROM flights 
        WHERE flights.month = '${months[month]}';
      `)
    ).rows[0].count;
  }

  return data;
}

async function getFlightsPerAirport(pool: Pool) {
  const data = {};
  for (const airport of airports) {
    for (const month in months) {
      if (!data[airport]) {
        data[airport] = {};
      }
      data[airport][month] = (
        await pool.query(`
          SELECT COUNT(*) FROM flights 
          WHERE flights.month = '${months[month]}' 
            AND flights.origin = '${airport}';
        `)
      ).rows[0].count;
    }
  }
  return data;
}

export default httpTrigger;
