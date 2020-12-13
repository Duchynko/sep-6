import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { Pool, PoolClient } from "pg";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');

    const data = {
        manufaturers200PlusPlanes: {},
        airbusModelPlanes: {},
        flightsManufacturers200PlusPlanes: {}
    };

    try {
        const pool = new Pool({
            connectionString: process.env.PG_CONNECTION_STRING,
        });
        const client = await pool.connect();

        data.manufaturers200PlusPlanes = await getManufaturers200PlusPlanes(client);
        data.airbusModelPlanes = await getAirbusModelPlanes(client);
        data.flightsManufacturers200PlusPlanes = await getFlightsManufacturers200PlusPlanes(client);

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

async function getManufaturers200PlusPlanes(client: PoolClient) {
    const data = await client.query(
        `SELECT manufacturer
        FROM (
            SELECT
                manufacturer,
                COUNT(tailnum) AS number_of_planes
            FROM public.planes
            GROUP BY manufacturer
            ) AS manufacturerPlaneQty
        WHERE manufacturerPlaneQty.number_of_planes > 200`
    );
    return data.rows;
}

async function getAirbusModelPlanes(client: PoolClient) {
    const data = await client.query(
        `SELECT  model,
            COUNT(tailnum) AS number_of_planes,
            manufacturer
        FROM public.planes
        WHERE manufacturer SIMILAR TO '%AIRBUS%'
        GROUP BY model, manufacturer`
    );
    return data.rows;
}

async function getFlightsManufacturers200PlusPlanes(client: PoolClient) {
    const data = await client.query(
        `-- total flights of manufactures with 200+ planes
        SELECT 
            manufacturer,
            SUM(flights) AS flights
        FROM
        
            -- total flights of each tailnum from manufacturers with 200+ planes
            (SELECT
                public.flights.tailnum,
                COUNT(id) AS flights
            FROM public.flights 
            INNER JOIN
                -- all tail numbers of manufacturers with 200+ planes
                (SELECT tailnum
                FROM public.planes
                INNER JOIN
        
                    -- manufacturers with 200+ planes
                    (SELECT manufacturer
                    FROM(
        
                        -- manufacturers plane count
                        SELECT
                            manufacturer,
                            COUNT(tailnum) AS number_of_planes
                        FROM public.planes
                        GROUP BY manufacturer
        
                    ) AS manufacturerPlanes
                    WHERE manufacturerPlanes.number_of_planes > 200) AS top_manufac
        
                ON public.planes.manufacturer = top_manufac.manufacturer) as tailnumbers_top_manufac
        
            ON public.flights.tailnum = tailnumbers_top_manufac.tailnum
            WHERE (public.flights.tailnum != 'NULL')
            GROUP BY public.flights.tailnum) AS tailnum_NrFlights
        
        INNER JOIN public.planes ON tailnum_NrFlights.tailnum = planes.tailnum
        GROUP BY public.planes.manufacturer`
    );
    return data.rows;
}

export default httpTrigger;