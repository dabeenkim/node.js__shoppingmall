const jwt = require("jsonwebtoken");
const User = require("../schemas/user.js");


module.exports = async (req, res, next) => {
    const {Authorization} = req.cookies;

    //authorization이 존재하지않을때 split을 undifind에서는 에러가 나오기때문에
    //??는 왼쪽에 있는 값이 null이거나 비엇으면 오른쪽의 빈문자열을 넣어주게된다.
    const [authType, authToken] = (Authorization ?? "").split(" ");
    
    //authType === Bearer값인지 확인
    //aythToken 검증
    if( authType !== "Bearer" || !authToken){
        res.status(400).json({
            errorMessage: "로그인 후에 이용할 수 있는 기능입니다."
        });
        return;
    }

    try{
         //authToken 만료되었는지
         //authToken 서버가 발급 토큰이 맞는지
        const {userId} = jwt.verify(authToken, "customized-secret-key");

        //authToken 잇는 userId에 해당하는 사용자가 실제 DB에 존재하는지
        const user = await User.findById(userId);
        res.locals.user = user;

        next();//다음으로 넘어감
    }catch (error) {
        console.error(error);
        res.status(400).json({errorMessage: "로그인 후에 이용할 수 있는 기능입니다."})
    }

}