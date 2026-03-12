<?php
// 不依赖config.php，直接创建数据库连接

try {
    // 创建数据库（如果不存在）
    $pdo_temp = new PDO("mysql:host=localhost", "root", "");
    $pdo_temp->exec("CREATE DATABASE IF NOT EXISTS zhixun CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
    
    echo "数据库创建成功或已存在<br>";
    
    // 重新连接到指定数据库
    $pdo = new PDO("mysql:host=localhost;dbname=zhixun;charset=utf8mb4", "root", "");
    
    // 创建用户表
    $sql = "CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nickname VARCHAR(50) NOT NULL,
        contact VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )";
    
    $pdo->exec($sql);
    echo "用户表创建成功或已存在<br>";
    
    // 检查是否有测试用户，如果没有则创建一个
    $stmt = $pdo->query("SELECT COUNT(*) FROM users");
    $count = $stmt->fetchColumn();
    
    if ($count == 0) {
        $test_password = password_hash("123456", PASSWORD_DEFAULT);
        $sql = "INSERT INTO users (nickname, contact, password) VALUES (?, ?, ?)";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(["测试用户", "test@example.com", $test_password]);
        echo "测试用户创建成功 (邮箱: test@example.com, 密码: 123456)<br>";
    }
    
    echo "数据库初始化完成！<br>";
    echo "<a href='login.html'>返回登录页面</a>";
    
} catch(PDOException $e) {
    die("数据库初始化失败: " . $e->getMessage());
}
?>