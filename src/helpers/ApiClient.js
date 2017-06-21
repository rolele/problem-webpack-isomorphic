/* global __FAKEAPIURL__:true */

import superagent from 'superagent';

const methods = ['get', 'post', 'put', 'patch', 'del'];

export default class ApiClient {
  constructor(_) {
    this.empty = () => {}; // TODO test remove this

    methods.forEach(method => (
      // the first parameter could be a wrapper around the url like I did for solr
      this[method] = (esindex, { params, data } = {}) => new Promise((resolve, reject) => {
        // TODO check build production work or do you have to JSON.parse
        const baseUrl = __FAKEAPIURL__;
        const url = `${baseUrl}/${esindex}`;
        // TODO remove for production
        console.log(url); // eslint-disable-line no-console
        const request = superagent[method](url);

        if (params) {
          request.query(params);
        }

        // if (__SERVER__ && req.get('cookie')) {
        //   request.set('cookie', req.get('cookie'));
        // }

        if (data) {
          request.send(data);
        }

        request.end((err, { body } = {}) => (err ? reject(body || err) : resolve(body)));
      })));
  }
}
