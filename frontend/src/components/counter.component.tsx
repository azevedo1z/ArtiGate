// src/components/Counter.tsx
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement } from '../store/counter.slice';
import { RootState } from '../store/my.store';

export default function Counter() {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => dispatch(increment())}>+1</button>
      <button onClick={() => dispatch(decrement())}>-1</button>
    </div>
  );
}
