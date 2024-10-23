# Những điều bạn cần biết về backend

# Để chạy được
1. Sửa URL_DATABASE trong bin/www.js
2. Với ai đang dùng mongodb ở bên web url có dạng mongodb+srv... thì vào Database Access chọn Edit chọn Built-in Role nếu nó là Only read any database thì sửa thành Read and write to any database

# Tìm và sửa ip
- Mở command gõ ipconfig tìm ipv4 sau đó sửa URL ở HomeScreen

# Các bảng đang được sử dụng
- products
- users
- carts
- admins

# Thông tin router user
- users/register (Đăng kí)
- users/login (Đăng nhập)
- users/getUser (Lấy thông tin người dùng)
- users/getAllUser (Lấy toàn bộ danh sách người dùng)
- users/update (Có thể update toàn bộ thông tin hoặc update riêng lẻ, nếu không muốn update thông tin nào
thì không gửi thông tin đó lên, ví dụ chỉ muốn update mật khẩu thì chỉ cần gửi email và mật khẩu lên)
- users/delete(Xoá người dùng dựa trên email)

# Thông tin router products
- products/ (Lấy danh sách sản phẩm)
- products/add (Thêm sản phẩm)
- products/update (Sửa sản phẩm)
- products/delete (Xoá sản phẩm)

# Thông tin router cart
- carts/addToCart (Thêm vào giỏ hàng)
- carts/getFromCart (Lấy sản phẩm từ giỏ hàng)

# Lưu ý với bảng admin
- Chỉ có 1 admin có tài khoản là "admin"
- admin có thể thao tác với tài khoản nhân viên

# Thông tin router admin
- admins/ (Lấy danh sách nhân viên)
- admin/add (Thêm nhân viên)
- admin/update (Sửa thông tin nhân viên)
- admin/delete (Xoá nhân viên)


