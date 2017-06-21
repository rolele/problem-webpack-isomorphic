import Express from 'express';

// Fake database
const es = [
  { request: 'search',
    response: require('./resources/search1')
  },
  { request: 'suggestions',
    response: require('./resources/suggestions1')
  }
]
const router = Express.Router();

// eg: http://localhost:3000/api/es/search
router.use((req, res) => {
  const [resource, slug] = req.url.substring(1).split('/');

  switch (resource) {
    case 'es':
      if (slug) {
        const response = es.find(a => a.request === slug);
        res.send(response);
      } else {
        res.send(404);
      }
      break
    default:
      res.send(404)
      break
  }
});

module.exports = router;
