const { Member } = require('../models');
const {signToken} = require('../helpers/jwt');
const {comparePassword}= require('../helpers/bcrypt')

class Controller{
    static async getListMember(req, res, next) {
        try {
            
        } catch (error) {
            
        }
    }

    static async registerMember(req, res, next) {
        try {
            const{name, password} = req.body;
            let newCode = '';
            if(!password){
                console.log('harus ada code dan password');
            }

            const findUser = await Member.findOne({
                where : {
                    name
                }
            });
            if(findUser){
                console.log('data sudah ada silahkan login menggunakan code');
                // throw ({name: 'unique', message: 'code has been registered, please try login'});
            };
            const findAllUser = await Member.findAll();
            if(findAllUser.length > 0) {
                let lastCode = findAllUser[findAllUser.length -1].code;    
                function formatNumber(number) {
                    return (number < 10 ? `M00${number+1}` : `M0${number+1}`) ;
                }
                let strNum = Number(lastCode.substring(1))
                newCode = strNum < 100 ? formatNumber(strNum) : `M${strNum + 1}`;
            } else {
                newCode = 'M001';
            }

            
            const result = await Member.create(
                {
                    code: newCode,
                    name,
                    password,
                }
            );
            res.status(201).json(result);
        } catch (error) {
            console.log(error);
        }
    }

    static async loginMember(req, res, next) {
        try {
            
        } catch (error) {
            
        }
    }
}

module.exports = Controller;