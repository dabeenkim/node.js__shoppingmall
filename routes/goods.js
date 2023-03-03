const express = require("express");
const authMiddleware = require("../middlewares/auth-middleware.js");
const router = express.Router();
const Cart = require("../schemas/cart.js");
const Goods = require("../schemas/goods.js");

// 장바구니 조회api
router.get("/goods/cart", authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;

  const carts = await Cart.find({ userId }).exec();
  const goodsIds = carts.map((cart) => cart.goodsId);

  const goods = [];
  for (let i = 0; i < goodsIds.length; i++) {
    const item = await Goods.findOne({ goodsId: goodsIds[i] });
    goods.push(item);
  }
  console.log(goods)

  res.json({
    carts: goods,
  });
});

// 상품 목록 조회 API
router.get("/goods", async (req, res) => {
  const { category } = req.query;

  const goods = await Goods.find(category ? { category } : {})
    .sort("-date")
    .exec();

  const results = goods.map((item) => {
    return {
      goodsId: item.goodsId,
      name: item.name,
      price: item.price,
      thumbnailUrl: item.thumbnailUrl,
      category: item.category,
    };
  });

  res.json({ goods: results });
});


// 상품 상세 조회 API
router.get("/goods/:goodsId", async (req, res) => {
  const { goodsId } = req.params;

  const goods = await Goods.findOne({ goodsId: goodsId }).exec();

  if (!goods) return res.status(404).json({});

  const result = {
    goodsId: goods.goodsId,
    name: goods.name,
    price: goods.price,
    thumbnailUrl: goods.thumbnailUrl,
    category: goods.category,
  }

  res.json({ goods: result });
});

//장바구니 등록api
router.post("/goods/:goodsId/cart", authMiddleware, async (req, res) => {
  const { userId } = res.locals.user;
  const { goodsId } = req.params;
  const { quantity } = req.body;

  const existsCarts = await Cart.find({ userId, goodsId }).exec();
  if (existsCarts.length) {
    return res.status(400).json({
      success: false,
      errorMessage: "이미 장바구니에 해당하는 상품이 존재합니다.",
    });
  }

  await Cart.create({ userId, goodsId, quantity });

  res.json({ result: "success" });
});

//장바구니 수정api
router.put("/goods/:goodsId/cart", authMiddleware, async(req, res) => {
  const {userId} = res.locals.user;
  const {goodId} = req.params;
  const {quantity} = req.body;
  
  
  const existsCarts = await Cart.find({ userId, goodId });
  if(existsCarts.length) {
    await Cart.updateOne(
      { userId, goodsId: goodsId },
      { $set: {quantity: quantity}}
    )
  }
  res.status(200).json({ success: success });
})



//장바구니 삭제api
router.delete("/goods/:goodsId/cart", authMiddleware, async (req, res) => {
  const { userId } =res.locals.user;
  const { goodsId } = req.params;

  const existsCarts = await Cart.find({ userId, goodsId });
  if (existsCarts.length) {
    await Cart.deleteOne({ userId, goodsId });
  }

  res.json({ result: "success" });
})


router.post("/goods", async (req, res) => {
  const { goodsId, name, thumbnailUrl, category, price } = req.body;

  const goods = await Goods.find({ goodsId });

  if (goods.length) {
    return res.status(400).json({
      success: false,
      errorMessage: "이미 존재하는 GoodsId입니다."
    });
  }

  const createdGoods = await Goods.create({ goodsId, name, thumbnailUrl, category, price });

  res.json({ goods: createdGoods });
})

module.exports = router;