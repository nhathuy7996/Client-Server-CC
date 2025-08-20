# Game Server

Server cho game mini app trên Telegram, sử dụng Express.js và Socket.IO.

## Cấu trúc thư mục

```
src/
├── config/         # Cấu hình
│   └── redis.ts    # Cấu hình Redis adapter
├── controllers/     # Xử lý logic cho các request
│   ├── authController.ts    # Xử lý xác thực
│   ├── scoresController.ts # Xử lý điểm số
│   └── socketController.ts  # Xử lý kết nối socket
├── middleware/      # Middleware
│   └── auth.ts     # Middleware xác thực
├── routes/         # Định tuyến API
│   ├── auth.ts     # Route xác thực
│   └── scores.ts   # Route điểm số
├── types/          # TypeScript interfaces
│   └── index.ts    # Định nghĩa các interface
├── data/           # Dữ liệu
│   └── scores.ts   # Lưu trữ điểm số
└── server.ts       # File chính của server
```

## Cài đặt

1. Cài đặt dependencies:
```bash
npm install
```

2. Cài đặt Redis (cần thiết cho sticky session):
```bash
# Ubuntu/Debian
sudo apt-get install redis-server

# macOS
brew install redis

# Windows
# Tải Redis từ https://redis.io/download
```

3. Tạo file `.env` với các biến môi trường:
```env
HTTP_PORT=3103
JWT_SECRET=your-secret-key
BOT_TOKEN=your-telegram-bot-token
REDIS_URL=redis://localhost:6379
NODE_ENV=development
```

## Load Balancing và Sticky Session

Server được cấu hình để hỗ trợ load balancing với sticky session thông qua Redis adapter. Điều này đảm bảo:

1. Socket.IO connections được duy trì khi load balancing
2. Events được đồng bộ giữa các server instances
3. Session được lưu trữ an toàn

### Cấu hình Load Balancer

Khi sử dụng load balancer (ví dụ: Nginx), cần cấu hình sticky session:

```nginx
upstream socket_nodes {
    ip_hash;
    server 192.168.1.100:3103;  # Server 1
    server 192.168.1.101:3103;  # Server 2
    server 192.168.1.102:3103;  # Server 3
}

server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://socket_nodes;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Cấu hình timeout
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

### Cấu hình Redis

Redis được sử dụng để đồng bộ socket events giữa các server instances. Có hai cách cấu hình Redis:

#### 1. Redis Local (Development)
Khi chạy Redis trên cùng máy chủ:
```env
REDIS_URL=redis://localhost:6379
```

#### 2. Redis Remote (Production)
Khi các server instances nằm phân tán trên các máy chủ khác nhau, cần cấu hình Redis với xác thực:
```env
REDIS_URL=redis://your-redis-host:6379
REDIS_USERNAME=your-redis-username
REDIS_PASSWORD=your-redis-password
```

Lưu ý:
- Đảm bảo Redis server đã được cấu hình với xác thực (ACL)
- URL Redis có thể bao gồm thông tin xác thực: `redis://username:password@host:port`
- Nên sử dụng SSL/TLS cho kết nối Redis trong môi trường production
- Có thể sử dụng Redis Cloud hoặc các dịch vụ Redis managed khác

## API Endpoints

### Xác thực
- `POST /api/auth/telegram`
  - Xác thực người dùng từ Telegram Mini App
  - Body: `{ initData: string }`
  - Trả về JWT token và thông tin người dùng

### Điểm số
- `POST /api/scores`
  - Lưu điểm số mới
  - Body: `{ username: string, score: number }`
  - Yêu cầu xác thực qua token

- `GET /api/scores`
  - Lấy danh sách điểm số cao nhất
  - Query params: `limit` (mặc định: 10)
  - Không yêu cầu xác thực

## Socket.IO Events

### Server -> Client
- `topScores`: Gửi danh sách điểm số cao nhất khi có cập nhật

### Client -> Server
- Kết nối yêu cầu token xác thực trong `auth` object

## Cách sử dụng ở phía Client

1. Xác thực với Telegram:
```typescript
const response = await fetch('http://localhost:3103/api/auth/telegram', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        initData: window.Telegram.WebApp.initData
    })
});

const data = await response.json();
if (data.success) {
    const token = data.data.token;
    // Lưu token để sử dụng cho Socket.IO
}
```

2. Kết nối Socket.IO:
```typescript
const socket = io('http://localhost:3103', {
    auth: { token: 'your-jwt-token' },
    transports: ['websocket', 'polling'],
    withCredentials: true
});

socket.on('topScores', (scores) => {
    // Xử lý cập nhật điểm số
});
```

3. Gửi điểm số:
```typescript
const response = await fetch('http://localhost:3103/api/scores', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
        username: 'player1',
        score: 100
    })
});
```

## Tính năng

- Xác thực người dùng qua Telegram Mini App
- Lưu trữ và cập nhật điểm số realtime
- Thông báo Discord khi có điểm số mới
- Giới hạn top 100 điểm số cao nhất
- CORS enabled cho cross-origin requests
- Logging requests
- Error handling
- Sticky session cho load balancing
- Redis adapter cho đồng bộ socket events 