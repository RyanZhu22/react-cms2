import { Card, Form, Input, Checkbox, Button, message } from 'antd'
import logo from '@/assets/logo.png'
import { useNavigate } from 'react-router-dom'
import './index.scss'
import { useStore } from '@/store'
function Login () {
  const { loginStore } = useStore()
  const navigate = useNavigate()
  async function onFinish (values) {
    console.log(values)
    // values：Places the user input in all form entries
    // todo:Login
    const { mobile, code } = values
    await loginStore.getToken({ mobile, code })
    // jump to Home
    navigate('/', { replace: true })
    // reminder username
    message.success('登录成功')
  }

  return (
    <div className="login">
      <Card className="login-container">
        <img className="login-logo" src={logo} alt="" />
        {/* Login Form */}
        <Form
          validateTrigger={['onBlur', 'onChange']}
          initialValues={{
            remember: true,
            mobile: '13811111111',
            code: '246810'
          }}
          onFinish={onFinish}
        >
          <Form.Item
            name="mobile"
            rules={[
              {
                required: true,
                message: 'Please input your mobile phone number',
              },
              {
                pattern: /^1[3-9]\d{9}$/,
                message: 'Please input the correct mobile phone number',
                validateTrigger: 'onBlur'
              }
            ]}
          >
            <Input size="large" placeholder="Please input your mobile phone number" />
          </Form.Item>
          <Form.Item
            name="code"
            rules={[
              {
                required: true,
                message: 'Please input your password',
              },
              {
                len: 6,
                message: 'Please input a 6-digit password',
                validateTrigger: 'onBlur'
              }
            ]}
          >
            <Input size="large" placeholder="Please input the verification code" />
          </Form.Item>
          <Form.Item
            name="remember"
            valuePropName="checked"

          >
            <Checkbox className="login-checkbox-label">
              I have read and agree to the User Agreement and Privacy Policy
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" size="large" block>
              LOGIN
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Login