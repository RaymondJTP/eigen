const { Member } = require('../models');
const {signToken} = require('../helpers/jwt');
const {comparePassword}= require('../helpers/bcrypt')


class Controller{
    /**
     * @swagger
     * /member:
     *      get:
     *          tags: [Member]
     *          description: Gett All Members
     *          responses:
     *              200:
     *                  description: SUCCESS
     */
    static async getListMember(req, res, next) {
        try {
            const result = await Member.findAll({
                attributes: {exclude: ['createdAt', 'updatedAt']},
            })

            res.status(200).json({data: result});
        } catch (error) {
            next(error)
        }
    }
    /**
     * @swagger
     * /member/register:
     *      post:
     *          tags: [Member]
     *          description: Mendaftarkan member baru
     *          requestBody:
     *              required: true
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              name:
     *                                  type: string
     *                                  description: nama akun member
     *                                  example: raymond
     *                              password:
     *                                  type: string
     *                                  desription: password untuk login
     *                                  example: inipassword
     *      
     *          responses:
     *              201:
     *                  description: SUCCESS CREATE
     *              400:
     *                  description: BAD REQUEST
     *              500:
     *                  description: Invalid Server Error
     */
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
            res.status(201).json({message: 'berhasil mendaftar member', data: result});
        } catch (error) {
            next(error);
        }
    }

    /**
     * @swagger
     * /member/login:
     *      post:
     *          tags: [Member]
     *          description: Login member
     *          requestBody:
     *              required: true
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              code:
     *                                  type: string
     *                                  description: code akun member yang diberikan saat register
     *                                  example: M002
     *                              password:
     *                                  type: string
     *                                  desription: password untuk login
     *                                  example: passwordraymond
     *      
     *          responses:
     *              201:
     *                  description: SUCCESS CREATE
     *              400:
     *                  description: BAD REQUEST
     *              404:
     *                  description: NOT FOUND
     *              500:
     *                  description: Invalid Server Error
     */
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
            let tokenPayLoad = {id: findMember.id, code: findMember.code};
            let access_token = signToken(tokenPayLoad);

            if (findMember.isPenalized === true) {
                //  cari angka hari ini
                let thisDate = new Date();
                let dayThisDate = thisDate.getDate();

                //  cari angka hari kena penalti
                let returnDate = new Date(findMember.penaltyDate)
                let dayReturnDate = returnDate.getDate();

                if (dayThisDate - dayReturnDate > 3) {
                    await Member.update(
                        {   isPenalized: false, penaltyDate: null}
                    )
                    res.status(200).json({message: 'Login Success', access_token, findMember});

                }
                res.status(200).json({message: 'Login Success', access_token, findMember});
            }
            //  jika valid 
            res.status(200).json({message: 'Login Success', access_token, findMember});
        } catch (error) {
            next(error);
        }
    }
}

module.exports = Controller;