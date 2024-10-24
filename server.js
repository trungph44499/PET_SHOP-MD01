const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); // Import bcrypt
const User = require('./Model/UserModel'); // Import user model

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://thuyltph35992:08072004Thuy@cluster0.smo2w.mongodb.net/PetsShop')
  .then(() => console.log('Kết nối MongoDB thành công'))
  .catch(err => console.error('Lỗi kết nối MongoDB:', err));

// Route đăng ký người dùng
app.post('/register', async (req, res) => {
    const { fullname, email, pass, avatar, role } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email đã tồn tại' });
        }

        // Hash mật khẩu trước khi lưu
        const hashedPassword = await bcrypt.hash(pass, 10);

        const newUser = new User({
            fullname,
            email,
            pass: hashedPassword,  // Lưu mật khẩu đã được hash
            avatar,
            role,
        });

        await newUser.save();
        res.status(201).json({ message: 'Đăng ký thành công', user: newUser });
    } catch (error) {
        console.error('Lỗi đăng ký:', error.message);
        res.status(500).json({ message: 'Đăng ký thất bại', error: error.message });
    }
});

// Route đăng nhập người dùng
app.post('/login', async (req, res) => {
    const { email, pass } = req.body;

    try {
        // Tìm người dùng bằng email
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(400).json({ message: 'Email không tồn tại' });
        }

        // So sánh mật khẩu đã nhập với mật khẩu đã hash
        const match = await bcrypt.compare(pass, existingUser.pass);
        if (!match) {
            return res.status(400).json({ message: 'Mật khẩu không chính xác' });
        }

        // Đăng nhập thành công
        res.status(200).json({ message: 'Đăng nhập thành công', user: existingUser });
    } catch (error) {
        console.error('Lỗi đăng nhập:', error.message);
        res.status(500).json({ message: 'Đăng nhập thất bại', error: error.message });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server đang chạy trên cổng ${PORT}`);
});
