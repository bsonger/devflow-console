# =========================
# 构建阶段
# =========================
FROM node:20-alpine AS builder

WORKDIR /app

# 安装依赖
COPY package*.json ./
RUN npm install

# 复制源代码
COPY . .

# 构建前端
RUN npm run build && ls -l build

# =========================
# 生产阶段
# =========================
FROM node:20-alpine

WORKDIR /app

# 安装轻量静态服务器 serve
RUN npm install -g serve

# 复制构建产物（build 而不是 dist）
COPY --from=builder /app/build ./build

# 暴露 8080 端口
EXPOSE 8080

# 启动命令，使用 build 目录
CMD ["serve", "-s", "build", "-l", "8080"]