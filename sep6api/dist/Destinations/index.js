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
const httpTrigger = function (context, _) {
    return __awaiter(this, void 0, void 0, function* () {
        context.log("HTTP trigger function processed a request.");
        try {
            const pool = new pg_1.Pool({
                connectionString: process.env.PG_CONNECTION_STRING,
            });
            const client = yield pool.connect();
            const data = {
                airports: {},
                total: {},
            };
            data.airports = yield getDataPerAirport(client);
            data.total = yield getTotalData(client);
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
function getTotalData(client) {
    return __awaiter(this, void 0, void 0, function* () {
        const args = airports.map((a) => "'" + a + "'").join(", ");
        const response = yield client.query(`SELECT COUNT(*), dest FROM flights WHERE origin IN (${args}) GROUP BY dest ORDER BY COUNT(dest) DESC LIMIT 10;`);
        return response.rows;
    });
}
function getDataPerAirport(client) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = {};
        for (const airport of airports) {
            const response = yield client.query(`SELECT COUNT(*), dest FROM flights WHERE origin='${airport}' GROUP BY dest ORDER BY COUNT(dest) DESC LIMIT 10;`);
            data[airport] = response.rows;
        }
        return data;
    });
}
const airports = ["JFK", "LGA", "EWR"];
exports.default = httpTrigger;
//# sourceMappingURL=index.js.map