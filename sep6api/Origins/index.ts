import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { Pool, PoolClient } from "pg";

const httpTrigger: AzureFunction =
    async function (context: Context, req: HttpRequest): Promise<void> {
        context.log('HTTP trigger function processed a request.');

        const data = {
            originMeanAirTime: {},
            originMeanDepartureAndArrivalDelay: {},
        };

        try {
            const pool = new Pool({
                connectionString: process.env.PG_CONNECTION_STRING,
            });
            const client = await pool.connect();



            data.originMeanAirTime = await getOriginMeanAirTime(client);
            data.originMeanDepartureAndArrivalDelay = await getOriginMeanDepartureAndArrivalDelay(client);

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

async function getOriginMeanAirTime(client: PoolClient) {
    const data = await client.query(
        `SELECT  
            origin,
            AVG(CAST (air_time AS INTEGER)) AS "MEAN AIR TIME" 
        FROM public.flights
        WHERE 
            air_time != 'NA'
        GROUP BY origin`
    );
    return data.rows;
}

async function getOriginMeanDepartureAndArrivalDelay(client: PoolClient) {
    const data = await client.query(
        `SELECT  
            origin,
            AVG(CAST (dep_delay AS INTEGER)) AS "MEAN DEP DELAY",
            AVG(CAST (arr_delay AS INTEGER)) AS "MEAN ARR DELAY"
        FROM public.flights
        WHERE 
            dep_delay != 'NA' AND arr_delay != 'NA'
        GROUP BY origin`
    );
    return data.rows;
}

export default httpTrigger;