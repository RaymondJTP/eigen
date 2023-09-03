const { Book, BookBorrowed, Member } = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const {sequelize} = require('../models')
const { convertToLocal } = require('../helpers/dateFormat')

class Controller{
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
            console.log(error);
            next(error);
        }
    }

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
            
            let todayFormat = new Date();
            let dayToday = todayFormat.getDate();
            
            if (dayToday === dayBorrow) {
                let returnFormat = new Date(returnDate);
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
                        {   isPenalized: true, penaltyDate: todayFormat  },
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