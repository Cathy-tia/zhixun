// 微信登录配置管理
class WechatLoginManager {
    constructor() {
        this.config = {
            appId: 'YOUR_WECHAT_APP_ID', // 需要替换为实际的AppID
            redirectUri: encodeURIComponent(window.location.origin + '/wechat-callback.html'),
            scope: 'snsapi_login',
            statePrefix: 'wechat_login_'
        };
        this.isProcessing = false;
    }

    // 生成防CSRF的state参数
    generateState() {
        return this.config.statePrefix + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // 构建微信授权URL
    buildAuthUrl() {
        const state = this.generateState();
        localStorage.setItem('wechat_state', state);
        
        return `https://open.weixin.qq.com/connect/qrconnect?appid=${this.config.appId}&redirect_uri=${this.config.redirectUri}&response_type=code&scope=${this.config.scope}&state=${state}#wechat_redirect`;
    }

    // 跳转到微信授权页面
    redirectToWechatAuth() {
        if (this.isProcessing) {
            this.showMessage('正在处理中，请稍候...', 'warning');
            return;
        }
        
        // 检查是否同意协议
        if (!this.checkAgreement()) {
            return;
        }
        
        this.isProcessing = true;
        
        // 在实际环境中直接跳转
        // window.location.href = this.buildAuthUrl();
        
        // 演示环境：模拟微信登录过程
        this.simulateWechatLogin();
    }

    // 模拟微信登录过程
    simulateWechatLogin() {
        this.showMessage('正在连接到微信...', 'info');
        
        setTimeout(() => {
            this.showMessage('微信授权成功！', 'success');
            
            // 模拟获取用户信息
            const userInfo = {
                openid: 'wx_' + Date.now(),
                nickname: '微信用户' + Math.floor(Math.random() * 1000),
                avatar: 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132'
            };
            
            // 保存用户信息
            localStorage.setItem('current_user', JSON.stringify(userInfo));
            localStorage.setItem('login_type', 'wechat');
            
            // 跳转到学校信息填写页面
            setTimeout(() => {
                window.location.href = 'school.html';
            }, 1500);
            
            this.isProcessing = false;
        }, 2000);
    }

    // 检查用户协议
    checkAgreement() {
        const agreeCheck = document.getElementById('agreeCheck');
        if (!agreeCheck.checked) {
            this.showMessage('请先同意用户协议和隐私政策', 'error');
            return false;
        }
        return true;
    }

    // 显示消息
    showMessage(message, type = 'info') {
        // 移除现有的消息
        const existingMsg = document.querySelector('.message-toast');
        if (existingMsg) {
            existingMsg.remove();
        }

        const toast = document.createElement('div');
        toast.className = `message-toast message-${type}`;
        
        // 根据类型添加图标
        const icon = this.getMessageIcon(type);
        toast.innerHTML = `${icon}<span>${message}</span>`;
        
        // 添加样式
        if (!document.getElementById('message-styles')) {
            const styles = document.createElement('style');
            styles.id = 'message-styles';
            styles.textContent = `
                .message-toast {
                    position: fixed;
                    top: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    padding: 12px 24px;
                    border-radius: 8px;
                    color: white;
                    font-size: 14px;
                    font-weight: 500;
                    z-index: 1000;
                    animation: slideDown 0.3s ease;
                    max-width: 80%;
                    text-align: center;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                }
                .message-success { 
                    background-color: #4CAF50;
                    border-left: 4px solid #2E7D32;
                }
                .message-error { 
                    background-color: #f44336;
                    border-left: 4px solid #C62828;
                }
                .message-warning { 
                    background-color: #ff9800;
                    border-left: 4px solid #EF6C00;
                }
                .message-info { 
                    background-color: #2196F3;
                    border-left: 4px solid #1565C0;
                }
                .message-toast i {
                    font-size: 16px;
                }
                @keyframes slideDown {
                    from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
                    to { transform: translateX(-50%) translateY(0); opacity: 1; }
                }
            `;
            document.head.appendChild(styles);
        }
        
        document.body.appendChild(toast);
        
        // 3秒后自动消失
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 3000);
    }

