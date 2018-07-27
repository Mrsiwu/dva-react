import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Input,
  DatePicker,
  Select,
  Button,
  Card,
  InputNumber,
  Radio,
  Icon,
  Tooltip,
  Col,
  Row,
  Upload,
  message
} from 'antd';
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import styles from './Seosetting.less';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJPG = file.type === 'image/jpeg';
  if (!isJPG) {
    message.error('You can only upload JPG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJPG && isLt2M;
}


const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;

@connect(({ loading }) => ({
  submitting: loading.effects['form/submitRegularForm'], 
}))
@Form.create()
export default class BasicForms extends PureComponent {
  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        dispatch({
          type: 'form/submitRegularForm',
          payload: values,
        });
      }
    });
  };



  state = {
    loading: false,
  };


  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl => this.setState({
        imageUrl,
        loading: false,
      }));
    }
  };

  render() {
     const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const imageUrl = this.state.imageUrl;

    const { submitting, form } = this.props;
    const { getFieldDecorator, getFieldValue } = form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
      
    };
  
    return (
      <PageHeaderLayout
        title="网站名称"
        content="设置好网站名称、网站副标题及浏览器logo有助于更好的推广。"
      >
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit}   layout="vertical" hideRequiredMark style={{ marginTop: 8 }}>
                 <FormItem label="网站副标题">
                  {getFieldDecorator('name', {
                    rules: [{ required: true, message: '请输入网站副标题' }],
                  })(<Input placeholder="请输入网站副标题" />)}
                </FormItem>
          
            <FormItem  layout="vertical"  label="浏览器图标">
              {getFieldDecorator('date', {
                rules: [
                  {
                    required: true,
                    message: '请选择起止日期',
                  },
                ],
              })(  <div className={styles.uploadInfo}><Upload
                      name="avatar"
                      listType="picture-card"
                      className="avatar-uploader"
                      showUploadList={false}
                      action="//jsonplaceholder.typicode.com/posts/"
                      beforeUpload={beforeUpload}
                      onChange={this.handleChange}
                    >
                      {imageUrl ? <img src={imageUrl} alt="avatar" /> : uploadButton}
                      
                    </Upload> <div>建议上传图片尺寸为32*32，大小不超过1M</div></div>)}
            </FormItem>
            <FormItem   layout="vertical"  label="备案及版权信息">
              {getFieldDecorator('goal', {
                rules: [
                  {
                    required: true,
                    message: '请输入备案及版权信息',
                  },
                ],
              })(<Input placeholder="请输入备案及版权信息" />)}
            </FormItem>
            <FormItem  layout="vertical" label="SEO关键词">
              {getFieldDecorator('seoKey', {
                rules: [
                  {
                    required: true,
                    message: '请输入SEO关键词',
                  },
                ],
              })(<Input placeholder="请输入SEO描述信息" />)}
            </FormItem>
             <FormItem  layout="vertical" label="SEO描述信息">
              {getFieldDecorator('seoInfo', {
                rules: [
                  {
                    required: true,
                    message: '请输入SEO描述信息',
                  },
                ],
              })(<Input placeholder="请输入SEO关键词" />)}
            </FormItem>
            <FormItem  layout="vertical" style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                提交
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
