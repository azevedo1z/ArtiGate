import Button from '../components/button.component';
import Layout from '../components/layout.component';

export function App() {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1>Join now.</h1>
        <Button>Log in</Button>
      </div>
    </Layout>
  );
}

export default App;