    // 获取消息图标
    getMessageIcon(type) {
        const icons = {
            success: '<i class="fas fa-check-circle"></i>',
            error: '<i class="fas fa-exclamation-triangle"></i>',
            warning: '<i class="fas fa-exclamation-circle"></i>',
            info: '<i class="fas fa-info-circle"></i>'
        };
        return icons[type] || icons.info;
    }
}

// 手机号登录/注册管理
class PhoneLoginManager {
    constructor() {
        this.isCountingDown = false;
        this.countdownTime = 60;
        this.currentCountdown = 0;
    }

    // 获取验证码
    getVerificationCode() {
        const phoneInput = document.getElementById('phoneInput');
        const phoneNumber = phoneInput.value.trim();
        
        // 验证手机号格式
        if (!this.validatePhoneNumber(phoneNumber)) {
            this.showMessage('请输入正确的手机号码', 'error');
            return;
        }
        
        // 检查是否同意协议
        if (!this.checkAgreement()) {
            return;
        }
        
        // 防止重复点击
        if (this.isCountingDown) {
            return;
        }
        
        this.isCountingDown = true;
        this.startCountdown();
        
        // 模拟发送验证码
        this.simulateSendCode(phoneNumber);
    }

    // 验证手机号格式
    validatePhoneNumber(phone) {
        const phoneRegex = /^1[3-9]\d{9}$/;
        return phoneRegex.test(phone);
    }

    // 开始倒计时
    startCountdown() {
        const codeBtn = document.getElementById('getCodeBtn');
        this.currentCountdown = this.countdownTime;
        
        const countdownInterval = setInterval(() => {
            codeBtn.textContent = `${this.currentCountdown}秒后重发`;
            codeBtn.disabled = true;
            
            if (this.currentCountdown <= 0) {
                clearInterval(countdownInterval);
                codeBtn.textContent = '获取验证码';
                codeBtn.disabled = false;
                this.isCountingDown = false;
            }
            
            this.currentCountdown--;
        }, 1000);
    }

    // 模拟发送验证码
    simulateSendCode(phoneNumber) {
        // 生成随机验证码（演示用）
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        // 保存验证码到本地存储（实际项目中应该由后端发送）
        localStorage.setItem('verification_code', verificationCode);
        localStorage.setItem('verification_phone', phoneNumber);
        localStorage.setItem('code_timestamp', Date.now().toString());
        
        this.showMessage(`验证码已发送至 ${phoneNumber}（演示码：${verificationCode}）`, 'success');
    }

    // 手机号登录/注册
    phoneLogin() {
        const phoneInput = document.getElementById('phoneInput');
        const codeInput = document.getElementById('codeInput');
        
        const phoneNumber = phoneInput.value.trim();
        const code = codeInput.value.trim();
        
        // 验证输入
        if (!this.validatePhoneNumber(phoneNumber)) {
            this.showMessage('请输入正确的手机号码', 'error');
            return;
        }
        
        if (!code) {
            this.showMessage('请输入验证码', 'error');
            return;
        }
        
        // 检查是否同意协议
        if (!this.checkAgreement()) {
            return;
        }
        
        // 验证验证码
        if (!this.verifyCode(phoneNumber, code)) {
            this.showMessage('验证码错误或已过期', 'error');
            return;
        }
        
        // 执行登录/注册
        this.performPhoneLogin(phoneNumber);
    }

    // 验证验证码
    verifyCode(phoneNumber, code) {
        const storedCode = localStorage.getItem('verification_code');
        const storedPhone = localStorage.getItem('verification_phone');
        const timestamp = parseInt(localStorage.getItem('code_timestamp') || '0');
        
        // 验证码有效期5分钟
        const isExpired = Date.now() - timestamp > 5 * 60 * 1000;
        
        return !isExpired && storedPhone === phoneNumber && storedCode === code;
    }

