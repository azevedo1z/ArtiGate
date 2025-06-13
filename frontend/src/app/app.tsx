import Button from '../components/button.component';
import Input from '../components/input.component';
import Layout from '../components/layout.component';
import TextArea from '../components/textarea.component';

export function App() {
  return (
    <Layout>
      <div>
        <h1>Redux Starter</h1>
        <div>
          <Button>Log in</Button>
          <TextArea>Text</TextArea>
        </div>
      </div>
      <Input />
    </Layout>
  );
}

export default App;
