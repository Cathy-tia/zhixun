# 智寻 - AI 智能失物招领系统

## 数据库连接配置说明

### 第一步：启动 XAMPP 服务

1. 打开 XAMPP 控制面板
2. 启动 Apache 和 MySQL 服务
3. 确保 MySQL 服务正常运行（端口 3306）

### 第二步：初始化数据库

1. 在浏览器中访问：`http://localhost/智寻---ai智能失物招领系统/init_db.php`
2. 系统会自动创建数据库和用户表
3. 会创建一个测试用户：邮箱 `test@example.com`，密码 `123456`

### 第三步：测试登录功能

1. 访问登录页面：`http://localhost/智寻---ai智能失物招领系统/login.html`
2. 使用测试账号登录或注册新账号

## 文件说明

- `login.html` - 登录/注册页面
- `login.php` - 登录处理脚本
- `register.php` - 注册处理脚本
- `config.php` - 数据库配置文件
- `init_db.php` - 数据库初始化脚本
- `main.html` - 主页面（登录后跳转）

## 数据库配置

- 主机：localhost
- 数据库名：zhixun
- 用户名：root
- 密码：（空）

## 注意事项

1. 确保 XAMPP 的 MySQL 服务已启动
2. 所有 PHP 文件必须通过 HTTP 服务器访问（不能直接双击打开）
3. 如果修改了 XAMPP 的 MySQL 密码，需要相应修改 config.php 文件
4. 系统会自动创建数据库和表结构，无需手动操作
