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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var pg_1 = require("pg");
var httpTrigger = function (context, req) {
    return __awaiter(this, void 0, Promise, function () {
        var data, pool, client, _a, _b, _c, error_1;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    context.log('HTTP trigger function processed a request.');
                    data = {
                        manufaturers200PlusPlanes: {},
                        airbusModelPlanes: {},
                        flightsManufacturers200PlusPlanes: {}
                    };
                    _d.label = 1;
                case 1:
                    _d.trys.push([1, 6, , 7]);
                    pool = new pg_1.Pool({
                        connectionString: process.env.PG_CONNECTION_STRING
                    });
                    return [4 /*yield*/, pool.connect()];
                case 2:
                    client = _d.sent();
                    _a = data;
                    return [4 /*yield*/, getManufaturers200PlusPlanes(client)];
                case 3:
                    _a.manufaturers200PlusPlanes = _d.sent();
                    _b = data;
                    return [4 /*yield*/, getAirbusModelPlanes(client)];
                case 4:
                    _b.airbusModelPlanes = _d.sent();
                    _c = data;
                    return [4 /*yield*/, getFlightsManufacturers200PlusPlanes(client)];
                case 5:
                    _c.flightsManufacturers200PlusPlanes = _d.sent();
                    context.res = {
                        status: 200,
                        body: data
                    };
                    return [3 /*break*/, 7];
                case 6:
                    error_1 = _d.sent();
                    console.error("Unexpected error when fetching Destinations data. Error:", error_1);
                    context.res = {
                        status: 500,
                        body: "Unexpected error when fetching Destinations data."
                    };
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
};
function getManufaturers200PlusPlanes(client) {
    return __awaiter(this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.query("SELECT manufacturer\n        FROM (\n            SELECT\n                manufacturer,\n                COUNT(tailnum) AS number_of_planes\n            FROM public.planes\n            GROUP BY manufacturer\n            ) AS manufacturerPlaneQty\n        WHERE manufacturerPlaneQty.number_of_planes > 200")];
                case 1:
                    data = _a.sent();
                    return [2 /*return*/, data.rows];
            }
        });
    });
}
function getAirbusModelPlanes(client) {
    return __awaiter(this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.query("SELECT  model,\n            COUNT(tailnum) AS number_of_planes,\n            manufacturer\n        FROM public.planes\n        WHERE manufacturer SIMILAR TO '%AIRBUS%'\n        GROUP BY model, manufacturer")];
                case 1:
                    data = _a.sent();
                    return [2 /*return*/, data.rows];
            }
        });
    });
}
function getFlightsManufacturers200PlusPlanes(client) {
    return __awaiter(this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.query("-- total flights of manufactures with 200+ planes\n        SELECT \n            manufacturer,\n            SUM(flights) AS flights\n        FROM\n        \n            -- total flights of each tailnum from manufacturers with 200+ planes\n            (SELECT\n                public.flights.tailnum,\n                COUNT(id) AS flights\n            FROM public.flights \n            INNER JOIN\n                -- all tail numbers of manufacturers with 200+ planes\n                (SELECT tailnum\n                FROM public.planes\n                INNER JOIN\n        \n                    -- manufacturers with 200+ planes\n                    (SELECT manufacturer\n                    FROM(\n        \n                        -- manufacturers plane count\n                        SELECT\n                            manufacturer,\n                            COUNT(tailnum) AS number_of_planes\n                        FROM public.planes\n                        GROUP BY manufacturer\n        \n                    ) AS manufacturerPlanes\n                    WHERE manufacturerPlanes.number_of_planes > 200) AS top_manufac\n        \n                ON public.planes.manufacturer = top_manufac.manufacturer) as tailnumbers_top_manufac\n        \n            ON public.flights.tailnum = tailnumbers_top_manufac.tailnum\n            WHERE (public.flights.tailnum != 'NULL')\n            GROUP BY public.flights.tailnum) AS tailnum_NrFlights\n        \n        INNER JOIN public.planes ON tailnum_NrFlights.tailnum = planes.tailnum\n        GROUP BY public.planes.manufacturer")];
                case 1:
                    data = _a.sent();
                    return [2 /*return*/, data.rows];
            }
        });
    });
}
exports["default"] = httpTrigger;
