# 共建`online-tools`

# 运行项目

1. 克隆项目
```
git clone https://github.com/whinc/online-tools.git
```

2. 切换到`online-tools`目录，安装依赖
```
npm install
```

3. 本地开发
```
npm start
```

# 发布

将开发分支代码合并到 master 分支，然后 push 到远程仓库的 master 分支即可。
> 每当 master 分支发生 push 事件时，会自动触发 Actions 中预定义的构建流程，详细可参考`.github/workflows/main.yml`。

