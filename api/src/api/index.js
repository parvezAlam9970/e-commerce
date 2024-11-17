const Response = require("../utilities/Response");
const Logger = require("../utilities/Logger");
const { validateToken } = require("./middlewares/auth");
const { validateTokenFront } = require("./middlewares/authFront");

/*
|--------------------------------------------------------------------------
|  Admin routes import
|--------------------------------------------------------------------------
// */

const adminRoute = require("./modules/admin/user/route");
const fileRoute = require("./modules/admin/file/route");
const categoryRoute = require("./modules/admin/category/route");
const brandRoute = require("./modules/admin/brand/route");
const modelRoute = require("./modules/admin/model/route");
const productRoute = require("./modules/admin/product/route");
const productVarientRoute = require("./modules/admin/productVarient/route");




// const purchaseRoute = require("./modules/admin/purchase/route");
// const productRoute = require("./modules/admin/product/route");
// const BrandRoute = require("./modules/admin/brand/route");
// const suppliesRoute = require("./modules/admin/supplies/route");
// const orderRoute = require("./modules/admin/order/route");
// const transactionRoute = require("./modules/admin/transaction/route");


/*
|--------------------------------------------------------------------------
|  Users routes import
|--------------------------------------------------------------------------
*/

const userRoute = require("./modules/front/user/route");
const categoryRouteFront = require("./modules/front/category/route");

const productRouteFront = require("./modules/front/product/route");
const cartRoute = require("./modules/front/cart/route");

/*
|--------------------------------------------------------------------------
|  Social routes import
|--------------------------------------------------------------------------
*/

// const socialLoginFbRoute = require("./modules/social/fbLogin/route");
const {
  setGuestToken,
  validateGuestToken,
} = require("./middlewares/authGuest");

const api = (app) => {
  app.use("*", (req, res, next) => {
    res.set({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    });
    if (req.method === "OPTIONS") {
      res.status(200).json({ status: "Okay" });
    } else {
      next();
    }
  });

  app.all("/status", (req, res) => {
    Logger.info("checking status", { status: 1 });

    Response.success(res, {
      data: {
        headers: req.headers,
        params: req.params,
        query: req.query,
        body: req.body,
      },
    });
  });

  app.all("/validate-token", validateToken, (req, res) => {
    Response.success(res, {
      data: {
        type: req.__cuser.type,
        adminRights: req.__cuser.adminRights,
        name: req.__cuser.name,
        avatar: req.__cuser.avatar,
      },
      message: "Authorized",
    });
  });

  /*
    |--------------------------------------------------------------------------
    |  Admin Urls
    |--------------------------------------------------------------------------
    */

  app.use("/admin", adminRoute);
  app.use("/admin/file", validateToken, fileRoute);
  app.use("/admin/category", validateToken, categoryRoute);
  app.use("/admin/brand", validateToken, brandRoute);
  app.use("/admin/model", validateToken, modelRoute);
  app.use("/admin/product", validateToken, productRoute);
  app.use("/admin/product-varient", validateToken, productVarientRoute);




  // app.use("/admin/product", validateToken, productRoute);
  // app.use("/admin/brand", validateToken, BrandRoute);
  // app.use("/admin/supplies", validateToken, suppliesRoute);
  // app.use("/admin/purchase", validateToken, purchaseRoute);
  // app.use("/admin/order", validateToken, orderRoute);
  // app.use("/admin/transaction", validateToken, transactionRoute);

  /*
    |--------------------------------------------------------------------------
    |  Users Urls
    |--------------------------------------------------------------------------
    */
  app.use("/user", userRoute);

  app.use("/product", productRouteFront);
  app.use("/category", categoryRouteFront);
  app.use("/cart", validateTokenFront, cartRoute);


  /*
    |--------------------------------------------------------------------------
    |  Users Urls
    |--------------------------------------------------------------------------
    */

  // app.use('/meta-login', socialLoginFbRoute);
};

module.exports = api;
