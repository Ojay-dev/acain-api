export default {
  swagger: '2.0',
  info: {
    version: '1.0.0',
    title: 'Acain',
    description: 'A book publishing app for children.'
  },
  basePath: '/api/v1/',
  schemes: ['https', 'http'],
  securityDefinitions: {
    Bearer: {
      type: 'apiKey',
      name: 'Authorization',
      in: 'header'
    }
  },
  servers: [
    {
      url: 'http://localhost:4000/api/v1'
    },
    {
      url: ''
    }
  ],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [],
  paths: {}
};
