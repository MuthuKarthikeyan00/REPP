import {loginSchema, registerSchema} from "../validation/authValidation.js";
import prisma from "../DB/db.config.js";
import bcrypt from "bcrypt";
import vine ,{errors} from '@vinejs/vine';
import jwt from "jsonwebtoken";

export default class AuthController {

    static async register(req, res) {
        try{
            const body = req.body;
            const validator = vine.compile(registerSchema);
            const payload = await validator.validate(body);

            const findUser = await prisma.users.findUnique({
                where :{
                    email :payload.email
                }
            })

            if (findUser){
                return res.status(400).json({
                    error : {
                        message: "Email already taken.please use another one.",
                    }
                })
            }

            //   * Encrypt the password
            const salt = bcrypt.genSaltSync(10);
            payload.password = bcrypt.hashSync(payload.password, salt);

            const user = await prisma.users.create({
                data : payload
            })


            return res.status(200).json({
                    message: "sign up successfully",
                    user
            })

        }catch (error){
            console.log("The req is", req);
            console.log("The body is", req.body);
            console.log("The error is", error);

            if (error instanceof errors.E_VALIDATION_ERROR) {
                // console.log(error.messages);
                return res.status(400).json({ errors: error.messages });
            } else {
                return res.status(500).json({
                    status: 500,
                    message: "Something went wrong.Please try again.",
                });
            }
        }
    }

    static async login(req, res) {
        try {

            const body = req.body;
            const validator = vine.compile(loginSchema);
            const payload = await validator.validate(body);

            const findUser = await prisma.users.findUnique({
                where : {
                    email :payload.email
                }
            })

            console.log(findUser)

            if (findUser) {
                if (!bcrypt.compareSync(payload.password, findUser.password)) {
                    return res.status(400).json({
                        errors: {
                            email: "Invalid Credentials.",
                        },
                    });
                }

                // * Issue token to user
                const payloadData = {
                    id: findUser.id,
                    name: findUser.name,
                    email: findUser.email,
                    profile: findUser.profile,
                };
                const token = jwt.sign(payloadData, process.env.JWT_SECRET_KEY, {
                    expiresIn: "365d",
                });

                return res.json({
                    message: "Logged in",
                    access_token: `Bearer ${token}`,
                });
            }

            return res.status(400).json({
                errors: {
                    email: "No user found with this email.",
                },
            });

        }catch (e) {
            console.log("The req is", req);
            console.log("The body is", req.body);
            console.log("The error is", e);
            if (e instanceof errors.E_VALIDATION_ERROR) {
                return res.status(400).json({ errors: e.messages });
            }else {
                return res.status(500).json({errors:'something went wrong.Please try again.'});
            }
        }
    }
}