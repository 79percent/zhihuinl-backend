## 发布求职信息
http://localhost:4000/applyjob/addApplyjob POST
#### 接受参数
body: {
  age: "12"
  city: "12"
  educationBackground: "12"
  mobile: "12"
  name: "12"
  salary1: 22
  salary2: 2222
  sex: "man"
  speciality: "12"
  title: "12"
  workExperience: 12
}
#### 返回结果
res: {
  code: 0,
  msg: '发布求职信息成功',
}

## 获取求职信息列表
http://localhost:4000/applyjob/getApplyjobs GET
#### 接受参数
headers: {
  token: 'token'
} 
#### 返回结果
res: {
  code: 0,
  msg: '获取求职信息列表成功',
  data: [
    {},
  ]
}

## 删除求职信息
http://localhost:4000/applyjob/removeApplyjob POST
#### 接受参数
body: {
  _id,
}
#### 返回结果
res: {
  code: 0,
  msg: '删除求职信息成功!',
}

## 修改求职信息
http://localhost:4000/applyjob/updateApplyjob POST
#### 接受参数
body: {
  _id,
  age: "12"
  city: "12"
  educationBackground: "12"
  mobile: "12"
  name: "12"
  salary1: 22
  salary2: 2222
  sex: "man"
  speciality: "12"
  title: "12"
  workExperience: 12
}
#### 返回结果
res: {
  code: 0,
  msg: '修改成功',
}

## 获取求职信息详情
http://localhost:4000/applyjob/getApplyjobDetail GET
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
  msg: '获取求职信息详情成功',
  data: {
      _id,
      providerId,
      age: "12"
      city: "12"
      educationBackground: "12"
      mobile: "12"
      name: "12"
      salary1: 22
      salary2: 2222
      sex: "man"
      speciality: "12"
      title: "12"
      workExperience: 12
      createTime: 111231321654,
  },
}