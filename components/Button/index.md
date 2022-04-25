```js

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const handleClickAsync = () => {
  return timeout(2000).then(() => {
    console.log('handleClickAsync');
  });
};

const handleClickAsync2 = async () => {
  await timeout(2000);
  console.log('handleClickAsync2');
};

const handleClick = () => {
  console.log('clicked');
};

<>
  <Button onClick={handleClickAsync}>onClick 异步</Button>
  <Button onClick={handleClickAsync2}>onClick 异步2</Button>
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
