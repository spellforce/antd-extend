---
nav:
  path: /components
---

## IndependentRangePicker

时间范围选择，antd 官方不提供，所以自己做

```tsx
import React from 'react';
import { IndependentRangePicker } from 'antd-extend-zx';

export default () => (
  <IndependentRangePicker
    label="File Date"
    name={['file_date_min', 'file_date_max']}
    datepickerProps={{ showTime: true }}
  />
);
```
