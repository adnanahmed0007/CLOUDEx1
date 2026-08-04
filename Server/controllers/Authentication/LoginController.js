import UserDetaildatabse from "../../models/Usermodel.js";
import generateToken from "../../util/Generatetoken.js";
import bcrypt from "bcrypt";
const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (email && password) {
            const user = await UserDetaildatabse.findOne({ email });
            if (!user) {
                return res
                    .status(404)
                    .json({
                        message: "user not found"
                    })
            }
            const check = await bcrypt.compare(password, user.password);
            if (!check) {
                return res
                    .status(401)
                    .json({
                        message: " password is not correct"
                    })
            }
            const token = generateToken(user);

            res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            return res.status(200).json({
                success: true,
                message: "Login successful",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                }
            });
        }
        else if (!email || !password) {
            return res
                .status(400)
                .json({
                    message: "fill all the credentials"
                })

        }

    }
    catch (e) {
        console.log(e)
        return res
            .status(500)
            .json({
                message: "internal server error"
            })


    }

}
export default Login;