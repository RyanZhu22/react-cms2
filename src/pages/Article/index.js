import img404 from '@/assets/error.png'
import './index.scss'
import { Link, useNavigate } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import { Table, Tag, Space, Card, Breadcrumb, Form, Button, Radio, DatePicker, Select } from 'antd'
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { http } from '@/utils'
import { useStore } from '@/store'

const { Option } = Select
const { RangePicker } = DatePicker

const Article = () => {
  const { channelStore } = useStore()

  const [articleData, setArticleData] = useState({
    list: [],
    count: 0 
  })

  // Management of article parameters
  const [params, setParams] = useState({
    page: 1,
    per_page: 10
  })
  // get the list of article
  useEffect(() => {
    const loadList = async () => {
      const res = await http.get('/mp/articles', { params })
      const { results, total_count } = res.data
      setArticleData({
        list: results,
        count: total_count
      })
    }
    loadList()
  }, [params])

  /* Form filter */
  const onFinish = (values) => {
    const { channel_id, date, status } = values
    // Data processing
    const _params = {}
    // Formatting status
    _params.status = status
   
    // Initialisation Channel
    if (channel_id) {
      _params.channel_id = channel_id
    }
    // Initialisation time
    if (date) {
      _params.begin_pubdate = date[0].format('YYYY-MM-DD')
      _params.end_pubdate = date[1].format('YYYY-MM-DD')
    }
    // motify data of params to cause resending of the interface.  Merging of objects
    setParams({
      ...params,
      ..._params
    })
  }
  // Turn Page
  const pageChange = (page) => {
    setParams({
      ...params,
      page
    })
  }

  const formatStatus = (type) => {
    const TYPES = {
      1: <Tag color="red">Audit Failure</Tag>,
      2: <Tag color="green">Successful audit</Tag>
    }
    return TYPES[type]
  }

  // Delete article
  const delArticle = async (data) => {
    await http.delete(`/mp/articles/${data.id}`)
    // refresh list 
    setParams({
      ...params,
      page: 1
    })
  }

  // edit article
  const navigate = useNavigate()
  const goPublish = (data) => {
    navigate(`/publish?id=${data.id}`)
  }

  const columns = [
    {
      title: 'cover',
      dataIndex: 'cover',
      width: 120,
      render: cover => {
        return <img src={cover.images[0] || img404} width={80} height={60} alt="" />
      }
    },
    {
      title: 'title',
      dataIndex: 'title',
      width: 220
    },
    {
      title: 'status',
      dataIndex: 'status',
      render: data => formatStatus(data)
    },
    {
      title: 'publish data',
      dataIndex: 'pubdate'
    },
    {
      title: 'readings',
      dataIndex: 'read_count'
    },
    {
      title: 'comments',
      dataIndex: 'comment_count'
    },
    {
      title: 'likes',
      dataIndex: 'like_count'
    },
    {
      title: 'option',
      render: data => {
        return (
          <Space size="middle">
            <Button
              type="primary"
              shape="circle"
              icon={<EditOutlined />}
              onClick={() => goPublish(data)} />
            <Button
              type="primary"
              danger
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() => delArticle(data)}
            />
          </Space>
        )
      },
      fixed: 'right'
    }
  ]

  return (
    <div>
      {/* Filter area */}
      <Card
        title={
          <Breadcrumb separator=">">
            <Breadcrumb.Item>
              <Link to="/home">HOME</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>CONTENT MANAGEMENT</Breadcrumb.Item>
          </Breadcrumb>
        }
        style={{ marginBottom: 20 }}
      >
        <Form
          onFinish={onFinish}
          initialValues={{ status: null }}>
          <Form.Item label="状态" name="status">
            <Radio.Group>
              <Radio value={null}>total</Radio>
              <Radio value={0}>draft</Radio>
              <Radio value={1}>pending view</Radio>
              <Radio value={2}>audited and approved</Radio>
              <Radio value={3}>audit failure</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item label="channel" name="channel_id">
            <Select
              placeholder="Please select an article channel"
              style={{ width: 120 }}
            >
              {channelStore.channelList.map(channel => <Option key={channel.id} value={channel.id}>{channel.name}</Option>)}
            </Select>
          </Form.Item>

          <Form.Item label="date" name="date">
            {/* income locale attributes, control display*/}
            <RangePicker ></RangePicker>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ marginLeft: 80 }}>
              Filter
            </Button>
          </Form.Item>
        </Form>
      </Card>
      {/* Article list area */}
      <Card title={`The total number of results based on the filter criteria is ${articleData.count} :`}>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={articleData.list}
          pagination={
            {
              pageSize: params.per_page,
              total: articleData.count,
              onChange: pageChange,
              current: params.page
            }
          }
          bordered
        />
      </Card>
    </div>
  )
}

export default observer(Article)