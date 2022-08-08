import {
  Card,
  Breadcrumb,
  Form,
  Button,
  Radio,
  Input,
  Upload,
  Space,
  Select,
  message
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import './index.scss'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useStore } from '@/store'
import { useEffect, useRef, useState } from 'react'
import { http } from '@/utils'
const { Option } = Select
const Publish = () => {
  const { channelStore } = useStore()

  // save list of upload images
  const [fileList, setFileList] = useState([])
  // use useRef to declare a staging warehouse
  const cacheImgList = useRef([])
  const onUploadChange = ({ fileList }) => {
    // Also save a list of images in the local repository
    // Data formatting
    const formatList = fileList.map(file => {
      // upload done  do data processing
      if (file.response) {
        return {
          url: file.response.data.url
        }
      }
      return file
    })
    setFileList(formatList)
    cacheImgList.current = formatList
  }

  // change img
  const [imgCount, setImageCount] = useState(1)
  const radioChange = (e) => {
    // use e.target.value to judge
    const rawValue = e.target.value
    setImageCount(rawValue)
    // no-picture mode 
    if (cacheImgList.current.length === 0) {
      return false
    }
    // Single image mode
    if (rawValue === 1) {
      const img = cacheImgList.current[0]
      setFileList([img])
      // Multi-image mode
    } else if (rawValue === 3) {
      setFileList(cacheImgList.current)
    }
  }

  // submit form
  const navigate = useNavigate()
  const onFinish = async (values) => {
    // secondray data processing  => over Field
    const { channel_id, content, title, type } = values
    // determine type fileList when submit
    const params = {
      channel_id,
      content,
      title,
      type,
      cover: {
        type: type,
        images: fileList.map(item => item.url)
      }
    }
    if (id) {
      await http.put(`/mp/articles/${id}?draft=false`, params)
    } else {
      await http.post('/mp/articles?draft=false', params)
    }

    // jump to list, reminder username
    navigate('/article')
    message.success(`${id ? '更新成功' : '发布成功'}`)
  }

  // Edit
  // Copy adaptation  Routing parameters.id 
  const [params] = useSearchParams()
  const id = params.get('id')
  // Data backfill  Calling the interface  1.表单回填 2.暂存列表 3.Upload组件fileList
  const [form] = Form.useForm()
  useEffect(() => {
    const loadDetail = async () => {
      const res = await http.get(`/mp/articles/${id}`)
      const data = res.data
      // Data backfill
      form.setFieldsValue({ ...data, type: data.cover.type })
      // backfill upload
      const formatImgList = data.cover.images.map(url => ({ url }))
      setFileList(formatImgList)
      // save for temporary storage
      cacheImgList.current = formatImgList
      // type of img
      setImageCount(data.cover.type)
    }
    // send request wehn editing mode
    if (id) {
      loadDetail()
    }
  }, [id, form])

  return (
    <div className="publish">
      <Card
        title={
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to="/home">Home</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{id ? 'Edit' : 'Publish'}Article</Breadcrumb.Item>
          </Breadcrumb>
        }
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ type: 1, content: '' }}
          onFinish={onFinish}
          form={form}
        >
          <Form.Item
            label="title"
            name="title"
            rules={[{ required: true, message: 'Please input the title of the article' }]}
          >
            <Input placeholder="Please input the title of the article" style={{ width: 400 }} />
          </Form.Item>
          <Form.Item
            label="channel"
            name="channel_id"
            rules={[{ required: true, message: 'Please select an article channel' }]}
          >
            <Select placeholder="Please select an article channel" style={{ width: 400 }}>
              {channelStore.channelList.map(item => (
                <Option key={item.id} value={item.id}>{item.name}</Option>
              ))}

            </Select>
          </Form.Item>

          <Form.Item label="Cover">
            <Form.Item name="type">
              <Radio.Group onChange={radioChange}>
                <Radio value={1}>Single image</Radio>
                <Radio value={3}>Three images</Radio>
                <Radio value={0}>Not imaged</Radio>
              </Radio.Group>
            </Form.Item>
            {imgCount > 0 && (
              <Upload
                name="image"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList
                action="http://geek.itheima.net/v1_0/upload"
                fileList={fileList}
                onChange={onUploadChange}
                multiple={imgCount > 1}
                maxCount={imgCount}
              >
                <div style={{ marginTop: 8 }}>
                  <PlusOutlined />
                </div>
              </Upload>
            )}

          </Form.Item>
          {/* Rich Text Component that Form.Item control */}
          {/* content will be collected when calling on onFinished */}
          <Form.Item
            label="content"
            name="content"
            rules={[{ required: true, message: 'Please input article content' }]}
          >
            <ReactQuill theme="snow" />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 4 }}>
            <Space>
              <Button size="large" type="primary" htmlType="submit">
                {id ? 'update' : 'publish'}Article
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default observer(Publish)