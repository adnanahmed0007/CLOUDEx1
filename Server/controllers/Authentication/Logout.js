const Logout = async (req, res) => {
    try {
        res.cookie("token", "", {
            maxAge: 0,
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });
        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            success: false,
            message: "Logout failed, try again",
        });
    }
};
export default Logout;
