import lang from '../lang/pl.json'
import pino from 'pino'

const logger = pino(
  {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
  },
  pino.destination(`${__dirname}/run-logs.log`)
)

export { lang as t, logger }
