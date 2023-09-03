const { Member } = require('../models');
const {verifyToken} = require('../helpers/jwt')

const authentication = async (req, res, next) => {
    try {
        if (req.originalUrl.includes('/api-docs')) {
            next();
        }
        const {access_token} = req.headers;

        if (!access_token) {
            throw ({name: 'invalidlogin', message: 'silahkan login terlebih dahulu untuk mendapatkan access token'})
        }

        const tokenPayload = verifyToken(access_token);
        const getMember = await Member.findOne({
            where: {
                code: tokenPayload.code
            }
        });

        if (!getMember) {
            throw{name: 'unauthentication'}
        }

        req.user = {
            id: getMember.id,
            code: getMember.code,
            totalBookBorrowed: getMember.bookBorrowed
        }

        next()

    } catch (error) {
        next(error);
    }
}

module.exports = authentication;