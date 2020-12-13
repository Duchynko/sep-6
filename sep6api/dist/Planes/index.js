"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const httpTrigger = function (context, req) {
    return __awaiter(this, void 0, void 0, function* () {
        context.log('HTTP trigger function processed a request.');
        const data = {
            manufaturers200PlusPlanes: {},
            airbusModelPlanes: {},
            flightsManufacturers200PlusPlanes: {}
        };
        try {
            const pool = new pg_1.Pool({
                connectionString: process.env.PG_CONNECTION_STRING,
            });
            const client = yield pool.connect();
            data.manufaturers200PlusPlanes = yield getManufaturers200PlusPlanes(client);
            data.airbusModelPlanes = yield getAirbusModelPlanes(client);
            data.flightsManufacturers200PlusPlanes = yield getFlightsManufacturers200PlusPlanes(client);
            context.res = {
                status: 200,
                body: data,
            };
        }
        catch (error) {
            console.error("Unexpected error when fetching Destinations data. Error:", error);
            context.res = {
                status: 500,
                body: "Unexpected error when fetching Destinations data.",
            };
        }
    });
};
function getManufaturers200PlusPlanes(client) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield client.query(`SELECT manufacturer
        FROM (
            SELECT
                manufacturer,
                COUNT(tailnum) AS number_of_planes
            FROM public.planes
            GROUP BY manufacturer
            ) AS manufacturerPlaneQty
        WHERE manufacturerPlaneQty.number_of_planes > 200`);
        return data.rows;
    });
}
function getAirbusModelPlanes(client) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield client.query(`SELECT  model,
            COUNT(tailnum) AS number_of_planes,
            manufacturer
        FROM public.planes
        WHERE manufacturer SIMILAR TO '%AIRBUS%'
        GROUP BY model, manufacturer`);
        return data.rows;
    });
}
function getFlightsManufacturers200PlusPlanes(client) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield client.query(`-- total flights of manufactures with 200+ planes
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
        GROUP BY public.planes.manufacturer`);
        return data.rows;
    });
}
exports.default = httpTrigger;
//# sourceMappingURL=index.js.map