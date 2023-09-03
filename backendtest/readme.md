# Eigen Test simple API Documentation

## Execute first :

 - Run npm install pada terminal
 - Buat .env dengan isinya adalah JWT_AUTH=*isisendiri*
 - Atur configurasi db di folder config/config.json (saya menggunakan db mysql)
 - Run sequelize db:create
 - Run sequelize db:migrate
 - Run sequelize db:seed:all
 - Jika command sequelize terdapat eror, bisa gunakan npm install --save sequelize bisa hubungi saya kembali
 - Command nodemon untuk melakukan akses ke server
 - Pada sistem yang saya buat, saya menggunakan authentication oleh karena itu harus dilakukan registrasi member dan login terlebih dahulu untuk dapat mengakses endpoint book.

## Endpoints :

List of available endpoints:

- `POST /member/register`
- `POST /member/login`
- `GET /member/list`
- `POST /products`
- `POST /products/:id`
- `POST /products/:id/payment`
- `GET /history`


&nbsp;

## 1. POST /member/register

Description : Register member account
http://localhost:3000/member/register

_Request_

```json
{
  "name": "string",
  "password": "string",
}

```


_Response (200 - OK)_

```json
{
    "message": "berhasil mendaftar member",
    "data": {
        "id": 5,
        "code": "M005",
        "name": "testing raymond 5",
        "password": "$2a$10$ftjaO.qc4iAK5h/RUGXx8eg17G4C2BMh97xnlAJdnTr.xsWG0ACA2",
        "updatedAt": "2023-09-03T14:38:20.062Z",
        "createdAt": "2023-09-03T14:38:20.062Z"
    }
}

**code akan berupa increment jika ada member baru yang mendaftar**
```

_Response (400 - Bad Request)_

```json
{
    "message": "nama sudah terdaftar, silahkan login dengan nama tersebut atau register menggunakan nama lain"
}
{
    "message": "nama dan password tidak boleh kosong"
}
```

_Response (500 - Internal Server Eror)_

```json
{
  "message" : "Validation error"
}
{
  "message": "Invalid Server error"
}
```

## 2. POST /member/login

Description : Login user
http://localhost:3000/member/login

_Request_

_body_

```json
{
  "code": "string",
  "password": "string",
}

```

_Response (200 - OK)_

```json
{
    "message": "Login Success",
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiY29kZSI6Ik0wMDEiLCJpYXQiOjE2OTM3NTIxMDF9.miiuy2xtvq5P3K5OVXg7VwEdAEvGcWscAFKV1Rawo3A",
    "findMember": {
        "id": 1,
        "code": "M001",
        "name": "testing raymond 1",
        "password": "$2a$10$zPoC/mDajDDvRURmjs/l0OQIv28Q.ECJcwzpn7mR3BR71XWDk4hqi",
        "isPenalized": true,
        "bookBorrowed": 0,
        "createdAt": "2023-09-02T17:47:39.000Z",
        "updatedAt": "2023-09-02T19:56:30.000Z"
    }
}

```

_Response (400 - Bad Request)_

```json
{
    "message": "nama dan password tidak boleh kosong"
}
```

_Response (400 - Not found)_

```json
{
    "message": "akun member dengan code M011 tidak ditemukan"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message" : "Validation error"
}
{
  "message": "Invalid Server error"
}
```
## 3. GET /member
Description : Get All Members from database
http://localhost:3000/member

_Response (200 - OK)_

```json
{
    "data": [
        {
            "id": 1,
            "code": "M001",
            "name": "testing raymond 1",
            "password": "$2a$10$zPoC/mDajDDvRURmjs/l0OQIv28Q.ECJcwzpn7mR3BR71XWDk4hqi",
            "isPenalized": false,
            "bookBorrowed": 0
        },
        {
            "id": 2,
            "code": "M002",
            "name": "testing raymond 2",
            "password": "$2a$10$3Nq39ia0jMYDBU4UlvlObu6WGtGagtqHcbhiKjIEXuh0Qw6WbroPC",
            "isPenalized": true,
            "bookBorrowed": 0
        },
    ]
}

```

