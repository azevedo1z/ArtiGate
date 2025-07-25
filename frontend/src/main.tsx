import { BrowserRouter } from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';
import App from './app/app';
import { Provider } from 'react-redux';
import myStore from './store/my.store';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
    <Provider store={myStore}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
);
