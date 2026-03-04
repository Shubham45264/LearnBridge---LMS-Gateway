import { getDBStatus } from "../database/db.js";

export const checkHealth = async (req, res) => {
  try {
    const dbStatus = getDBStatus();

    // Safety check for dbStatus
    const isConnected = !!dbStatus?.isConnected;
    const readyState = dbStatus?.readyState ?? 0;

    const healthStatus = {
      status: 'OK',
      timeStamp: new Date().toISOString(),
      services: {
        database: {
          status: isConnected ? 'healthy' : 'unhealthy',
          details: {
            isConnected,
            readyState: getReadyStateText(readyState),
            host: dbStatus?.host || 'unknown',
            name: dbStatus?.name || 'unknown'
          }
        },
        server: {
          status: 'healthy',
          uptime: process.uptime(),
          memoryUsage: process.memoryUsage(),
        }
      }
    };

    const httpStatus = healthStatus.services.database.status === 'healthy' ? 200 : 503;
    res.status(httpStatus).json(healthStatus);
  } catch (error) {
    console.error('Health check failed:', error);
    console.log(error.stack);
    res.status(500).json({ status: 'error', timeStamp: new Date().toISOString(), error: error.message });
  }

};


// utility method
function getReadyStateText(state) {
  switch (state) {
    case 0:
      return "DISCONNECTED";
    case 1:
      return "CONNECTED";
    case 2:
      return "CONNECTING";
    case 3:
      return "DISCONNECTED";
    default:
      return "UNKNOWN";
      break;
  }
}