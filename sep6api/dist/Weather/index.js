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
                observations: {},
                temperature: {},
            };
            data.observations = yield GetNumberOfObservations(client);
            data.temperature = yield GetTemperature(client);
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
const origins = ["JFK", "LGA", "EWR"];
function GetNumberOfObservations(client) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = {};
        for (const origin of origins) {
            data[origin] = (yield client.query(`SELECT  * FROM weather where weather.origin ='${origin}';`)).rowCount;
        }
        return data;
    });
}
function GetTemperature(client) {
    return __awaiter(this, void 0, void 0, function* () {
        const data = {};
        for (const origin of origins) {
            data[origin] = (yield client.query(`SELECT time_hour, ((temp-32)*5/9) as celcius_temp FROM weather where weather.origin ='${origin}';`)).rows;
        }
        return data;
    });
}
exports.default = httpTrigger;
//# sourceMappingURL=index.js.map