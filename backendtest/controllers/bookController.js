const { Book } = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

class Controller{
    static async getBooks(req, res, next) {
        try {
            const { titleKeyword } = req.query;
            let where = {};
            
            if( titleKeyword ) {
                where.title = { [Op.like]: `%${titleKeyword}%` };
            }
            const findBooks = await Book.findAll({
                where,
                attributes: {exclude: ['createdAt', 'updatedAt']},
            });

            return res.status(200).json(findBooks);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
}

module.exports = Controller;