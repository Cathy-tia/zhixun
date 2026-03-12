<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $contact = trim($_POST['contact'] ?? '');
    $password = $_POST['password'] ?? '';

    if (empty($contact) || empty($password)) {
        die('邮箱/手机号和密码不能为空');
    }

    // 查询用户
    $stmt = $pdo->prepare("SELECT * FROM users WHERE contact = ?");
    $stmt->execute([$contact]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['password'])) {
        // 登录成功，启动session
        session_start();
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['nickname'] = $user['nickname'];
        // 将用户信息存储到localStorage（通过JavaScript）
        echo '<script>localStorage.setItem("current_user", JSON.stringify({"id": "' . $user['id'] . '", "nickname": "' . $user['nickname'] . '", "contact": "' . $user['contact'] . '"})); window.location.href="main.html";</script>';
        exit;
    } else {
        die('邮箱/手机号或密码错误');
    }
} else {
    http_response_code(405);
    echo 'Method Not Allowed';
}
?>