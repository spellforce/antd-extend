import * as React from 'react';
// import { } from '_'

function useDeepCompareMemoize(value) {
  const ref = React.useRef();
  const signalRef = React.useRef(0);
  // console.log(JSON.stringify(value), JSON.stringify(ref.current), JSON.stringify(value) === JSON.stringify(ref.current))
  if (JSON.stringify(value) !== JSON.stringify(ref.current)) {
    ref.current = value;
    signalRef.current += 1;
  }

  return [signalRef.current];
}

export function useDeepCompareEffect(callback, dependencies) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return React.useEffect(callback, useDeepCompareMemoize(dependencies));
}

export default useDeepCompareEffect;
