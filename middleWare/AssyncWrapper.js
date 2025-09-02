module.exports = (async)=>{


return(req, res , next) => {
    async(req, res, next).catch((err)=>{
        next(err);
    })
}
}