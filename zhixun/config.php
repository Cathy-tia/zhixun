<?php
// 数据库配置
$host = 'localhost';
$dbname = 'zhixun'; // 请根据您的数据库名称修改
$username = 'root';    // XAMPP默认用户名
$password = '';        // XAMPP默认密码为空

try {
    // 创建PDO连接
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    
    // 设置PDO错误模式为异常
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // 设置默认的获取模式为关联数组
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    
} catch(PDOException $e) {
    die("数据库连接失败: " . $e->getMessage());
}
?>