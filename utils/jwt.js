/**
 * 生成Token和验证Token
 */
const jwt = require('jsonwebtoken');
const moment = require('moment');
// 创建 token 类
class Jwt {
  constructor(data) {
    this.data = data;
  }

  //生成token
  generateToken() {
    //这里设置token有效期为7天
    const newToken = jwt.sign({
      data: this.data,
      exp: Math.floor(moment().add(7, 'days').unix()),
    }, 'secret')
    return newToken;
  }

  // 校验token,返回token对应的userId, 或者false
  verifyToken() {
    const token = this.data
    let res = false
    try {
      const current = moment().unix()
      const result = jwt.verify(token, 'secret') || null
      if (result) {
        const { data, exp } = result
        //对比当前时间和设置的有效期时间
        if (current > exp) {
          //如果超出token有效期，则认证不通过
          res = false
        } else {
          //在有效期内，认证通过，返回userId
          res = data
        }
      } else {
        res = false
      }
    } catch (err) {
      res = false
    }
    return res
  }
}

module.exports = Jwt;
