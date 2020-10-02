## 获取列表
http://localhost:4000/question/getQuestionList GET
#### 接受参数
headers: {
  token: 'token'
} 
query: {
  currentPage: 1,
  pageSize: 8,
}
#### 返回结果
res: {
  code: 0,
  msg: '获取成功',
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

## 发布
http://localhost:4000/question/add POST
#### 接受参数
headers: {
  token: 'token'
} 
body{
  title: "aaa"
  imgs: {file: {…}, fileList: Array(1)}
  address: "aa"
  price: "12"
  introduce: "1231"
  inventory: 100
  mobile: "121"
}
#### 返回结果
res: {
  code: 0,
  msg: '发布成功',
  data: {
    
  }
}


## 删除
http://localhost:4000/question/remove POST
#### 接受参数
body: {
  _id,
}
#### 返回结果
res: {
  code: 0,
  msg: '删除成功!',
}

## 获取详情
http://localhost:4000/question/getDetail GET
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
  msg: '获取成功',
  data: {
    
  },
}