import React from 'react';
import ReactDOM from 'react-dom';
import Cloud from './Cloud';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Cloud />, div);
  ReactDOM.unmountComponentAtNode(div);
});