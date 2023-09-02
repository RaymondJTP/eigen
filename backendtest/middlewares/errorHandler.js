const errorHandler = (err,req,res,next) => {

    if(err.name == 'SequelizeValidationError'){
        res.status(400).json({message: err.errors[0].message})
    }else if(err.name == 'invalidlogin'){
        res.status(400).json({message: err.message})
    }else if(err.name == 'badrequest'){
        res.status(400).json({message: err.message})
    }else if(err.name == 'unauthorized'){
        res.status(403).json({message: err.message})
    }else if(err.name == 'unique' || err.name == 'badrequest' || err.name == 'productused'){
        res.status(400).json({message: err.message})
    }else if(err.name == 'TypeError'){
        res.status(400).json({message: 'Error type'})
    }else if(err.name == 'wrongImageType'){
        res.status(400).json({message: 'Please input image format'})
    }else if(err.name == 'MulterError'){
        res.status(400).json({message: 'File size must be under 225K'})
    }else if(err.name == 'SequelizeUniqueConstraintError'){
        res.status(400).json({message: 'Email has already been existed'})
    }else if(err.name == 'notfound'){
        res.status(404).json({message: err.message})
    }else if(err.name == 'unauthentication' || err.name == "JsonWebTokenError"){
        res.status(401).json({message: 'Please login first to access'})
    }else{
        res.status(500).json(err)
    }
}

module.exports = errorHandler;