_Response (500 - Bad Request)_

```json
{
  "message": "Invalid"
}
```

## 4. GET /books

Description : Get All books from database. Setiap buku yang masih ada stoknya akan ditampilkan.
http://localhost:3000/books

Request:

_header_
```json
{
  "access_token" : "fill access token that you get from login session"
}
```


_Response (200 - OK)_

```json
[
    {
        "id": 1,
        "code": "JK-45",
        "title": "Harry Potter",
        "author": "J.K Rowling",
        "stock": 5
    },
    {
        "id": 2,
        "code": "SHR-1",
        "title": "A Study in Scarlet",
        "author": "Arthur Conan Doyle",
        "stock": 6
    }
]

```
_Response (400 - Bad request)_

```json
{
    "message": "silahkan login terlebih dahulu untuk mendapatkan access token"
}
```
_Response (401 - Unauthorized)_

```json
{
    "message": "access token yang digunakan salah, silahkan login kembali"
}
```

_Response (500 - Bad Request)_

```json
{
  "message": "Invalid"
}
```


## 5. POST /books/borrow

Description : Meminjam buku. Selama stok masih ada, buku dapat dipinjam.
http://localhost:3000/books/borrow

Request:
_header_
```json
{
  "access_token" : "fill access token that you get from login session" //sring
}
```

_body_
```json
{
  "borrowDate" : "2023-09-03 02:13:35", //string
  "bookCode" : "JK-45", //integer
}
```

_Response (200 - OK)_

```json
{
    "message": "Sukses meminjam buku dengan code JK-45",
    "data": {
        "id": 21,
        "idMember": 5,
        "idBook": 1,
        "borrowDate": "2023-09-03T02:13:35.000Z",
        "updatedAt": "2023-09-03T14:55:59.147Z",
        "createdAt": "2023-09-03T14:55:59.147Z"
    }
}

```

_Response (400 - Bad Request)_

```json

{
    "message": "silahkan login terlebih dahulu untuk mendapatkan access token"
}
{
    "message": "silahkan isi tanggal peminjaman dan code buku"
}
{
    "message": "buku dengan code JK-45 sudah anda pinjam, silahkan masukkan code buku lain"
}
{
    "message": "anda sedang terkena penalti"
}
```
_Response (401 - Unauthorized)_

```json
{
    "message": "access token yang digunakan salah, silahkan login kembali"
}
```

_Response (404 - Not found)_

```json
{
    "message": "buku dengan code MM-1 tidak ditemukan di database kami"
}
```

_Response (500 - Bad Request)_

```json
{
  "message": "Invalid"
}
```

## 6. POST /books/return

Description : Member mengembalikan buku. Jika pengembalian sudah lebih dari 7 hari, member akan kena penalti.
http://localhost:3000/books/return

Request:
_params_
```json
{
  "id" : 9 //integer (id dari product)
}
```

_header_
```json
{
  "access_token" : "fill access token that you get from login session" //string
}
```

_body_
```json
{
  "returnDate" : "2023-09-23 02:13:35",
  "bookCode": "JK-45"
}
```

_Response (200 - OK)_

```json
{
    "message": "Sukses mengembalikan buka dengan code JK-45"
}
```

_Response (400 - Bad Request)_

```json
{
    "message": "masukkan tanggal pengembalian buku dan code buku"
}
```

_Response (401 - Unauthorized)_

```json
{
    "message": "silahkan login terlebih dahulu untuk mendapatkan access token"
}
```

_Response (404 - Not Found)_

```json
{
    "message": "buku dengan code GOR-4 tidak ditemukan"
}
{
    "message": "kamu sedang tidak meminjam buku dengan code GOT-4"
}

```

_Response (500 - Bad Request)_

```json
{
  "message": "Invalid"
}
```