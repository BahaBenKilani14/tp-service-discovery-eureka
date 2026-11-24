
const app = require('./app');
const { Eureka } = require('eureka-js-client');

const PORT = Number(process.env.PORT || 8083);

// Configuration Eureka Client
const client = new Eureka({
  instance: {
    app: 'meeting',
    instanceId: `localhost:meeting:${PORT}`,
    hostName: 'localhost',
    ipAddr: '127.0.0.1',
    status: 'UP',
    port: {
      '$': PORT,
      '@enabled': true
    },
    vipAddress: 'meeting',
    dataCenterInfo: {
      '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
      name: 'MyOwn'
    }
  },
  eureka: {
    host: 'localhost',
    port: 8761,
    servicePath: '/eureka/apps/'
  }
});

// Démarrage du microservice
app.listen(PORT, () => {
  console.log(`meeting microservice running on http://localhost:${PORT}`);
  console.log(`Swagger UI: http://localhost:${PORT}/swagger-ui`);

  client.start((error) => {
    if (error) {
      console.error('Eureka registration failed:', error);
    } else {
      console.log('MEETING registered successfully in Eureka');
    }
  });
});

// Désenregistrement à l'arrêt
process.on('SIGINT', () => {
  client.stop(() => process.exit(0));
});
