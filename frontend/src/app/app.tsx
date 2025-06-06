import Button from '../components/button.component';
import Counter from '../components/counter.component';

export function App() {
  return (
    <div>
      <h1>Redux Starter</h1>
      <Counter />
      <div>
        <Button>Log in</Button>
      </div>
    </div>
  );
}

export default App;
