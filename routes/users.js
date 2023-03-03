const express = require("express");
const router = express.Router();
const User = require("../schemas/user");

router.post("/users", async(req,res) => {
    const { email, nickname, password, confirmpassword } = req.body;

    //패스워드와 패스워드 확인의 성공여부
    if( password !== confirmpassword){
        res.status(400).json({
            errorMessage: "패스워드와 확인값이 일치하지 않습니다."
        });
        return;  //뒤에 있는값들이 더이상 진행이 되지않고 코드가 여기서 끝나게됨
    }
    
    //email, nickname이 실제로 DB에 존재하는지 확인
    const isExistUser = await userSchema.findOne({
        $or: [{email}, {nickname}],  //이메일 또는 닉네임이 일치할 때 조회
    });
    if(isExistUser) {
        res.statusMessage(400).json({
            errorMessage: "이메일 또는 닉네임이 이미 사용중입니다."
        });
        return;
    }
    const user = new userSchema({email, nickname, password});
    await user.save();  //DB에 저장한다.

    return res.status(201).json({});
});





module.exports = router;