import Button from '../components/button.component';
import Counter from '../components/counter.component';
import Layout from '../components/layout.component';

export function App() {
  return (
    <Layout>
      <div>
        <h1>Redux Starter</h1>
        <Counter />
        <div>
          <Button>Log in</Button>
        </div>
      </div>
    </Layout>
  );
}

export default App;
