import pool from "../configs/connectDB.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

const postToCart = async (req, res) => {
    try {
        const [rows, fields] = await pool.execute(`SELECT * FROM orders`)
        console.log(rows);
        const { status, userId, products, address, phone } = req.body
        await pool.execute(`INSERT INTO orders(status, userId, products, address, phone) VALUES(?, ?, ?, ?, ?)`, [status, userId, products, address, phone])
        return res.status(200).json({
            message: 'Success'
        })
    } catch (error) {

    }
}
const getProduct = async (req, res) => {
    try {
        const [rows, fields] = await pool.execute(`SELECT * FROM products`)
        return res.status(200).json({
            data: rows
        })
    } catch (error) {
        console.log(error);
    }
}
const register = async (req, res) => {
    try {
        const [rows, fields] = await pool.execute(`SELECT * FROM accounts WHERE username = ?`, [req.body.username]);

        if (rows.length > 0) {
            return res.status(409).json({
                message: 'user already exists'
            })
        }

        // Create new account

        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(req.body.password, salt);
        const { username, email, fullName, address, phoneNumber } = req.body
        await pool.execute('INSERT INTO accounts(username, password, email, fullName, address, phoneNumber) VALUES (?, ?, ?, ?, ?, ?)', [username, hashPassword, email, fullName, address, phoneNumber]);

        return res.status(200).json({
            message: 'User has been created'
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

const login = async (req, res) => {
    try {

        const [rows, fields] = await pool.execute(`SELECT * FROM accounts WHERE username = ?`, [req.body.username])
        if (rows.length === 0) {
            return res.status(404).json({
                message: ' Cannot find this username'
            })
        }
        const checkedPassword = await bcrypt.compare(req.body.password, rows[0].password)
        if (checkedPassword) {
            const token = jwt.sign({ username: req.body.username }, 'T0p_Secret');
            res.cookie('accessToken', token, { httpOnly: true }).status(200).json({
                message: 'Success',
                data: { token, userId: rows[0].userId, fullName: rows[0].fullName }
            })
        }
        if (!checkedPassword) {
            return res.status(401).json({
                message: 'Wrong password'
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal Server Error'
        })
    }
}
const logout = async (req, res) => {
    res.clearCookie("accessToken", {
        secure: true,
        sameSite: "none"
    }).status(200).json("User has been logged out")
}
const getOrders = async (req, res) => {
    try {
        const [rows, fields] = await pool.execute('SELECT * FROM orders');
        const filteredProducts = [];

        rows.forEach(order => {
            const productArray = JSON.parse(order.products);

            if (Array.isArray(productArray)) {
                // Chỉ lấy productId và quantity từ mảng products
                const filteredOrder = {
                    ...order,
                    products: productArray.map(product => ({
                        productId: product.productId,
                        quantity: product.quantity
                    }))
                };
                // Thêm các sản phẩm vào mảng filteredProducts
                filteredProducts.push(filteredOrder);
            }
        });

        return res.status(200).json({
            data: filteredProducts
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}
export default {
    register,
    login,
    logout,
    getProduct,
    postToCart,
    getOrders
}