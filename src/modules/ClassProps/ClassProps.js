/* eslint class-methods-use-this: ["error", { "exceptMethods": ["transform"] }] */

import React, { Component } from 'react';
import { array } from 'prop-types';
import camel from 'to-camel-case';
import Children from 'react-children-utilities';
import s from 'theme'; // eslint-disable-line

class ClassProps extends Component {
  constructor() {
    super();
    this.renderChildren = this.renderChildren.bind(this);
  }

  deepMap(children, deepMapFn) {
    return Children.map(children, (child) => {
      if (child.props && child.props.children && typeof child.props.children === 'object') {
        return deepMapFn(React.cloneElement(child, {
          ...child.props,
          children: this.deepMap(child.props.children, deepMapFn),
        }));
      }
      return deepMapFn(child);
    });
  }

  transform(classes) {
    return classes.split(' ').map(x => s[camel(x)]).join(' ');
  }

  renderChildren() {
    const newChildren = Children.deepMap(this.props.children, (child) => ( // eslint-disable-line arrow-parens
      (child.props && child.props.class) ? React.cloneElement(child, { className: this.transform(child.props.class), class: null }) : child
    ));
    return newChildren;
  }

  render() {
    return (
      <div className="group">
        {this.renderChildren()}
      </div>
    );
  }
}

ClassProps.propTypes = {
  children: array.isRequired,
};

export default ClassProps;
