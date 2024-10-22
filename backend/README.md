# Những điều bạn cần biết về backend

# Để chạy được
1. Sửa URL_DATABASE trong bin/www.js
2. Với ai đang dùng mongodb ở bên web url có dạng mongodb+srv... thì vào Database Access chọn Edit chọn Built-in Role nếu nó là Only read any database thì sửa thành Read and write to any database

# Tìm và sửa ip
- Mở command gõ ipconfig tìm ipv4 sau đó sửa URL ở HomeScreen

# Các bảng đang được sử dụng
# Dữ liệu được đính kèm trong các thư mục, import vào mongodb là được
- products
- users
- carts
- admins

# Các router
- users/register (Đăng kí)
- users/login (Đăng nhập)
- users/getUser (Lấy thông tin người dùng)
- users/getAllUser (Lấy toàn bộ danh sách người dùng)
- users/update (Có thể update toàn bộ thông tin hoặc update riêng lẻ, nếu không muốn update thông tin nào
thì không gửi thông tin đó lên, ví dụ chỉ muốn update mật khẩu thì chỉ cần gửi email và mật khẩu lên)
- users/delete(Xoá người dùng dựa trên email)

- products/ (Lấy danh sách sản phẩm)
- carts/addToCart (Thêm vào giỏ hàng)
- carts/getFromCart (Lấy sản phẩm từ giỏ hàng)
- admins


