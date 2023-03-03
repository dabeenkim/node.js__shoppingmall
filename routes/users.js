const express = require("express");
const router = express.Router();
const User = require("../schemas/user.js");
const authMiddleware = require("../middlewares/auth-middleware")

//정보조회 api
router.get("/users/me", authMiddleware, async(req, res) => {
    //get메소드가 users/me로 들어왔다면 그다음에 사용자 인증 미들웨어를 갓다가오게됨
    const {email, nickname} = res.locals.user;

    res.status(200).json({
        user: {
            email: email,
            nickname: nickname,

        }
    });

});

router.post("/users", async(req,res) => {
    const { email, nickname, password, confirmPassword  } = req.body;

    //패스워드와 패스워드 확인의 성공여부
    if( password != confirmPassword ){
        res.status(400).json({
            errorMessage: "패스워드와 확인값이 일치하지 않습니다."
        });
        return;  //뒤에 있는값들이 더이상 진행이 되지않고 코드가 여기서 끝나게됨
    }
    
    //email, nickname이 실제로 DB에 존재하는지 확인
    const isExistUser = await User.findOne({
        $or: [{email}, {nickname}],  //이메일 또는 닉네임이 일치할 때 조회
    });
    if(isExistUser) {
        res.statusMessage(400).json({
            errorMessage: "이메일 또는 닉네임이 이미 사용중입니다."
        });
        return;
    }
    const user = new User({email, nickname, password});
    await user.save();  //DB에 저장한다.

    return res.status(201).json({});
});





module.exports = router;