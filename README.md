# template

editorSetting.json vscode 自定义设置

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build  // 可使用环境变量 process.env.VUE_APP_ENV 当前值 production

yarn run build:dev  // 可使用环境变量 process.env.VUE_APP_ENV 当前值 development

```

### Run your tests
```
yarn run test
```

### Lints and fixes files
```
yarn run lint
```
## 添加泰行销下自定义头
## 添加了env文件（不可删除）用来区分打包是上生产还是上测试可灵活运用`process.env.VUE_APP_ENV`的值作为判断条件
1) .env.dev
2) .env.production

### git常用命令
1) git init
2) git add README.md
3) git commit -m 'first commmit'
4) git remote add origin https://github.com/EmilyCaiLi/vueTemplate.git
5) git push -u origin master


git remote add origin https://github.com/
git push -u origin master
