# proxy
正向代理请求
```
根据本机 C:/Windows/System32/drivers/etc/hosts 文件转发请求
格式
127.0.0.1       baidu.map.jiayou.com#8084
```

## 安装与运行
```
npm install http://github.com/ruanjiayou/proxy.git --save
进入项目目录(默认转发到localhost)
nodemon proxy.js 或 npm run start
```