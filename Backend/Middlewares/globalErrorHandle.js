exports.globalErrorHandle = (err , req , res , next) => {
    const msg = err.message;
    //console.log("triggered");
    res.status(400).json({
        message: msg
    })
}