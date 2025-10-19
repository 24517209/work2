# 慈善活动网站 - 中文启动指南

一个使用 Node.js、Express、MySQL 和原生 JavaScript 构建的完整动态慈善活动网站。

## 功能特性

### 🎯 核心功能
- **活动管理**: 创建、读取、更新和删除慈善活动
- **用户注册**: 用户可以注册参加活动，包含验证功能
- **管理面板**: 完整的活动管理后台界面
- **天气集成**: 为有坐标的活动显示天气预报
- **响应式设计**: 现代化、移动端友好的界面

### 🏗️ 架构设计
- **后端**: Node.js + Express RESTful API
- **数据库**: MySQL，具有适当的关系和约束
- **前端**: 原生 JavaScript 与 DOM 操作
- **样式**: 现代化 CSS 深色主题

## 数据库架构

### 活动表 (Events)
```sql
CREATE TABLE events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  date DATE NOT NULL,
  location VARCHAR(255) NOT NULL,
  description TEXT,
  status ENUM('upcoming', 'completed') DEFAULT 'upcoming',
  latitude DECIMAL(10, 8) NULL,
  longitude DECIMAL(11, 8) NULL
);
```

### 注册表 (Registrations)
```sql
CREATE TABLE registrations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  event_id INT NOT NULL,
  user_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  ticket_count INT DEFAULT 1,
  registration_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_registrations_event FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);
```

## API 接口

### 公共接口
- `GET /api/events` - 获取所有活动
- `GET /api/events/:id` - 获取活动详情及注册信息
- `POST /api/registrations` - 注册参加活动

### 管理接口
- `GET /api/admin/events` - 获取所有活动（管理员视图）
- `POST /api/admin/events` - 创建新活动
- `PUT /api/admin/events/:id` - 更新活动
- `DELETE /api/admin/events/:id` - 删除活动（带验证）

## 安装与配置

### 1. 克隆仓库
```bash
git clone <repository-url>
cd charity-events
```

### 2. 安装依赖
```bash
npm install
```

### 3. 数据库配置
```bash
# 创建数据库和表
mysql -u root -p < sql/schema.sql

# 插入示例数据
mysql -u root -p < sql/seed.sql
```

### 4. 环境配置
在根目录创建 `.env` 文件：
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=charityevents_db
PORT=3000
```

### 5. 启动服务器
```bash
npm start
```

### 6. 访问应用
- 主站: http://localhost:3000
- 管理面板: http://localhost:3000/admin/index.html

## 使用指南

### 用户使用
1. **浏览活动**: 访问首页查看即将举行的活动
2. **搜索活动**: 使用搜索页面按日期、地点或关键词筛选活动
3. **查看活动详情**: 点击任意活动查看完整详情和已注册参与者
4. **注册活动**: 点击"注册此活动"进行报名
5. **天气信息**: 有坐标的活动会显示天气预报

### 管理员使用
1. **访问管理面板**: 导航到 `/admin/index.html`
2. **管理活动**: 
   - 在网格布局中查看所有活动
   - 添加新活动，可选择添加坐标以显示天气
   - 编辑现有活动
   - 删除活动（仅当无注册记录时）
3. **活动验证**: 系统防止删除有注册记录的活动

## 关键功能说明

### 业务逻辑
- **每用户每活动一次注册**: 用户不能为同一活动多次注册
- **活动删除保护**: 有注册记录的活动无法删除
- **输入验证**: 前端和后端对所有表单进行验证
- **错误处理**: 全面的错误处理，提供用户友好的消息

### 天气集成
- 使用 Open-Meteo API（免费，无需 API 密钥）
- 显示天气图标、温度和描述
- 仅对有有效坐标的活动显示
- 天气数据不可用时优雅降级

### 安全特性
- 使用参数化查询防止 SQL 注入
- HTML 转义防止 XSS 攻击
- 输入验证和清理
- 适当的错误处理，不泄露敏感信息

## 文件结构

```
├── server/                    # 服务器端
│   ├── index.js              # 主服务器文件
│   ├── db/
│   │   └── event_db.js       # 数据库连接
│   └── routes/
│       ├── events.js         # 公共活动路由
│       ├── admin.js          # 管理活动路由
│       └── registrations.js  # 注册路由
├── public/                   # 前端文件
│   ├── index.html            # 首页
│   ├── search.html           # 搜索页面
│   ├── event-detail.html     # 活动详情页面
│   ├── register.html         # 注册页面
│   ├── admin/
│   │   ├── index.html        # 管理仪表板
│   │   ├── add-event.html    # 添加活动表单
│   │   └── edit-event.html   # 编辑活动表单
│   ├── js/
│   │   ├── home.js           # 首页逻辑
│   │   ├── search.js         # 搜索功能
│   │   ├── event-detail.js   # 活动详情逻辑
│   │   ├── register.js       # 注册逻辑
│   │   └── admin/
│   │       ├── admin-events.js
│   │       ├── add-event.js
│   │       └── edit-event.js
│   └── styles.css            # 主样式表
├── sql/                      # 数据库文件
│   ├── schema.sql            # 数据库架构
│   └── seed.sql              # 示例数据
└── package.json
```

## 测试应用

1. **启动服务器** 并访问 http://localhost:3000
2. **浏览活动** 在首页查看
3. **搜索活动** 使用不同筛选条件
4. **查看活动详情** 并查看注册信息
5. **注册活动** 使用注册表单
6. **访问管理面板** 管理活动
7. **测试天气集成** 使用有坐标的活动

## 示例数据

应用包含 10 个示例活动和 13 个示例注册，涵盖各种场景：
- 不同类型的活动（马拉松、研讨会、清洁活动等）
- 澳大利亚各地的不同地点
- 即将举行和已完成的活动混合
- 每个活动的多个注册
- 有坐标和无坐标的活动用于天气测试

## 浏览器兼容性

- 支持 ES6+ 的现代浏览器
- 响应式设计在移动端和桌面端都能正常工作
- 前端无外部依赖（除天气 API 外）

## 常见问题

### Q: 如何修改数据库连接信息？
A: 编辑 `.env` 文件中的数据库配置参数。

### Q: 如何添加新的活动类型？
A: 在数据库的 `events` 表中，`status` 字段可以扩展为包含更多状态。

### Q: 天气功能不工作怎么办？
A: 确保活动有有效的经纬度坐标，并检查网络连接。

### Q: 如何备份数据？
A: 使用 MySQL 的 mysqldump 命令备份数据库。

## 开发说明

### 添加新功能
1. 在 `server/routes/` 中添加新的路由文件
2. 在 `public/js/` 中添加对应的前端逻辑
3. 更新数据库架构（如需要）
4. 测试所有功能

### 部署到生产环境
1. 设置生产数据库
2. 配置环境变量
3. 使用 PM2 或类似工具管理进程
4. 配置反向代理（如 Nginx）

## 许可证

本项目用于教育目的。可自由使用和修改。

---

**注意**: 这是一个学习项目，展示了现代 Web 开发的最佳实践。在生产环境中使用前，请确保进行适当的安全审查和测试。