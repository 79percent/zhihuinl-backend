## 获取文章列表
http://localhost:4000/article/getArticles GET
#### 接受参数
headers: {
  token: 'token'
} 
query: {
  keyword,//搜索关键字
  currentPage: 1,
  pageSize: 5,
}
#### 返回结果
res: {
  code: 0,
  msg: '获取文章列表成功',
  data: {
    total,
    totalPage,
    currentPage,
    pageSize,
    list: [
      {},
    ]
  }
}

## 添加文章
http://localhost:4000/article/addArticle POST
#### 接受参数
body: {
  
}
#### 返回结果
res: {
  code: 0,
  msg: '添加成功',
}

## 删除文章
http://localhost:4000/article/removeArticle POST
#### 接受参数
body: {
  _id,
}
#### 返回结果
res: {
  code: 0,
  msg: '删除文章成功!',
}

## 修改文章
http://localhost:4000/article/updateArticle POST
#### 接受参数
body: {
  _id,
  
}
#### 返回结果
res: {
  code: 0,
  msg: '修改成功',
}

## 获取文章详情
http://localhost:4000/article/getArticleDetail GET
#### 接受参数
headers: {
  token: 'token'
} 
query: {
  _id
}
#### 返回结果
res: {
  code: 0,
  msg: '获取文章详情成功',
  data: {
    
  },
}