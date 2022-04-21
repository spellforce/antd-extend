```js
const handleClick = () => {
  console.log('clicked');
};

const handleClick = () => {
  console.log('clicked');
};

<>
  <Button onClick={handleClickAsync}>onClick 异步</Button>
  <pre />
  <Button onClick={handleClick}>onClick 同步</Button>
  <pre />
  <Button type="ghost">次按钮</Button>
  <pre />
  <Button type="dashed">虚线按钮</Button>
  <pre />
  <Button type="link">链接按钮</Button>
  <pre />
  <Button type="text">文本按钮</Button>
</>;
```
