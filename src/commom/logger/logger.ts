import pino from 'pino';
import pinoLoki from 'pino-loki';

const logger = pino({
  level: 'info',
  transport: {
    target: 'pino-loki',
    options: {
      host: 'http://localhost:3100', // endpoint do Loki
      labels: { service: 'connpet-server' }, // label que aparecerá no Grafana
      json: true,
    },
  },
});

export default logger;
