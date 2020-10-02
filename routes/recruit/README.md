## 发布招工信息
http://localhost:4000/recruit/addRecruit POST
#### 接受参数
body: {
  city: "杭州",
  details: "要求懂养殖技术",
  mobile: "17758163616",
  nums: 10,
  salary: 300,
  sex: "man",
  site: "水务大厦",
  title: "标题",
}
#### 返回结果
res: {
  code: 0,
  msg: '发布招聘信息成功',
}

## 获取招工信息列表
http://localhost:4000/recruit/getRecruits GET
#### 接受参数
headers: {
  token: 'token'
} 
#### 返回结果
res: {
  code: 0,
  msg: '获取招工信息列表成功',
  data: [
    {
      recruitId: '23163456',
      providerId: '111',
      city: "杭州",
      details: "要求懂养殖技术",
      mobile: "17758163616",
      nums: 10,
      salary: 300,
      sex: "man",
      site: "水务大厦",
      title: "标题",
      createTime: 111231321654,
    },
  ]
}

## 删除招工信息
http://localhost:4000/recruit/removeRecruit POST
#### 接受参数
body: {
  _id,
}
#### 返回结果
res: {
  code: 0,
  msg: '删除招工信息成功!',
}

## 修改招工信息
http://localhost:4000/recruit/updateRecruit POST
#### 接受参数
body: {
  _id,
  city: "杭州",
  details: "要求懂养殖技术",
  mobile: "17758163616",
  nums: 10,
  salary: 300,
  sex: "man",
  site: "水务大厦",
  title: "标题",
}
#### 返回结果
res: {
  code: 0,
  msg: '修改招聘信息成功',
}

## 获取招工信息详情
http://localhost:4000/recruit/getRecruitDetail GET
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
  msg: '获取招工信息详情成功',
  data: {
      _id,
      recruitId: '23163456',
      providerId: '111',
      city: "杭州",
      details: "要求懂养殖技术",
      mobile: "17758163616",
      nums: 10,
      salary: 300,
      sex: "man",
      site: "水务大厦",
      title: "标题",
      createTime: 111231321654,
  },
}