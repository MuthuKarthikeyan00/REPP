import jwt from "jsonwebtoken";


const authMiddleware = (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;

        if (authHeader === null || authHeader === undefined) {
            return res.status(401).json({ status: 401, message: "UnAuthorized" });
        }

        console.log("The token is", authHeader);

        const token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
            req.user = user;
        })

        next()

    }catch (e) {
         res.status(401).json({ status: 401, message: "UnAuthorized" });
    }

}

export default authMiddleware;