    // 执行手机号登录/注册
    performPhoneLogin(phoneNumber) {
        this.showMessage('正在登录...', 'info');
        
        setTimeout(() => {
            // 模拟用户信息
            const userInfo = {
                phone: phoneNumber,
                nickname: '手机用户' + phoneNumber.slice(-4),
                avatar: 'https://via.placeholder.com/100x100/6A1B9A/FFFFFF?text=' + phoneNumber.slice(-2),
                registered: !localStorage.getItem('user_' + phoneNumber) // 检查是否为新用户
            };
            
            // 保存用户信息
            localStorage.setItem('current_user', JSON.stringify(userInfo));
            localStorage.setItem('login_type', 'phone');
            localStorage.setItem('user_' + phoneNumber, 'registered');
            
            this.showMessage(userInfo.registered ? '注册成功！' : '登录成功！', 'success');
            
            // 跳转到学校信息填写页面
            setTimeout(() => {
                window.location.href = 'school.html';
            }, 1500);
        }, 1000);
    }

    // 检查用户协议
    checkAgreement() {
        const agreeCheck = document.getElementById('agreeCheck');
        if (!agreeCheck.checked) {
            this.showMessage('请先同意用户协议和隐私政策', 'error');
            return false;
        }
        return true;
    }

    // 显示消息（复用微信登录的消息系统）
    showMessage(message, type = 'info') {
        // 移除现有的消息
        const existingMsg = document.querySelector('.message-toast');
        if (existingMsg) {
            existingMsg.remove();
        }

        const toast = document.createElement('div');
        toast.className = `message-toast message-${type}`;
        
        // 根据类型添加图标
        const icon = this.getMessageIcon(type);
        toast.innerHTML = `${icon}<span>${message}</span>`;
        
        document.body.appendChild(toast);
        
        // 3秒后自动消失
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 3000);
    }

    // 获取消息图标
    getMessageIcon(type) {
        const icons = {
            success: '<i class="fas fa-check-circle"></i>',
            error: '<i class="fas fa-exclamation-triangle"></i>',
            warning: '<i class="fas fa-exclamation-circle"></i>',
            info: '<i class="fas fa-info-circle"></i>'
        };
        return icons[type] || icons.info;
    }
}

// 主应用类
class LoginApp {
    constructor() {
        this.wechatManager = new WechatLoginManager();
        this.phoneManager = new PhoneLoginManager();
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkLoginStatus();
    }

    // 绑定事件
    bindEvents() {
        // 微信登录按钮
        document.getElementById('wechatLoginBtn').addEventListener('click', () => {
            this.wechatManager.redirectToWechatAuth();
        });

        // 获取验证码按钮
        document.getElementById('getCodeBtn').addEventListener('click', () => {
            this.phoneManager.getVerificationCode();
        });

        // 手机登录按钮
        document.getElementById('phoneLoginBtn').addEventListener('click', () => {
            this.phoneManager.phoneLogin();
        });

        // 输入框回车事件
        document.getElementById('phoneInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.phoneManager.getVerificationCode();
            }
        });

        document.getElementById('codeInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.phoneManager.phoneLogin();
            }
        });

        // 用户协议复选框
        document.getElementById('agreeCheck').addEventListener('change', (e) => {
            this.updateButtonStates();
        });
    }

    // 检查登录状态
    checkLoginStatus() {
        const currentUser = localStorage.getItem('current_user');
        if (currentUser && window.location.pathname.includes('login.html')) {
            // 如果已登录，直接跳转到主页面
            window.location.href = 'main.html';
        }
    }

    // 更新按钮状态
    updateButtonStates() {
        const agreeCheck = document.getElementById('agreeCheck');
        const wechatBtn = document.getElementById('wechatLoginBtn');
        const phoneBtn = document.getElementById('phoneLoginBtn');
        const codeBtn = document.getElementById('getCodeBtn');
        
        if (!agreeCheck.checked) {
            wechatBtn.style.opacity = '0.6';
            phoneBtn.style.opacity = '0.6';
            codeBtn.style.opacity = '0.6';
            wechatBtn.disabled = true;
            phoneBtn.disabled = true;
            codeBtn.disabled = true;
        } else {
            wechatBtn.style.opacity = '1';
            phoneBtn.style.opacity = '1';
            codeBtn.style.opacity = '1';
            wechatBtn.disabled = false;
            phoneBtn.disabled = false;
            codeBtn.disabled = !this.phoneManager.isCountingDown;
        }
    }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new LoginApp();
});

// 工具函数：格式化手机号显示
function formatPhoneNumber(phone) {
    if (phone.length === 11) {
        return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1****$3');
    }
    return phone;
}