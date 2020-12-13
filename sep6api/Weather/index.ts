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

    data.total = await getNumberofObsavations(client);

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

async function getNumberofObsavations(client: PoolClient) {
  const originCount = {};
  for (const origin of origins) {
    let temp = {}
    temp[origin] = await client.query(
      `SELECT * FROM weather where weather.origin ='${origin}';`
    )

    originCount[origin] = temp;
  }

  let data = {}
  data["originCount"] = originCount;
  return data;
}

export default httpTrigger;
