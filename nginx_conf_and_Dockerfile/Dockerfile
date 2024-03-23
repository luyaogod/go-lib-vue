# 使用官方Nginx镜像作为基础镜像
FROM nginx:stable-alpine

# 将本地的Nginx配置文件复制到容器的/etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 将本地Vue.js项目打包后的静态资源目录复制到容器的/usr/share/nginx/html
COPY dist /usr/share/nginx/html

# 设置工作目录为Nginx的静态资源根目录
WORKDIR /usr/share/nginx/html

# 将容器内部的80端口映射到宿主机的80端口
EXPOSE 80

# 如果需要在运行时自动执行Nginx配置测试并重载
CMD ["nginx", "-g", "daemon off;"]