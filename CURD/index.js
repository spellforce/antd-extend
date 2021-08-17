/* eslint-disable */
import React, { forwardRef, useImperativeHandle } from "react";
import { Card, Form, Button } from "antd";
import TipButton from "../Buttons/TipButton";
import PageTable from "../PageTable";
import Modal from "../Modal";
import CustomForm from "../CustomForm";
import FormColumns from "../FormColumns";
import FormModal from "../FormModal";

const SearchForm = ({ columns, onSearch, onReset }) => {
  return (
    <Card bordered={false} title="Search" className="small-padding-card">
      <CustomForm
        columns={columns}
        className="search-form"
        actions={{ text: "Search", onFinish: onSearch }}
        onReset={onReset}
      />
    </Card>
  );
};

const CUForm = ({ columns, form, formData: initialValues }) => {
  return (
    <Form form={form} initialValues={initialValues} layout="vertical">
      <FormColumns
        span={12}
        columns={typeof columns === "function" ? columns(initialValues, form) : columns}
        form={form}
      />
    </Form>
  );
};

const getTableCols = columns => {
  return columns.map(v => {
    const temp = { ...v };
    delete temp.form;
    delete temp.search;
    return temp;
  });
};

const getSearchCols = columns => {
  const temp = [];
  for (const v of columns) {
    if (v.search && v.title !== "action") {
      if(v.search.$$typeof) { // is jsx
        temp.push(v.search);
      } else {
        temp.push({
          label: v.title,
          name: v.dataIndex,
          initialValue: (typeof v.search === "object" && v.search.initialValue) || v.initialValue,
          required: (typeof v.search === "object" && v.search.required) || v.required,
          col: (typeof v.search === "object" && v.search.col) || v.col,
          form: (typeof v.search === "object" && v.search.form) || (v.cu && v.cu.form) || v.form,
        });
      }
    }
  }
  return temp;
};

const getFormCols = columns => {
  const temp = [];
  for (const v of columns) {
    if ((v.cu || v.form) && v.title !== "action") {
      temp.push({
        label: v.title,
        name: v.dataIndex,
        key: v.dataIndex,
        dependencies: v.cu && v.cu.dependencies || v.dependencies,
        required: v.cu && v.cu.required || v.required,
        col: v.cu && v.cu.col || v.col,
        form: v.cu && v.cu.form || v.form,
      });
    }
  }
  return temp;
};

const uniquePush = (source, data) => {
  for (const i in source) {
    if (source[i].title === data.title) {
      return false;
    }
  }

  source.push(data);
};

export default forwardRef(
  (
    {
      name = "",
      columns,
      cuColumns,
      isInitSearch = true,
      cuOptions = {},
      searchColumns,
      actions = {},
      extraActions, // actions column extra action
      titleActions, // table title
      beforeCU,
      afterCreate,
      afterUpdate,
      rowKey = "id",
      rowSelection,
    },
    ref
  ) => {
    const { list, create, update, destroy } = actions;

    const table = {};
    let formInstance = null;

    useImperativeHandle(ref, () => ({
      getTable: () => {
        return table;
      },
      getForm: () => {
        return formInstance;
      },
    }));

    const tableColumns = getTableCols(columns);
    const sColumns = searchColumns || getSearchCols(columns);
    const formColumns = cuColumns || getFormCols(columns);

    if (update || destroy || extraActions) {
      uniquePush(tableColumns, {
        title: "Action",
        width: 20,
        render: (id, row) => (
          <div className="operations">
            {update && <TipButton.Update onClick={() => onUpdate(row)} />}
            {destroy && <TipButton.Delete onClick={() => onDelete(row)} />}
            {extraActions && extraActions(row, table)}
          </div>
        ),
      });
    }

    // console.log(tableColumns, sColumns, formColumns)
    const onCreate = () => {
      const c = () =>
        FormModal.create({
          title: `Create ${name}`,
          okText: "Create",
          ...cuOptions,
          children: form => {
            formInstance = form;
            return <CUForm columns={formColumns} form={form} />;
          },
          onOk: value => {
            return create(value).then(() => {
              afterCreate && afterCreate(value);
              table.reload();
            });
          },
        });

      beforeCU ? beforeCU().then(c) : c();
    };

    const onUpdate = row => {
      const c = (newrow = {}) =>
        FormModal.create({
          title: `Update ${name}`,
          okText: "Update",
          ...cuOptions,
          children: form => <CUForm columns={formColumns} form={form} formData={{...row, ...newrow}} />,
          onOk: value => {
            return update({ ...row, ...value }).then(() => {
              afterUpdate && afterUpdate(value, row);
              table.reload();
            });
          },
        });

      beforeCU ? beforeCU(row).then(c) : c();
    };

    const onDelete = row => {
      Modal.deleteConfirm(() => {
        destroy(row).then(() => {
          table.reload();
        });
      });
    };

    return (
      <div>
        {sColumns.length > 0 && (
          <SearchForm
            columns={sColumns}
            onSearch={values => table.setFilters(values)}
            onReset={values => table.setFilters(values)}
          />
        )}

        <Card
          bordered={false}
          title={name && `${name} Table`}
          className="no-padding-card mt-20"
          extra={
            create && (
              <div className="operations right">
                <Button onClick={onCreate} type="primary" size="small">
                  New
                </Button>
              </div>
            )
          }
        >
          <PageTable
            table={table}
            rowSelection={rowSelection}
            bordered
            isInitSearch={isInitSearch}
            columns={tableColumns}
            title={() => titleActions && titleActions(table)}
            rowKey={rowKey}
            api={params => list(params)}
          />
        </Card>
      </div>
    );
  }
);
