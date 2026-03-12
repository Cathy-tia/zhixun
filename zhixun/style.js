// 微信登录配置管理
class WechatLoginManager {
    constructor() {
        this.config = {
            appId: 'YOUR_WECHAT_APP_ID',
            redirectUri: encodeURIComponent(window.location.origin + '/wechat-callback.html'),
            scope: 'snsapi_login',
            statePrefix: 'wechat_login_'
        };
        this.isProcessing = false;
    }

    generateState() {
        return this.config.statePrefix + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    buildAuthUrl() {
        const state = this.generateState();
        localStorage.setItem('wechat_state', state);
        
        return `https://open.weixin.qq.com/connect/qrconnect?appid=${this.config.appId}&redirect_uri=${this.config.redirectUri}&response_type=code&scope=${this.config.scope}&state=${state}#wechat_redirect`;
    }

    redirectToWechatAuth() {
        if (this.isProcessing) {
            this.showMessage('正在处理中，请稍候...', 'warning');
            return;
        }
        
        this.isProcessing = true;
        const authUrl = this.buildAuthUrl();
        
        this.showAuthInfo(authUrl);
    }

    showAuthInfo(authUrl) {
        console.log('微信授权URL:', authUrl);
        
        const modal = this.createAuthModal(authUrl);
        document.body.appendChild(modal);
        
        setTimeout(() => {
            this.simulateWechatAuth();
        }, 3000);
    }

    createAuthModal(authUrl) {
        const modal = document.createElement('div');
        modal.className = 'wechat-auth-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>微信授权演示</h3>
                        <button class="close-btn">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="loading-spinner"></div>
                        <p>正在连接到微信开放平台...</p>
                        <div class="auth-info">
                            <p><strong>授权URL:</strong></p>
                            <code>${authUrl.substring(0, 100)}...</code>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        this.addModalStyles();
        
        modal.querySelector('.close-btn').addEventListener('click', () => {
            modal.remove();
            this.isProcessing = false;
        });
        
        return modal;
    }

    addModalStyles() {
        if (document.getElementById('wechat-modal-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'wechat-modal-styles';
        styles.textContent = `
            .wechat-auth-modal .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(106, 27, 154, 0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }
            .wechat-auth-modal .modal-content {
                background: white;
                padding: 30px;
                border-radius: 15px;
                max-width: 500px;
                width: 90%;
                color: #333;
            }
            .wechat-auth-modal .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            }
            .wechat-auth-modal .modal-header h3 {
                color: #6A1B9A;
                margin: 0;
            }
            .wechat-auth-modal .close-btn {
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                color: #999;
            }
            .wechat-auth-modal .loading-spinner {
                width: 40px;
                height: 40px;
                border: 3px solid #f3f3f3;
                border-top: 3px solid #6A1B9A;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 20px;
            }
            .wechat-auth-modal .auth-info {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 8px;
                margin-top: 20px;
                font-size: 12px;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(styles);
    }

    simulateWechatAuth() {
        const modal = document.querySelector('.wechat-auth-modal');
        if (!modal) return;
        
        const modalBody = modal.querySelector('.modal-body');
        modalBody.innerHTML = `
            <div style="text-align: center; color: green;">
                <i class="fas fa-check-circle" style="font-size: 48px; margin-bottom: 20px;"></i>
                <h3>授权成功！</h3>
                <p>正在获取用户信息...</p>
            </div>
        `;
        
        setTimeout(() => {
            this.handleWechatCallback();
            modal.remove();
        }, 2000);
    }

    handleWechatCallback() {
        const mockUserInfo = {
            openid: 'mock_openid_' + Date.now(),
            nickname: '微信用户',
            headimgurl: '',
            sex: 1,
            province: '北京',
            city: '北京',
            country: '中国'
        };
        
        this.saveUserInfo(mockUserInfo);
        
        this.showSuccessMessage(mockUserInfo);
        
        setTimeout(() => {
            window.location.href = 'main.html';
        }, 3000);
    }

    saveUserInfo(userInfo) {
        const userData = {
            ...userInfo,
            loginType: 'wechat',
            loginTime: new Date().toISOString(),
            sessionId: 'session_' + Date.now()
        };
        
        localStorage.setItem('currentUser', JSON.stringify(userData));
        localStorage.setItem('isLoggedIn', 'true');
    }

    showSuccessMessage(userInfo) {
        this.showMessage(`
            <div style="text-align: center;">
                <h3 style="color: #6A1B9A; margin-bottom: 10px;">登录成功！</h3>
                <p>欢迎回来，<strong>${userInfo.nickname}</strong></p>
                <p style="font-size: 12px; color: #666;">3秒后自动跳转到主页...</p>
            </div>
        `, 'success', 3000);
    }

    showMessage(content, type = 'info', duration = 3000) {
        const existingMsg = document.querySelector('.custom-message');
        if (existingMsg) existingMsg.remove();
        
        const message = document.createElement('div');
        message.className = `custom-message message-${type}`;
        message.innerHTML = content;
        
        this.addMessageStyles();
        
        document.body.appendChild(message);
        
        if (duration > 0) {
            setTimeout(() => {
                message.remove();
            }, duration);
        }
        
        return message;
    }

    addMessageStyles() {
        if (document.getElementById('message-styles')) return;
        
        const styles = document.createElement('style');
        styles.id = 'message-styles';
        styles.textContent = `
            .custom-message {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 8px;
                color: white;
                z-index: 1001;
                max-width: 300px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                animation: slideIn 0.3s ease;
            }
            .message-success { background: #4CAF50; }
            .message-error { background: #f44336; }
            .message-warning { background: #ff9800; }
            .message-info { background: #2196F3; }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(styles);
    }
}

const wechatManager = new WechatLoginManager();

document.addEventListener('DOMContentLoaded', function() {
    const wechatBtn = document.getElementById('wechatLoginBtn');
    const getCodeBtn = document.getElementById('getCodeBtn');
    const phoneLoginBtn = document.getElementById('phoneLoginBtn');
    const agreeCheck = document.getElementById('agreeCheck');
    const phoneInput = document.getElementById('phoneInput');
    const codeInput = document.getElementById('codeInput');

    if (phoneInput) {
        phoneInput.value = '13800138000';
    }
    if (codeInput) {
        codeInput.value = '123456';
    }

    wechatBtn.addEventListener('click', function() {
        if (!agreeCheck.checked) {
            wechatManager.showMessage('请先同意用户协议与隐私政策', 'warning');
            return;
        }
        wechatManager.redirectToWechatAuth();
    });

    class PhoneLoginManager {
        constructor() {
            this.countdown = 0;
            this.countdownInterval = null;
        }

        getVerificationCode() {
            const phone = phoneInput.value.trim();
            
            if (!this.validatePhone(phone)) {
                return;
            }

            this.startCountdown();
            
            this.simulateSendCode(phone);
        }

        validatePhone(phone) {
            if (!phone) {
                wechatManager.showMessage('请输入手机号', 'warning');
                return false;
            }
            
            if (!/^1\d{10}$/.test(phone)) {
                wechatManager.showMessage('请输入正确的11位手机号', 'warning');
                return false;
            }
            
            return true;
        }

        startCountdown() {
            this.countdown = 60;
            getCodeBtn.disabled = true;
            getCodeBtn.textContent = `${this.countdown}秒后重发`;
            
            this.countdownInterval = setInterval(() => {
                this.countdown--;
                getCodeBtn.textContent = `${this.countdown}秒后重发`;
                
                if (this.countdown <= 0) {
                    this.stopCountdown();
                }
            }, 1000);
        }

        stopCountdown() {
            if (this.countdownInterval) {
                clearInterval(this.countdownInterval);
                this.countdownInterval = null;
            }
            
            getCodeBtn.disabled = false;
            getCodeBtn.textContent = '获取验证码';
        }

        simulateSendCode(phone) {
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            
            console.log(`模拟发送验证码到 ${phone}: ${code}`);
            
            wechatManager.showMessage(`验证码已发送至尾号 ${phone.slice(-4)}`, 'success');
            
            setTimeout(() => {
                if (codeInput) {
                    codeInput.value = code;
                    wechatManager.showMessage('验证码已自动填充（演示功能）', 'info', 2000);
                }
            }, 1000);
        }

        phoneLogin() {
            if (!agreeCheck.checked) {
                wechatManager.showMessage('请先同意用户协议与隐私政策', 'warning');
                return;
            }
            
            const phone = phoneInput.value.trim();
            const code = codeInput.value.trim();

            if (!this.validateLoginForm(phone, code)) {
                return;
            }

            this.simulatePhoneLogin(phone, code);
        }

        validateLoginForm(phone, code) {
            if (!phone) {
                wechatManager.showMessage('请输入手机号', 'warning');
                return false;
            }
            
            if (!/^1\d{10}$/.test(phone)) {
                wechatManager.showMessage('手机号格式不正确', 'warning');
                return false;
            }
            
            if (!code) {
                wechatManager.showMessage('请输入验证码', 'warning');
                return false;
            }
            
            if (!/^\d{6}$/.test(code)) {
                wechatManager.showMessage('验证码必须是6位数字', 'warning');
                return false;
            }
            
            return true;
        }

        simulatePhoneLogin(phone, code) {
            phoneLoginBtn.disabled = true;
            const originalText = phoneLoginBtn.innerHTML;
            phoneLoginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 登录中...';
            
            setTimeout(() => {
                if (code === '123456' || /^\d{6}$/.test(code)) {
                    const userInfo = {
                        phone: phone,
                        nickname: `用户${phone.slice(-4)}`,
                        loginType: 'phone',
                        loginTime: new Date().toISOString(),
                        sessionId: 'session_' + Date.now()
                    };
                    
                    wechatManager.saveUserInfo(userInfo);
                    
                    wechatManager.showSuccessMessage(userInfo);
                    
                    setTimeout(() => {
                        window.location.href = 'main.html';
                    }, 3000);
                } else {
                    wechatManager.showMessage('验证码错误，请重新获取', 'error');
                }
                
                phoneLoginBtn.disabled = false;
                phoneLoginBtn.innerHTML = originalText;
            }, 2000);
        }
    }

    const phoneManager = new PhoneLoginManager();

    getCodeBtn.addEventListener('click', function() {
        phoneManager.getVerificationCode();
    });

    phoneLoginBtn.addEventListener('click', function() {
        phoneManager.phoneLogin();
    });

    class AgreementManager {
        constructor() {
            this.initAgreementHandlers();
        }

        initAgreementHandlers() {
            const spans = document.querySelectorAll('.agreement span');
            spans.forEach(span => {
                span.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.showAgreementModal(span.innerText);
                });
            });

            this.enhanceAgreementCheckbox();
        }

        showAgreementModal(agreementName) {
            const modal = document.createElement('div');
            modal.className = 'agreement-modal';
            modal.innerHTML = `
                <div class="modal-overlay">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3>${agreementName}</h3>
                            <button class="close-btn">&times;</button>
                        </div>
                        <div class="modal-body">
                            <div class="agreement-content">
                                <h4>${agreementName}内容</h4>
                                <p>这是${agreementName}的详细内容。在实际应用中，这里应该显示完整的协议文本。</p>
                                <div class="agreement-text">
                                    <p>1. 用户在使用本服务前需要仔细阅读本协议</p>
                                    <p>2. 用户同意遵守相关法律法规</p>
                                    <p>3. 用户需保证提供的信息真实有效</p>
                                    <p>4. 平台将保护用户隐私信息安全</p>
                                    <p>5. 具体条款以实际协议为准</p>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button class="agree-btn">我已阅读并同意</button>
                        </div>
                    </div>
                </div>
            `;
            
            this.addAgreementModalStyles();
            document.body.appendChild(modal);
            
            modal.querySelector('.close-btn').addEventListener('click', () => {
                modal.remove();
            });
            
            modal.querySelector('.agree-btn').addEventListener('click', () => {
                modal.remove();
                wechatManager.showMessage(`已阅读${agreementName}`, 'success');
            });
        }

        addAgreementModalStyles() {
            if (document.getElementById('agreement-modal-styles')) return;
            
            const styles = document.createElement('style');
            styles.id = 'agreement-modal-styles';
            styles.textContent = `
                .agreement-modal .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(106, 27, 154, 0.9);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }
                .agreement-modal .modal-content {
                    background: white;
                    border-radius: 15px;
                    max-width: 600px;
                    width: 90%;
                    max-height: 80vh;
                    display: flex;
                    flex-direction: column;
                }
                .agreement-modal .modal-header {
                    padding: 20px 30px;
                    border-bottom: 1px solid #eee;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .agreement-modal .modal-header h3 {
                    color: #6A1B9A;
                    margin: 0;
                }
                .agreement-modal .close-btn {
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #999;
                }
                .agreement-modal .modal-body {
                    padding: 30px;
                    flex: 1;
                    overflow-y: auto;
                }
                .agreement-modal .agreement-content h4 {
                    color: #6A1B9A;
                    margin-bottom: 20px;
                }
                .agreement-modal .agreement-text {
                    background: #f8f9fa;
                    padding: 20px;
                    border-radius: 8px;
                    margin-top: 20px;
                }
                .agreement-modal .agreement-text p {
                    margin: 10px 0;
                    line-height: 1.5;
                }
                .agreement-modal .modal-footer {
                    padding: 20px 30px;
                    border-top: 1px solid #eee;
                    text-align: center;
                }
                .agreement-modal .agree-btn {
                    background: #6A1B9A;
                    color: white;
                    border: none;
                    padding: 12px 40px;
                    border-radius: 25px;
                    font-size: 16px;
                    cursor: pointer;
                }
            `;
            document.head.appendChild(styles);
        }

        enhanceAgreementCheckbox() {
            const agreeCheck = document.getElementById('agreeCheck');
            if (!agreeCheck) return;
            
            agreeCheck.addEventListener('change', function() {
                const loginButtons = document.querySelectorAll('#wechatLoginBtn, #phoneLoginBtn');
                loginButtons.forEach(btn => {
                    if (this.checked) {
                        btn.style.opacity = '1';
                        btn.style.cursor = 'pointer';
                    } else {
                        btn.style.opacity = '0.6';
                        btn.style.cursor = 'not-allowed';
                    }
                });
            });
            
            agreeCheck.dispatchEvent(new Event('change'));
        }
    }

    class FormEnhancer {
        constructor() {
            this.initFormEnhancements();
        }

        initFormEnhancements() {
            this.enhancePhoneInput();
            this.enhanceCodeInput();
            this.addKeyboardSupport();
        }

        enhancePhoneInput() {
            const phoneInput = document.getElementById('phoneInput');
            if (!phoneInput) return;
            
            phoneInput.addEventListener('input', function(e) {
                let value = this.value.replace(/\D/g, '');
                
                if (value.length > 11) {
                    value = value.slice(0, 11);
                }
                
                if (value.length > 7) {
                    value = value.slice(0, 3) + ' ' + value.slice(3, 7) + ' ' + value.slice(7);
                } else if (value.length > 3) {
                    value = value.slice(0, 3) + ' ' + value.slice(3);
                }
                
                this.value = value;
            });
            
            this.addClearButton(phoneInput);
        }

        enhanceCodeInput() {
            const codeInput = document.getElementById('codeInput');
            if (!codeInput) return;
            
            codeInput.addEventListener('input', function(e) {
                this.value = this.value.replace(/\D/g, '');
                
                if (this.value.length > 6) {
                    this.value = this.value.slice(0, 6);
                }
            });
            
            this.addClearButton(codeInput);
        }

        addClearButton(input) {
            const wrapper = input.parentElement;
            if (wrapper.querySelector('.clear-btn')) return;
            
            const clearBtn = document.createElement('span');
            clearBtn.className = 'clear-btn';
            clearBtn.innerHTML = '&times;';
            clearBtn.style.cssText = `
                position: absolute;
                right: 10px;
                top: 50%;
                transform: translateY(-50%);
                cursor: pointer;
                color: #999;
                font-size: 18px;
                display: none;
            `;
            
            wrapper.style.position = 'relative';
            wrapper.appendChild(clearBtn);
            
            input.addEventListener('input', function() {
                clearBtn.style.display = this.value ? 'block' : 'none';
            });
            
            clearBtn.addEventListener('click', function() {
                input.value = '';
                input.focus();
                clearBtn.style.display = 'none';
            });
        }

        addKeyboardSupport() {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const phoneLoginBtn = document.getElementById('phoneLoginBtn');
                    if (phoneLoginBtn && document.activeElement.type !== 'button') {
                        phoneManager.phoneLogin();
                    }
                }
                
                if (e.key === 'Escape') {
                    document.activeElement.blur();
                }
            });
        }
    }

    function initPage() {
        new AgreementManager();
        new FormEnhancer();
        checkLoginStatus();
        addPageLoadAnimation();
    }

    function checkLoginStatus() {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn === 'true' && window.location.pathname.endsWith('login.html')) {
            const userInfo = JSON.parse(localStorage.getItem('currentUser') || '{}');
            wechatManager.showMessage(`检测到已登录用户：${userInfo.nickname}，正在跳转...`, 'info', 2000);
            
            setTimeout(() => {
                window.location.href = 'main.html';
            }, 2000);
        }
    }

    function addPageLoadAnimation() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        
        setTimeout(() => {
            document.body.style.opacity = '1';
        }, 100);
    }

    const otherWay = document.querySelector('.purple-text');
    if (otherWay) {
        otherWay.addEventListener('click', function() {
            wechatManager.showMessage('更多登录方式开发中...', 'info');
        });
    }

    initPage();
});