/* eslint-disable */
import React, { forwardRef, useImperativeHandle, useState } from "react";
import { Card, Form, Button, Row, Col, Tree } from "antd";
import Modal from "../Modal";
import FormColumns from "../FormColumns";
import FormModal from "../FormModal";
import { useAsyncLoading } from "../Hooks/useAsync";
import { useForm } from "antd/lib/form/Form";

const CUForm = ({ columns, form, formData: initialValues, isUpdate, actions }) => {
  return (
    <Form form={form} initialValues={initialValues} layout="vertical">
      <FormColumns
        span={12}
        columns={typeof columns === "function" ? columns(initialValues, form, isUpdate) : columns}
        form={form}
      />
      {actions}
    </Form>
  );
};

export default forwardRef(
  ({ name = "", cuColumns, cuOptions = {}, actions, extraActions, beforeCU, afterCreate, afterUpdate }, ref) => {
    const { list, create, update, destroy } = actions;
    const [treeState, setTreeState] = useState({
      current: {},
      selectedKeys: [],
      expandedKeys: [],
      autoExpandParent: true,
    });

    const [AsyncTree, instance] = useAsyncLoading(() =>
      list().then(data => {
        if (treeState.selectedKeys.length === 0 && data.length) {
          setTreeState({ ...treeState, expandedKeys: [data[0].key] });
        }
        return data;
      })
    );

    let createFormInstance = null;
    const updateFormInstance = useForm()[0];

    useImperativeHandle(ref, () => ({
      getCreateForm: () => {
        return createFormInstance;
      },
      getUpdateForm: () => updateFormInstance,
    }));

    const formColumns = cuColumns;

    // console.log(tableColumns, sColumns, formColumns)
    const onCreate = () => {
      const c = () =>
        FormModal.create({
          title: `Create ${name}`,
          okText: "Create",
          ...cuOptions,
          children: form => {
            createFormInstance = form;
            return <CUForm columns={formColumns} form={form} />;
          },
          onOk: value => {
            return create({ ...value, parent_id: treeState.current.id }).then(() => {
              afterCreate && afterCreate(value, row);
              instance.refresh();
            });
          },
        });

      beforeCU ? beforeCU(row).then(c) : c();
    };

    const onUpdate = () => {
      updateFormInstance
        .validateFields()
        .then(values => update({ ...values, id: treeState.current.id }))
        .then(instance.refresh);
    };

    const onDelete = () => {
      Modal.deleteConfirm(() => {
        destroy(treeState.current)
          .then(instance.refresh)
          .then(() => {
            setTreeState({ ...treeState, current: {}, selectedKeys: [] });
            updateFormInstance.resetFields();
          });
      });
    };

    const onSelect = (selectedKeys, { node }) => {
      console.log(node);
      setTreeState({ ...treeState, current: node, selectedKeys });
      updateFormInstance.setFieldsValue(node);
    };

    const onExpand = expandedKeys => {
      // if not set autoExpandParent to false, if children expanded, parent can not collapse.
      // or, you can remove all expanded children keys.
      setTreeState({
        ...treeState,
        expandedKeys,
      });
    };

    return (
      <Card
        bordered={false}
        title={name && `${name} Tree`}
        className="no-padding-card"
        extra={
          <div className="operations right">
            {create && (
              <Button onClick={onCreate} type="primary" size="small">
                New
              </Button>
            )}
            <Button onClick={() => { instance.refresh() }} type="primary" size="small">
              Refresh
            </Button>
          </div>
        }
      >
        <Row gutter={24}>
          <Col span={12} style={{ padding: 26 }}>
            <AsyncTree>
              {
                data => (
                  <Tree
                    onSelect={onSelect}
                    selectedKeys={treeState.selectedKeys}
                    expandedKeys={treeState.expandedKeys}
                    onExpand={onExpand}
                    treeData={data}
                  />
                )
              }
            </AsyncTree>
          </Col>
          <Col span={12}>
            <Card style={{ padding: 26 }}>
              <CUForm
                columns={formColumns}
                form={updateFormInstance}
                isUpdate
                actions={
                  <div className="operations center">
                    <Button type="primary" htmlType="submit" size="small" onClick={onUpdate}>
                      Update
                    </Button>
                    {treeState.current.id && (
                      <Button type="primary" danger size="small" onClick={onDelete}>
                        Delete
                      </Button>
                    )}
                    <Button type="default" size="small" onClick={() => updateFormInstance.resetFields()}>
                      Reset
                    </Button>
                  </div>
                }
              />
            </Card>
          </Col>
        </Row>
      </Card>
    );
  }
);
