module.exports = {
  HTTP_SUCCESS: 200,
  HTTP_CREATE: 201,
  HTTP_UNAUTHORIZED: 401,
  HTTP_NOTFOUND: 404,
  HTTP_INTERNALERROR: 500,
  USERS_COLLECTION: "users",
  ITEMS_COLLECTION: "items",
  STORES_COLLECTION: "stores",
  ORDERS_COLLECTION: "orders",

  DEFAULT_SEARCH_RADIUS_METERS: 2000,
  DEFAULT_QUERY_LIMIT: 10,

  SPOT_BASE_URL: "https://microapps.googleapis.com/v1alpha",
  SPOT_ORDERS_SCOPE: "https://www.googleapis.com/auth/microapps.orders",
};
