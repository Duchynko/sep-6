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
                total: {},
                airports: {},
            };
            data.total = yield getTotalFlights(client);
            data.airports = yield getFlightsPerAirport(client);
            context.res = {
                status: 200,
                body: data
            };
        }
        catch (error) {
            console.error("Unexpected error on idle client. Error:", error);
            context.res = {
                status: 500,
                body: "Unexpected error when connecting to the database.",
            };
        }
    });
};
function getTotalFlights(client) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = {};
        for (const month in months) {
            data[month] = (yield client.query(`SELECT COUNT(*) FROM flights WHERE flights.month = '${months[month]}';`)).rows[0].count;
        }
        return data;
    });
}
function getFlightsPerAirport(client) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = {};
        for (const airport of airports) {
            for (const month in months) {
                if (!data[airport]) {
                    data[airport] = {};
                }
                data[airport][month] = (yield client.query(`SELECT COUNT(*) FROM flights WHERE flights.month = '${months[month]}' AND flights.origin = '${airport}';`)).rows[0].count;
            }
        }
        return data;
    });
}
const airports = ["JFK", "LGA", "EWR"];
// prettier-ignore
const months = {
    january: "1", february: "2", march: "3", april: "4", may: "5", june: "6", july: "7",
    august: "8", september: "9", october: "10", november: "11", december: "12",
};
exports.default = httpTrigger;
//# sourceMappingURL=index.js.map