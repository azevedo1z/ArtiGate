import React, { useState } from 'react';
import Button from './button.component';

const Counter: React.FC = () => {
  const [count, setCount] = useState(0);

  const increment = () => setCount((c) => c + 1);
  const decrement = () => setCount((c) => c - 1);

  return (
    <div>
      <h2>Counter: {count}</h2>
      <Button onClick={decrement}>-</Button>
      <Button onClick={increment}>+</Button>
    </div>
  );
};

export default Counter;