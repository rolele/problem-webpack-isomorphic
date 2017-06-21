import React, { Component } from 'react';
import { routePropTypes, routeDefaultProps } from 'helpers'; // eslint-disable-line
import { PureBlog } from 'modules'; // eslint-disable-line
import s from 'theme';

/* eslint-disable */
class EmptyWrapper extends Component { // eslint-disable-line
  render() {
    return (
      <div>
        <button className={`${s.buttonSuccess} ${s.pureButton}`}>Success Button</button>
        <button className={`${s.buttonError} ${s.pureButton}`}>Error Button</button>
        <button className={`${s.buttonWarning} ${s.pureButton}`}>Warning Button</button>
        <button className={`${s.buttonSecondary} ${s.pureButton}`}>Secondary Button</button>
        <PureBlog />
      </div>
    );
  }
}
/* eslint-enable */

EmptyWrapper.propTypes = routePropTypes;
EmptyWrapper.defaultProps = routeDefaultProps;

export default EmptyWrapper;
