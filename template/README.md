# mzi-water-oos

## 一、项目开发规范

#### 1.所有文件或者文件夹名都是a-b-c..模式

#### 2.所有文件内需要定义TAG，用来做打印标记，TAG即为文件名保持一致既可

#### 3.Service目前支持2大类封装, base-service.js 和 page-service.js 模块， api目录下为具体的接口实现

#### 4./api目录下具体的接口实现遵循 vue mixins写法, 同时所有的变量也需要按照aBc模式， 方法遵循驼峰式开发，具体如下: 

```
变量定义规范
**_get_[url | data |service]、 **_save_[url | data |service]、 **_del_[url | data |service]、**_page_query_[url | data |service]


普通查询数据操作
get**Data()、afterGet**Data()

保存、修改数据操作
save**Data()、afterSave**Data()

删除数据操作
del**Data()、afterDel**Data()

发送数据操作
send**Data()、afterSend**Data()

分页查询
pageQuery**Data()、afterPageQuery**Data()

```

#### 5.所有class类方法对象采用首字母大写,AaBb模式

## Project setup
```
npm install --registry=https://registry.npm.taobao.org
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
