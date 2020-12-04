import React from 'react';
import { Form, Input, InputNumber, Row, Button } from 'antd';
import styled from '@emotion/styled';
import { Config } from 'src/types/common';

interface Props {
  initialValue: Config;
  onSuccess: (formData: Config) => void;
}

const ConfigForm: React.FC<Props> = ({
  initialValue,
  onSuccess
}) => {
  return (
    <FormWrapper>
      <Form
        initialValues={initialValue}
        onFinish={onSuccess}
      >
        <Row>
          <Form.Item
            label="title"
            name="title"
            rules={[{
              required: true,
              message: 'Please input title'
            }]}
          >
            <Input />
          </Form.Item>
        </Row>
        <Row>
          <Form.Item
            label="width"
            name="width"
            rules={[{
              required: true,
              message: 'Please input width'
            }]}
          >
            <InputNumber/>
          </Form.Item>
          <Form.Item
            label="height"
            name="height"
            rules={[{
              required: true,
              message: 'Please input height'
            }]}
          >
            <InputNumber/>
          </Form.Item>
        </Row>
        <Button type="primary" htmlType="submit">시작하기</Button>
      </Form>
    </FormWrapper>
  )
}

export default React.memo(ConfigForm);

const FormWrapper = styled.div`
  width: 600px;
  padding: 20px;
  background-color: #fff;
  border: 1px solid #ddd;

  dl {
    display: flex;
    align-items: center;
    padding: 10px 0;
  }
  
  dt {
    width: 120px;
    padding: 0 10px;
    font-size: 14px;
    font-weight: bold;
    color: #333;
  }

  dd {
    & ~ dd {
      padding-left: 10px;
    }

    p {
      display: inline-block;
      margin-right: 5px;
    }
  }
`;

