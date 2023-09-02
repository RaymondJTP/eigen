const { Member } = require('../models');
const {verifyToken} = require('../helpers/jwt')

const authentication = async (req, res, next) => {
    try {
        const {access_token} = req.headers;

        if (!access_token) {
            console.log('tidak ada access token');
        }

        const tokenPayload = verifyToken(access_token);
        const getMember = await Member.findOne({
            where: {
                code: tokenPayload.code
            }
        });

        if (!getMember) {
            console.log('tidak terauntentikasi');
        }

        req.user = {
            id: getMember.id,
            code: getMember.id
        }

        next()

    } catch (error) {
        console.log(error, 'authentication 31');
    }
}

module.exports = authentication;