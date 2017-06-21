
## install
```
node --version
#v8.1.2
npm i
```

```
npm run dev
#
```

## First problem + webpack isomorphic and hot reload not working.

At startup is ok.
I start editing `modules/EmptyWrapper/EmptyWrapper.scss` and save:
```
./~/css-loader?modules&localIdentName=[hash:base64:4]&importLoaders=1&sourceMap&camelCase=true!../~/postcss-loader/lib?{"sourceMap":true}!../~/sass-loader/lib/loader.js?{"sourceMap":true}!./theme/purecss.scss
Module build failed: Error: Module did not self-register.
```

Some shenanigans I am doing:
1)
`module/EmptyWrapper.js` require `theme/index.jss` which import my main scss: `theme/purecss.scss` which in turn importing all the scss:
```
@import '~purecss-sass/vendor/assets/stylesheets/_purecss.scss';
@import '../modules/PureBlog/PureBlog.scss';
@import '../modules/EmptyWrapper/EmptyWrapper.scss';
```
Having this global scss is very conveniant I think (those libs are very small).
2)
`ClassProps` component is just to speed up development.
This is a parent component that will change his children and dynamically change their classes to the js version of the style.
3)
The hot relad happen in `webpack.dev.server.js`. 
I start the compiler manually to bootstrap isomorphic tools in `bin/server.js`
I tried to follow the exmaple https://github.com/glenjamin/ultimate-hot-reloading-example on hot reload but I am not sure my setup is great yet.

## Second problem - assets.json for production is not really practical

I want my server-side rendering to calculate the critical css and insert it in the page in addition of the <link> tag to the full css.

On dev `modules/Html.js`, `getAllStyles` will get the _style key from isomorphic assets props

On production (on the server) it is actually much more difficult to find all the styles when rendering the first page using Html.js:
```
const getAllStylesProd = assets =>
  Object
  .keys(assets)
  .map(key => assets[key])
  .filter(value => Array.isArray(value))
  .reduce((acc, array) => {
    acc += array[0][1];
    return acc;
  }, '');
```
Why does the structure of the assets has to change that much?
I am pretty sure this will breack as soon as I have more that 1 css right?
