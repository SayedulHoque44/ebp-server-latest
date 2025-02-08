"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const queryUpdatedAtRange = (query) => {
    // if gte and lte both exits -----------------------------------
    if (query.updatedAtGte && query.updatedAtLte) {
        return {
            updatedAt: {
                $gte: new Date(query.updatedAtGte),
                $lte: new Date(query.updatedAtLte),
            },
        };
    }
    //   if only lte exits
    if (query.updatedAtLte) {
        return {
            updatedAt: {
                $lte: new Date(query.updatedAtLte),
            },
        };
    }
    //  if only gte exits
    if (query.updatedAtGte) {
        return {
            updatedAt: {
                $gte: new Date(query.updatedAtGte),
            },
        };
    }
};
exports.default = queryUpdatedAtRange;
