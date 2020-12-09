import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { Client } from 'pg'

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');

    const connectionString = process.env.PG_CONNECTION_STRING

    const client = new Client({
        connectionString
    })
    
    client.connect()
    // TODO: edit select statement (investigate existing tables)
    const { rows } = await client.query('SELECT * FROM flights LIMIT 10;')
    
    context.res = {
        status: 200, /* Defaults to 200 */
        body: rows
    };

};

export default httpTrigger;