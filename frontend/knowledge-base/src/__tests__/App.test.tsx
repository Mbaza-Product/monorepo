import { render } from '@testing-library/react';
import { Provider } from 'react-redux';

import App from '@/App';
import store from '@/redux/store';

test('renders App correctly', async () => {
  const { findAllByText } = render(
    <Provider store={store}>
      <App />
    </Provider>,
  );
  const elements = await findAllByText(/MediConnect/i);
  expect(elements.length).not.toBe(0);
});
