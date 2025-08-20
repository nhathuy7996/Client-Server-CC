# Cocos-Server-Client Template

Một template game sử dụng Cocos Creator với tích hợp Telegram Web App và kết nối real-time thông qua Socket.IO.

## 📋 Mô tả

Project này là một template cơ bản cho việc phát triển game trên Cocos Creator với các tính năng:
- Tích hợp Telegram Web App để xác thực người dùng
- Kết nối real-time với server thông qua Socket.IO
- Hệ thống Lucky Spin (vòng quay may mắn)
- Quản lý avatar và thông tin người dùng
- API client để giao tiếp với backend

## 🚀 Tính năng chính

### 🔐 Xác thực Telegram Web App
- Tự động lấy thông tin người dùng từ Telegram
- Tạo token xác thực và lưu trữ local
- Hỗ trợ fallback với fake token cho development

### 🌐 Networking
- **Socket.IO Client**: Kết nối real-time với server
- **HTTP API Client**: Gửi request REST API
- **Singleton Pattern**: Quản lý kết nối mạng tập trung

### 🎰 Lucky Spin System
- Vòng quay may mắn với animation mượt mà
- Hỗ trợ nhiều loại item (Thief, Coin)
- Tùy chỉnh thời gian quay và số vòng

### 🎮 Game Management
- Responsive design với scaling tự động
- Hệ thống config tập trung

## 📁 Cấu trúc Project
### Client
```
assets/00_GAME/
├── Scenes/
│   └── GameMain.scene          # Scene chính của game
├── Scripts/
│   ├── Config.ts               # Cấu hình global
│   ├── game/
│   │   └── gameMain.ts         # Logic chính của game
│   ├── luckySpin/
│   │   ├── LuckySpin.ts        # Hệ thống vòng quay may mắn
│   │   └── itemSpin.ts         # Item trong vòng quay
│   ├── network/
│   │   ├── NetworkingPeer.ts   # Socket.IO client
│   │   ├── RequestBase.ts      # HTTP API client
│   │   └── socket.io-client.d.ts
│   └── utils/
│       ├── Singleton.ts        # Pattern Singleton
│       └── utils.ts            # Utility functions
```

### Server
```
build/Server/src/public                 --> Client sẽ được CC build vào đây
build-templates/web-mobiles/index.ejs   --> template build sẽ được sửa ở đây
```

## 🛠️ Cài đặt và Chạy

### Yêu cầu hệ thống
- Cocos Creator 3.8.7+
- Node.js 14+
- Server backend với Socket.IO

### Cài đặt dependencies
```bash
npm install
```

### Cấu hình
1. Mở file `assets/00_GAME/Scripts/Config.ts`
2. Cập nhật `host` URL để trỏ đến server của bạn:
```typescript
static host: string = 'http://your-server-url:port';
```

### Chạy project
1. Mở project trong Cocos Creator
2. Build và chạy trên platform mong muốn
3. Đảm bảo server backend đang chạy

## 🔧 Cấu hình Server

### API Endpoints cần thiết
- `POST /api/auth/telegram` - Xác thực Telegram user
- `GET /proxy-image` - Proxy để load avatar từ URL

### Socket.IO Events
- Kết nối với token xác thực
- Hỗ trợ các event tùy chỉnh

## 📱 Telegram Web App Integration

### Setup Telegram Bot
1. Tạo bot qua @BotFather
2. Cấu hình Web App URL
3. Thêm bot vào Telegram

### Web App Features
- Tự động expand và disable vertical swipes
- Lấy thông tin user từ `initData`
- Load avatar thông qua proxy

## 🎮 Sử dụng Lucky Spin

```typescript
// Thêm component LuckySpin vào scene
// Cấu hình items và parameters
// Gọi method spin() để quay
luckySpinComponent.spin();
```

## 🔄 Game States

```typescript
enum GAMESTATE {
   READY = 1,    // Sẵn sàng
   PLAYING = 2,  // Đang chơi
   PAUSE = 3,    // Tạm dừng
   OVER = 4,     // Kết thúc
}
```

## 🌐 Networking Usage

### Socket.IO
```typescript
// Kết nối
NetworkingPeer.connectToWebSocket();

// Thêm listener
NetworkingPeer.AddListener('eventName', (data) => {
    console.log('Received:', data);
});

// Gửi event
NetworkingPeer.EmmitEvent('eventName', data);
```

### HTTP API
```typescript
// Tạo request
let request = new RequestBase('/api/endpoint', METHOD.POST);
request.Send(data, (response) => {
    console.log('Response:', response);
});
```

## 🎨 Customization

### Thêm item mới cho Lucky Spin
1. Tạo class mới kế thừa từ `itemSpin`
2. Thêm vào enum `LuckySpinType`
3. Cấu hình trong scene

### Thêm game state mới
1. Cập nhật enum `GAMESTATE`
2. Thêm logic xử lý trong `gameMain.ts`

## 🐛 Troubleshooting

### Lỗi kết nối Socket
- Kiểm tra server có đang chạy không
- Verify token xác thực
- Check CORS settings

### Lỗi load avatar
- Kiểm tra proxy endpoint
- Verify URL avatar có hợp lệ
- Check network permissions

### Telegram Web App không hoạt động
- Đảm bảo chạy trên HTTPS
- Check bot configuration
- Verify Web App URL

## 📄 License

Template này được phát triển cho mục đích học tập và phát triển game.

## 🤝 Contributing

1. Fork project
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## 📞 Support

Nếu có vấn đề hoặc câu hỏi, vui lòng tạo issue trên repository.

---

**Lưu ý**: Đây là template cơ bản, bạn cần customize theo yêu cầu cụ thể của game.
