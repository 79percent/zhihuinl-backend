# 用户表相关的接口

## 注册 
http://localhost:4000/user/register   POST
#### 接受参数
body: {
  userName: '111',
  password: '111',
  phone: 17758163616,
} 
#### 返回结果
res: {
  code: 0,
  msg: '注册成功',
  data: {
    userId: '001',
    type: 'user',
    token: 'token'
  }
}

res: {
  code: 1,
  msg: '错误提示',
}

## 登录 
http://localhost:4000/user/login   POST
#### 接受参数
//用户名+密码
body: {
  userName: '111',
  password: '111',
} 

//手机+验证码
body: {
  phone: 17758163616,
  messageCode: 1356,
}
#### 返回结果
res: {
  code: 0,
  msg: '登录成功',
  data: {
    userId: '001',
    type: 'user',
    <!-- 或者 type: 'admin', -->
    token: 'token'
  }
}

res: {
  code: 1,
  msg: '错误提示',
}

## 获取当前用户信息 
http://localhost:4000/user/getCurrentUserInfo   GET
#### 接受参数
//请求头里需要带上token
headers: {
  token: 'token'
} 
#### 返回结果
res: {
  code: 0,
  msg: '获取用户信息成功',
  data: {
    userId: '001',
    userName: '111',
    type: 'user/admin',
    avatar: 'http://localhost:4000/img...',
    phone: '17758163616',
    email: '123@123.com',
    name: 'per',
    personalIntroduction: '个人介绍',
    country: '中国',
    province: '浙江省 杭州市',
    address: '西湖区工专路 77 号',
    isExpert: false,
  }
}

res: {
  code: 1,
  msg: '错误提示',
}



## 修改当前用户信息 
http://localhost:4000/user/updateCurrentUserInfo   POST
#### 接受参数
//请求头里需要带上token
headers: {
  token: 'token'
} 
body: {
  phone,
  email,
  name,
  personalIntroduction,
  country,
  province,
  address,
  isExpert,
}
file: {
  avatart//头像图片
}
#### 返回结果
res: {
  code: 0,
  msg: '修改成功',
}

res: {
  code: 1,
  msg: '错误提示',
}

## 获取所有专家信息 
http://localhost:4000/user/getAllExpertInfo   GET
#### 接受参数
//请求头里需要带上token
headers: {
  token: 'token'
} 
#### 返回结果
res: {
  code: 0,
  msg: '查询专家信息成功',
  data: [
    {
      id: '001',
      userName: '111',
      avatar: 'http://localhost:4000/img...',
      phone: '17758163616',
      email: '123@123.com',
      name: 'per',
      isExpert: true,
    },
  ]
}

res: {
  code: 1,
  msg: '错误提示',
}

## 上传个人头像
http://localhost:4000/user/uploadAvatar POST
#### 接受参数
//请求头里需要带上token
headers: {
  token: 'token'
} 
Form Data: {
  file
}
#### 返回结果
res: {
  code: 0,
  msg: '上传个人头像成功',
}

res: {
  code: 1,
  msg: '错误提示',
}


## 获取当前用户的消息通知 
ws://localhost:4000/user/getCurrentUserNotices
#### 接受参数
//请求头里需要带上token
headers: {
  token: 'token'
} 
#### 返回结果
res: {
  code: 0,
  msg: '获取消息成功',
  data: {
    unreadCount: 11,
    notices: [
      {
        provider_id: '002',
        avatar: 'http://....',
        userName: '222',
        phone: 123456789,
        email: 222@222.com,
        name: 'gg',
        type: 'COMMENT/MESSAGE',//评论或者留言
        status: false/true,
      },
    ],
  }
}

res: {
  code: 1,
  msg: '错误提示',
}