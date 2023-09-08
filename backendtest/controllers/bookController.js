const { Book, BookBorrowed, Member } = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const {sequelize} = require('../models')
const { convertToLocal } = require('../helpers/dateFormat')

class Controller{
    /**
     * @swagger
     * /books:
     *      get:
     *          tags: [Books]
     *          description: Get All Books
     *          security:
     *              - access_token: []
     *          parameters:
     *              - in: query
     *                name: titleKeyword
     *                schema:
     *                  type: string
     *                description: mencari buku berdasarkan nama buku, dapat dikosongkan jika ingin melihat semua list buku
     *          responses:
     *              200:
     *                  description: SUCCESS
     */
    static async getBooks(req, res, next) {
        try {
            const { titleKeyword } = req.query;
            let where = {};

            if( titleKeyword ) {
                where.title = { [Op.like]: `%${titleKeyword}%` };
            }
            where.stock = { [Op.gt]: 0 };
            const findBooks = await Book.findAll({
                where,
                attributes: {exclude: ['createdAt', 'updatedAt']},
            });

            return res.status(200).json(findBooks);
        } catch (error) {
            next(error);
        }
    }
    /**
     * @swagger
     * /books/borrow:
     *      post:
     *          tags: [Books]
     *          description: Meminjam buku
     *          security:
     *              - access_token: []
     *          requestBody:
     *              required: true
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              borrowDate:
     *                                  type: string
     *                                  description: format harus yyyy-mm-dd hh:MM:ss
     *                                  example: 2023-09-08 02:13:35
     *                              bookCode:
     *                                  type: string
     *                                  desription: code buku, dapat dilihat  di list buku
     *                                  example: LKS-1
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
    static async borrowBook(req, res, next) {
        try {
            const {id, totalBookBorrowed} = req.user;
            const { borrowDate, bookCode } = req.body;
            if(!borrowDate || !bookCode) {
                throw ({name: 'badrequest', message: 'silahkan isi tanggal peminjaman dan code buku'})
            }
            const borrowDateFormat = convertToLocal(borrowDate);
            const findMemberBorrow = await Member.findOne({
                where: {
                    id
                }
            })

            if(findMemberBorrow.isPenalized === true) {
                throw({name: 'badrequest', message: 'anda sedang terkena penalti'})
            }
            const findBookBorrowedTotal = await BookBorrowed.findAll({
                where: {
                    idMember: id
                }
            })

            if(findBookBorrowedTotal.length > 1) {
                throw ({name: 'badrequest', message: 'anda tidak boleh meminjam buku lagi karena anda sedang aktif meminjam 2 buku'})
            }
            const findBook = await Book.findOne({
                where: {
                    code: bookCode
                }
            });
            // console.log(findBook);

            if (!findBook) {
                throw ({name: 'notfound', message: `buku dengan code ${bookCode} tidak ditemukan di database kami`});
            }

            if (findBook.stock == 0) {
                throw ({name: 'badrequest', message: `stock buku dengan code ${bookCode} sudah habis, silahkan pilih buku lainnya`})
            }
            
            const findBorrowedBook = await BookBorrowed.findOne({
                where: {
                    idBook: findBook.id,
                    idMember: id
                }
            });

            if (findBorrowedBook) {
                throw ({name: 'badrequest', message: `buku dengan code ${bookCode} sudah anda pinjam, silahkan masukkan code buku lain`})
            }

            const result = await sequelize.transaction(async (t) => {
                const borrowBook = await BookBorrowed.create(
                    { idMember: id, idBook: findBook.id, borrowDate: borrowDateFormat},
                    { transaction: t},
                )
                await Book.update(
                   { stock: findBook.stock - 1 },
                   { where: {
                        id: findBook.id,
                    },
                    transaction: t
                   },
               )

               await Member.update(
                   { bookBorrowed: totalBookBorrowed + 1},
                   { where: {
                       id
                    },
                   transaction: t 
                   },
               )

               return borrowBook;
            })

            res.status(201).json({message: `Sukses meminjam buku dengan code ${bookCode}`, data: result})
        } catch (error) {
            next(error)
        }
    }

    /**
     * @swagger
     * /books/return:
     *      post:
     *          tags: [Books]
     *          description: Balikin buku buku
     *          security:
     *              - access_token: []
     *          requestBody:
     *              required: true
     *              content:
     *                  application/json:
     *                      schema:
     *                          type: object
     *                          properties:
     *                              returnDate:
     *                                  type: string
     *                                  description: format harus yyyy-mm-dd hh:MM:ss
     *                                  example: 2023-09-08 02:13:35
     *                              bookCode:
     *                                  type: string
     *                                  desription: code buku, dapat dilihat  di list buku
     *                                  example: LKS-1
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
    static async returnBook(req, res, next) {
        try {
            const {id, totalBookBorrowed} = req.user;
            const {returnDate, bookCode} = req.body;
            let dayOfReturning = '';
            if (!returnDate || !bookCode) {
                throw ({name: 'badrequest', message: 'masukkan tanggal pengembalian buku dan code buku'})
            }
            const findBook = await Book.findOne({
                where: {
                    code: bookCode
                }
            })

            if (!findBook) {
                throw ({name: 'notfound', message:  `buku dengan code ${bookCode} tidak ditemukan`})
            }
            const findBorrowedBook = await BookBorrowed.findOne({
                where: {
                    idMember: id,
                    idBook: findBook.id
                }
            });

            if (!findBorrowedBook) {
                throw ({ name: 'notfound', message: `kamu sedang tidak meminjam buku dengan code ${bookCode}`})
            }
            //  mencari tanggal hari ini
            let borrowDateFormat = new Date(findBorrowedBook.borrowDate);
            let dayBorrow = borrowDateFormat.getDate();
            let returnDateResult
            let todayFormat = new Date();
            let dayToday = todayFormat.getDate();
            returnDateResult = todayFormat;
            if (dayToday === dayBorrow) {
                let returnFormat = new Date(returnDate);
                returnDateResult = returnFormat
                let dayReturnFormat = returnFormat.getDate();
                dayOfReturning = dayReturnFormat;
            }
            const returnGap = dayOfReturning - dayBorrow;

            const result = await sequelize.transaction(async (t) => {
                await Member.update(
                    {   bookBorrowed: totalBookBorrowed -1   },
                    {   where: {
                            id
                        },
                        transaction: t
                    }
                )
                await BookBorrowed.destroy({
                    where: {
                        id: findBorrowedBook.id
                    },
                    transaction: t
                })

                await Book.update(
                    { stock: findBook.stock + 1},
                    { where: {
                        id: findBook.id
                      },
                      transaction: t
                    }
                )

                if (returnGap > 7) {
                    await Member.update(
                        {   isPenalized: true, penaltyDate: returnDateResult  },
                        {   where: {
                                id
                            },
                            transaction: t
                        }
                    )
                }

                return `Sukses mengembalikan buka dengan code ${bookCode}`
            })

            res.status(200).json({message: result})
            
        } catch (error) {
            next(error);
        }
    }
}

module.exports = Controller;