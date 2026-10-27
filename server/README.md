# Time Pack Server

时间胶囊小程序服务端。

## 目录说明

```text
server/
├── app.ts                  # Express 核心配置
├── index.ts                # 服务入口文件
├── interface/              # 业务逻辑与控制器
├── lib/                    # 工具函数与外部库（微信接口、任务调度、文件管理）
├── model/                  # 数据库配置与 Sequelize ORM 模型
├── routes/                 # 路由定义
├── views/                  # EJS 模板视图
├── public/                 # 静态资源与文件上传目录
├── scripts/                # 构建与初始化脚本
│   ├── build.js            # 打包编译脚本
│   ├── init.ts             # 交互式初始化服务端配置
│   └── initdb.ts           # 交互式初始化数据库表结构
├── typings/                # TypeScript 类型声明
├── Dockerfile              # Docker 多阶段构建镜像配置
├── config.example.json     # 服务端配置示例
└── model/config.example.json # 数据库配置示例
```

## 常用命令

### 1. 安装依赖

```bash
pnpm install
# 或者使用 npm
npm install
```

### 2. 初始化配置与数据库

```bash
# 初始化服务端配置（生成 config.json 与 model/config.json）
npm run init

# 初始化数据库结构
npm run initdb
```

亦可直接参考 `config.example.json` 与 `model/config.example.json` 手动创建配置文件。

### 3. 开发环境运行

使用 `ts-node` 实时运行 TypeScript 代码：

```bash
npm run dev
```

### 4. 项目打包构建

编译 TypeScript 源码到 `dist` 目录，并自动拷贝 `views` 模板、`public` 静态资源、相关配置文件并创建上传目录：

```bash
npm run build
```

如需清理已构建的 `dist` 目录：

```bash
npm run clean
```

### 5. 生产环境启动

打包完成后，直接使用 Node.js 启动生产模式：

```bash
npm start
# 等同于 node dist/index.js
```

### 6. Docker 部署

使用 Docker 多阶段构建容器镜像：

```bash
# 构建镜像
docker build -t time-pack-server .

# 启动容器
docker run -d -p 3000:3000 --name time-pack-server time-pack-server
```
