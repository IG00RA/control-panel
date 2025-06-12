import { Page } from '@strapi/strapi/admin';
import { Routes, Route } from 'react-router-dom';

import ShortLinkCreator from './HomePage';

const App = () => {
  return (
    <Routes>
      <Route index element={<ShortLinkCreator />} />
      <Route path="*" element={<Page.Error />} />
    </Routes>
  );
};

export { App };
