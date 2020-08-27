const express = require("express");
const router = express.Router();

const { create, productById, read, remove, update, list, listRelated, listCategory, listBySearch, photo} = require("../controllers/product");
const {requireSignin, isAdmin, isAuth} = require("../controllers/auth");
const {userById} = require("../controllers/user");


router.post("/product/create/:userId", requireSignin, isAuth, isAdmin ,create);
router.get("/product/:productId", read);
router.delete("/product/:productId/:userId", requireSignin, isAdmin, isAuth, remove);//userid to make sure we have correct user
router.put("/product/:productId/:userId", requireSignin, isAuth, isAdmin, update);
router.get("/product/photo/:productId", photo);

router.get("/products", list);
router.get("/products/related/:productId ", listRelated);
//return categories based on product
router.get("/products/categories", listCategory);
router.post("/products/by/search", listBySearch);

router.param("userId", userById);
router.param("productId", productById);//crud

module.exports = router;