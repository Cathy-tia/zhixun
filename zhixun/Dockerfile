# 基于官方 PHP + Nginx 镜像（已整合好环境，新手友好）
FROM trafex/php-nginx:3.1-alpine

# 将项目文件复制到容器的 Web 根目录
COPY . /var/www/html

# 设置权限（避免访问报错）
RUN chown -R nobody:nobody /var/www/html \
    && chmod -R 755 /var/www/html

# 暴露 80 端口（Render 会自动映射）
EXPOSE 80

# 启动 Nginx + PHP-FPM
CMD ["/start.sh"]
