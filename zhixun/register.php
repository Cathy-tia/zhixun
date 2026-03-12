<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nickname = trim($_POST['nickname'] ?? '');
    $contact = trim($_POST['contact'] ?? '');
    $password = $_POST['password'] ?? '';

    // 验证输入
    if (empty($nickname) || empty($contact) || empty($password)) {
        die('所有字段都不能为空');
    }

    if (strlen($password) < 6) {
        die('密码长度至少6位');
    }

    try {
        // 检查用户是否已存在
        $stmt = $pdo->prepare("SELECT id FROM users WHERE contact = ?");
        $stmt->execute([$contact]);
        
        if ($stmt->fetch()) {
            header('Location: login.html?error=registered');
            exit;
        }

        // 插入新用户
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("INSERT INTO users (nickname, contact, password) VALUES (?, ?, ?)");
        $stmt->execute([$nickname, $contact, $hashed_password]);
        
        // 注册成功，自动登录
        session_start();
        $_SESSION['user_id'] = $pdo->lastInsertId();
        $_SESSION['nickname'] = $nickname;
        
        // 将用户信息存储到localStorage并跳转
        echo '<script>localStorage.setItem("current_user", JSON.stringify({"id": "' . $_SESSION['user_id'] . '", "nickname": "' . $nickname . '", "contact": "' . $contact . '"})); window.location.href="main.html";</script>';
        exit;
        
    } catch(PDOException $e) {
        die('注册失败: ' . $e->getMessage());
    }
} else {
    http_response_code(405);
    echo 'Method Not Allowed';
}
?>