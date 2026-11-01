import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../store/slices/user.slice';
import rolesReducer from '../store/slices/roles.slice';

jest.mock('../config/api.config', () => ({
  API_BASE_URL: 'http://localhost:3000',
}));

import App from './app';

const createTestStore = () =>
  configureStore({
    reducer: {
      user: userReducer,
      roles: rolesReducer,
    },
  });

describe('App', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <Provider store={createTestStore()}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    );
    expect(baseElement).toBeTruthy();
  });
});
