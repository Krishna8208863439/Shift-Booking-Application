import Hapi from 'hapi';
import Request from 'hapi/lib/request';

// Node 18+ compatibility: In Node 18+, IncomingMessage emits 'close' when done,
// which Hapi 17 mistakenly treats as an aborted connection.
const origListen = Request.prototype._listen;
Request.prototype._listen = function() {
  origListen.call(this);
  this.raw.req.removeAllListeners('close');
  this.raw.req.on('close', () => {
    if (!this.raw.req.complete) {
      this._eventContext.request = null;
    }
  });
};

const server = new Hapi.Server({
  host: process.env.HOST || '0.0.0.0',
  port: process.env.PORT || '8080',
  routes: {
    cors: { origin: 'ignore' },
  },
});

async function main() {
  await server.register([{
    plugin: require('./shifts-mock-api'),
    routes: { prefix: '/shifts' },
  }]);

  await server.start();

  console.info(`✅  API server is listening at ${server.info.uri.toLowerCase()}`);
}

main();
