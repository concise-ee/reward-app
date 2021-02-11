import React from 'react';
import ReactDOM from 'react-dom';
import Quadrant from './Quadrant';

it('It should mount', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Quadrant />, div);
  ReactDOM.unmountComponentAtNode(div);
});