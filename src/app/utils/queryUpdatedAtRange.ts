const queryUpdatedAtRange = (query: Record<string, unknown>) => {
  // if gte and lte both exits -----------------------------------
  if (query.updatedAtGte && query.updatedAtLte) {
    return {
      updatedAt: {
        $gte: new Date(query.updatedAtGte as string),
        $lte: new Date(query.updatedAtLte as string),
      },
    };
  }

  //   if only lte exits
  if (query.updatedAtLte) {
    return {
      updatedAt: {
        $lte: new Date(query.updatedAtLte as string),
      },
    };
  }
  //  if only gte exits
  if (query.updatedAtGte) {
    return {
      updatedAt: {
        $gte: new Date(query.updatedAtGte as string),
      },
    };
  }
};

export default queryUpdatedAtRange;
