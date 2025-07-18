const handleGenericAPIError = (funName, req, res, err) => {
    console.log(`----- ❌ Error in ${funName} ---------`);
    console.log(err.message);
    console.log(`-----------------------------------`);

    if (err.name === "ValidationError" || err.code == "11000") {
        res.status(400).json({ isSuccess: false, message: `Err: ${err.message}`, data: {} });
    }

    res.status(500).json({
        isSuccess: false,
        message: "Internal Server Error",
        data: {
            errorMessage: err.name,
        },
    });
};

module.exports = { handleGenericAPIError };
