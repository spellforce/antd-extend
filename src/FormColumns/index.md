---
nav:
  path: /components
---

## FormColumns

```tsx
import React, { useState } from 'react';
import { Form } from 'antd';
import { FormColumns } from 'antd-extend-zx';

export default () => {
  const form = Form.useForm()[0];
  const columns = [
    {
      label: 'Action Code',
      name: 'action_code',
      required: true,
      form: {
        type: 'password',
        autoComplete: 'off',
      },
    },
  ];

  return (
    <Form>
      <FormColumns span={12} columns={columns} form={form} />
    </Form>
  );
};
```

<API></API>
