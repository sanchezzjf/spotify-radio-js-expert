import config from './config.js'
import server from './server.js'
import { logger } from './util/logger.js'


server.listen(config.port)
.on('listening', () => logger.info('Running on port 3000'))