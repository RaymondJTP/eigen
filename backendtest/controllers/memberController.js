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
            if(!name || !password){
                throw ({name: 'badrequest', message: 'nama dan password tidak boleh kosong'});
            }

            const findUser = await Member.findOne({
                where : {
                    name
                }
            });
            if(findUser){
                throw ({name: 'badrequest', message: 'nama sudah terdaftar, silahkan login dengan nama tersebut atau register menggunakan nama lain'});
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
            next(error);
        }
    }

    static async loginMember(req, res, next) {
        try {
            const { code, password } = req.body;

            if (!code || !password ) {
                throw ({name: 'badrequest', message: 'nama dan password tidak boleh kosong'});
            }

            //  mencari data member sesuai code
            const findMember = await Member.findOne({
                where : {
                    code
                },
            });

            //  jika tidak ditemukan data member
            if( !findMember ) {
                throw ({name: 'notfound', message: `akun member dengan code ${code} tidak ditemukan`});
            }

            //  jika ada
            let isValidPassword = comparePassword(password, findMember.password);

            //  jika password tidak valid
            if (!isValidPassword) {
                throw ({name: 'invalidlogin', message: `password anda salah`});
            }

            //  jika valid 
            let tokenPayLoad = {id: findMember.id, code: findMember.code};
            let access_token = signToken(tokenPayLoad);
            res.status(200).json({message: 'Login Success', access_token, findMember});
        } catch (error) {
            next(error);
        }
    }
}

module.exports = Controller;