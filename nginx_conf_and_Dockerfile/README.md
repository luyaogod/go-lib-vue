项目打包

```bash
pnpm run build
```

部署时请将项目打包文件复制出来与Dockerfile和nginx.conf放在同一目录下

```
-dist
-Dockerfile
-nginx.conf
```

构建镜像命令

```
docker build -t my-vue-app .
```

容器构建命令

```bash
docker run -d \
  -p 80:80 \
  -v $(pwd)/dist:/usr/share/nginx/html \
  -v $(pwd)/nginx.conf:/etc/nginx/conf.d/default.conf \
  --name my-vue-app my-vue-app
```