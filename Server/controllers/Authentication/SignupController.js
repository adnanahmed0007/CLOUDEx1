import UserDetaildatabse from "../../models/Usermodel.js";
import generateToken from "../../util/Generatetoken.js";
import bcrypt from "bcrypt"
const SignupController = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (name && email && password) {
            const find = await UserDetaildatabse.findOne({ email });
            if (find) {
                return res
                    .status(409)
                    .json({
                        message: "user already regsiter"
                    })
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = new UserDetaildatabse({
                name: name,
                email: email,
                password: hashedPassword,

            })
            await user.save();
            const token = generateToken(user);

            res.cookie("token", token, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            return res.status(201).json({
                success: true,
                message: "User registered successfully",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            });

        }
        else {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

    }
    catch (e) {

        return res
            .status(500)
            .json({ message: "internal server error" + " " + e })

    }
}
export default SignupController;