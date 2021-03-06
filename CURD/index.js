/* eslint-disable */
import React, { forwardRef, useImperativeHandle } from "react";
import { Card, Form, Button } from "antd";
import TipButton from "../Buttons/TipButton";
import PageTable from "../PageTable";
import Modal from "../Modal";
import CustomForm from "../CustomForm";
import FormColumns from "../FormColumns";
import FormModal from "../FormModal";

const SearchForm = ({ form, columns, onSearch, onReset }) => {
  return (
    <Card bordered={false} title="Search" className="small-padding-card">
      <CustomForm
        form={form}
        columns={columns}
        className="search-form"
        actions={{ text: "Search", onFinish: onSearch }}
        onReset={onReset}
      />
    </Card>
  );
};

const CUForm = ({ columns, form, formData: initialValues }) => {
  const c = typeof columns === "function" ? columns(initialValues, form) : columns;
  return (
    <Form form={form} initialValues={initialValues} layout="vertical">
      <FormColumns
        span={12}
        columns={c}
        form={form}
      />
    </Form>
  );
};

const getTableCols = columns => {
  const c = typeof columns === "function" ? columns() : columns;
  return c.map(v => {
    const temp = { ...v };
    delete temp.form;
    delete temp.search;
    return temp;
  });
};

const getSearchCols = columns => {
  const c = typeof columns === "function" ? columns() : columns;
  const temp = [];
  for (const v of c) {
    if (v.search && v.title !== "action") {
      if (v.search.$$typeof) {
        // is jsx
        temp.push(v.search);
      } else {
        temp.push({
          label: v.title,
          name: v.dataIndex,
          rules: (typeof v.search === "object" && v.search.rules) || v.rules,
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
  const c = typeof columns === "function" ? columns() : columns;
  for (const v of c) {
    if ((v.cu || v.form) && v.title !== "action") {
      temp.push({
        label: v.title,
        name: v.dataIndex,
        key: v.dataIndex,
        rules: (v.cu && v.cu.rules) || v.rules,
        dependencies: (v.cu && v.cu.dependencies) || v.dependencies,
        required: (v.cu && v.cu.required) || v.required,
        col: (v.cu && v.cu.col) || v.col,
        form: (v.cu && v.cu.form) || v.form,
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
      rowActions, // actions column extra action
      titleActions, // table title
      isCard = true,
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
    const searchForm = Form.useForm()[0];

    useImperativeHandle(ref, () => ({
      getTable: () => {
        return table;
      },
      getForm: () => {
        return formInstance;
      },
      getSearchForm: () => {
        return searchForm;
      },
    }));

    const tableColumns = getTableCols(columns);
    const sColumns = searchColumns || getSearchCols(columns);
    const formColumns = cuColumns || getFormCols(columns);

    if (update || destroy || rowActions) {
      uniquePush(tableColumns, {
        title: "Action",
        width: 20,
        render: (id, row) =>
          rowActions ? (
            <div className="operations">
              {rowActions(
                row,
                table,
                (data = row, options) => onUpdate(data, options),
                () => onDelete(row)
              )}
            </div>
          ) : (
            <div className="operations">
              {update && <TipButton.Update onClick={() => onUpdate(row)} />}
              {destroy && <TipButton.Delete onClick={() => onDelete(row)} />}
            </div>
          ),
      });
    }

    // console.log(tableColumns, sColumns, formColumns)
    const onCreate = () => {
      const c = () =>
        FormModal.create({
          title: `New ${name}`,
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

    const onUpdate = (row, modalOptions = {}) => {
      const c = (newrow = {}) =>
        FormModal.create({
          title: `Edit ${name}`,
          okText: "Update",
          ...cuOptions,
          ...modalOptions,
          children: form => {
            formInstance = form;
            return <CUForm columns={formColumns} form={form} formData={{ ...row, ...newrow }} />
          },
          onOk: value => {
            const request = modalOptions.request || update;
            return request({ ...row, ...value }).then(() => {
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
            form={searchForm}
            columns={sColumns}
            onSearch={values => table.setFilters(values)}
            onReset={values => table.setFilters(values)}
          />
        )}

        {isCard ? (
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
              title={titleActions && (() => titleActions(table))}
              rowKey={rowKey}
              api={params => list(params)}
            />
          </Card>
        ) : (
          <PageTable
            table={table}
            rowSelection={rowSelection}
            bordered
            isInitSearch={isInitSearch}
            columns={tableColumns}
            title={
              (create || titleActions) &&
              (() => (
                <div className="operations right">
                  {create && (
                    <Button onClick={onCreate} type="primary" size="small">
                      New
                    </Button>
                  )}
                  {titleActions && titleActions(table)}
                </div>
              ))
            }
            rowKey={rowKey}
            api={params => list(params)}
          />
        )}
      </div>
    );
  }
);
