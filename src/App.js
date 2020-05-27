import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Test from './components/Test';

const App = () => {
  return (
    <Router>
      <Route path="/" exact component={Test} />
    </Router>
  );
};

export default App;
