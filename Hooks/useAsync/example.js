import React, { useState } from "react";
import { useAsyncLoading } from "../..";

const requestPromiseSuccess = () => {
  return new Promise(resolve => setTimeout(() => resolve("data"), 2000));
}

const requestPromiseFailed = () => {
  return new Promise((r, reject) => setTimeout(() => reject("error"), 2000));
}

const Son = ({ data, r }) => {
  console.log("Son")
  return <div>Son {data} {r}</div>;
};

const Father = () => {
  const [, refresh] = useState(false);
  console.log("Father")
  const [Loading, { data, refresh: r }] = useAsyncLoading(requestPromiseSuccess);
  // const [Loading2, instance] = useAsyncLoading(requestPromiseSuccess, { monitor: 'loading' });
  // console.log(instance);
  return (
    <div>
      <h1>Father</h1>
      <h2 onClick={() => refresh(f => !f)}>Refresh</h2>
      <Loading>
        <Son data={data} r={1} /><h2 onClick={r}>Refresh Son</h2>
      </Loading>
      {/* <Loading2>
        <Son data={instance.data} r={instance.count} /><h2 onClick={() => instance.refresh()}>Refresh Son</h2>
      </Loading2> */}
    </div>
  )
}

export default Father;