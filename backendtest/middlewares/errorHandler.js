const errorHandler = (err,req,res,next) => {

    if(err.name == 'SequelizeValidationError'){
        res.status(400).json({message: err.errors[0].message})
    }else if(err.name == 'invalidlogin'){
        res.status(400).json({message: err.message})
    }else if(err.name == 'badrequest'){
        res.status(400).json({message: err.message})
    }else if(err.name == 'unauthorized'){
        res.status(403).json({message: err.message})
    }else if(err.name == 'TypeError'){
        res.status(400).json({message: 'Error type'})
    }else if(err.name == 'SequelizeUniqueConstraintError'){
        res.status(400).json({message: 'Email has already been existed'})
    }else if(err.name == 'notfound'){
        res.status(404).json({message: err.message})
    }else if(err.name == 'unauthentication' || err.name == "JsonWebTokenError"){
        res.status(401).json({message: 'access token yang digunakan salah, silahkan login kembali'})
    }else{
        res.status(500).json(err)
    }
}

module.exports = errorHandler;