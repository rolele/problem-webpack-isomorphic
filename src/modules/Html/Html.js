// @flow
import React from 'react';
import { string, object, objectOf, shape, func } from 'prop-types';

/* eslint-disable react/no-danger */

const getInitialState = (state) => {
  const json = JSON.stringify(state).replace('</', '<\\/');
  return `window.__INITIAL_STATE__=${json}`;
};

const getAllStyles = assets =>
  Object
  .keys(assets)
  .map(key => assets[key])
  .reduce((acc, { _style }) => {
    if (_style) {
      acc += _style; // eslint-disable-line no-param-reassign
    }
    return acc;
  }, '');

// Look at the json object in webpack-assets.json
// It is generated differently depending on prod vs dev
// maybe it is better to keep the .development(true) with webpack prod as well
// TODO this will go away when you will implement css chuncks anyway
const getAllStylesProd = assets =>
  Object
  .keys(assets)
  .map(key => assets[key])
  .filter(value => Array.isArray(value))
  .reduce((acc, array) => {
    acc += array[0][1]; // eslint-disable-line no-param-reassign
    return acc;
  }, '');

const Html = (props: Object) => {
  const { markup, state, assets: { styles, javascript, assets }, helmet } = props;
  let includeCss = null;
  if (__DEV__) {
    const allStyles = getAllStyles(assets);
    includeCss = (<style dangerouslySetInnerHTML={{ __html: allStyles }} />);
  } else {
    const CleanCSS = require('clean-css'); // eslint-disable-line
    const purifycss = require('purify-css'); // eslint-disable-line
    const allStyles = getAllStylesProd(assets);
    const purifiedCss = purifycss(markup, allStyles);
    const cleanedCss = new CleanCSS({}).minify(purifiedCss);
    includeCss = (<style type="text/css" dangerouslySetInnerHTML={{ __html: cleanedCss.styles }} />);
  }
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        { helmet && helmet.title.toComponent() }
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {Object.keys(styles).map(key => (
          <link key={key} rel="stylesheet" href={styles[key]} />
        ))}
        { includeCss }
      </head>
      <body>
        <div id="app" dangerouslySetInnerHTML={{ __html: markup }} />
        <script dangerouslySetInnerHTML={{ __html: getInitialState(state) }} />
        <script async src={javascript.app} />
      </body>
    </html>
  );
};

Html.displayName = 'Html';

Html.propTypes = {
  markup: string.isRequired,
  state: object.isRequired, // eslint-disable-line
  assets: shape({
    styles: objectOf(string).isRequired,
    javascript: objectOf(string).isRequired,
    assets: object.isRequired,
  }).isRequired,
  helmet: shape({
    title: shape({
      toComponent: func,
    }),
  }),
};

Html.defaultProps = {
  helmet: {},
};

export default Html;

/* eslint-enable react/no-danger */
