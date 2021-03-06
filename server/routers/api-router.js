const express = require("express");
const apiController = require("./../controllers/api-controller");
const usersController = require("./../controllers/users-controller");
const itemsController = require("./../controllers/items-controller");
const storesController = require("./../controllers/stores-controller");
const ordersController = require("./../controllers/orders-controller");
const authenticateUser = require("./../authentication");
const router = express.Router();

// Debugging Endpoints
router.post("/", apiController.getWelcomeMessage);
router.get("/user/list", usersController.listUsers);

// Nonce Endpoint
// TODO (#149): implement more secure nonce
router.get("/nonce", (req, res) => res.send("static nonce"));

// Store API
router.post("/store", storesController.getStore);
router.post("/store/list", storesController.listStores); //Batch Operation

// Users API
router.post("/user", usersController.getUser);

// Items API
router.post("/item", itemsController.getItems); //Batch Operation

// Order API
router.post("/order/add", authenticateUser, ordersController.addOrder);
router.post("/order/update", authenticateUser, ordersController.updateOrder);
router.get("/order/list", authenticateUser, ordersController.listOrders);
router.get(
  "/order/merchants/:merchantId/orders/:orderId",
  authenticateUser,
  ordersController.getOrder
);

module.exports = router;
