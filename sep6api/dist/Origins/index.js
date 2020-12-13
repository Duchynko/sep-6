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
            originMeanAirTime: {},
            originMeanDepartureAndArrivalDelay: {},
        };
        try {
            const pool = new pg_1.Pool({
                connectionString: process.env.PG_CONNECTION_STRING,
            });
            const client = yield pool.connect();
            data.originMeanAirTime = yield getOriginMeanAirTime(client);
            data.originMeanDepartureAndArrivalDelay = yield getOriginMeanDepartureAndArrivalDelay(client);
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
function getOriginMeanAirTime(client) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield client.query(`SELECT  
            origin,
            AVG(CAST (air_time AS INTEGER)) AS "MEAN AIR TIME" 
        FROM public.flights
        WHERE 
            air_time != 'NA'
        GROUP BY origin`);
        return data.rows;
    });
}
function getOriginMeanDepartureAndArrivalDelay(client) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = yield client.query(`SELECT  
            origin,
            AVG(CAST (dep_delay AS INTEGER)) AS "MEAN DEP DELAY",
            AVG(CAST (arr_delay AS INTEGER)) AS "MEAN ARR DELAY"
        FROM public.flights
        WHERE 
            dep_delay != 'NA' AND arr_delay != 'NA'
        GROUP BY origin`);
        return data.rows;
    });
}
exports.default = httpTrigger;
//# sourceMappingURL=index.js.map