const { InfluxDB, Point } = require('@influxdata/influxdb-client');

const url = process.env.INFLUX_URL;
const token = process.env.INFLUX_TOKEN;
const org = process.env.INFLUX_ORG;
const bucket = process.env.INFLUX_BUCKET;

let writeApi = null;
let queryApi = null;

if (url && token && org && bucket) {
  const influxDB = new InfluxDB({ url, token });
  writeApi = influxDB.getWriteApi(org, bucket);
  queryApi = influxDB.getQueryApi(org);
  console.log('📡 InfluxDB API initialized');
} else {
  console.warn('⚠️ InfluxDB credentials missing. Metrics will be logged to console only.');
}

const writeMetrics = (apiKey, metrics) => {
  if (!writeApi) {
    // Fallback: Log to console if InfluxDB is not configured
    console.log(`[STORAGE-MOCK] Writing metrics for ${apiKey}:`, JSON.stringify(metrics, null, 2));
    return;
  }

    metrics.forEach(m => {
      const point = new Point(m.type)
        .tag('project_key', apiKey);

      // --- TAGGING PROTOCOL ---
      // Elevate critical metadata to tags for grouping support
      if (m.type === 'api_performance') {
        if (m.data.path) point.tag('path', m.data.path);
        if (m.data.method) point.tag('method', m.data.method);
      }
      if (m.type === 'db_performance') {
        if (m.data.query) point.tag('query', m.data.query);
      }
      // ------------------------

      // Dynamic field mapping
      for (const [key, value] of Object.entries(m.data)) {
        // Skip keys already promoted to tags
        if (['path', 'method', 'query'].includes(key)) continue;

        if (typeof value === 'number') {
          point.floatField(key, value);
        } else {
          point.stringField(key, value);
        }
      }

      point.timestamp(new Date(m.timestamp));
      writeApi.writePoint(point);
    });

  // Simplified flush for this demo; in production use a more robust strategy
  writeApi.flush().catch(err => console.error('InfluxDB Flush Error:', err));
};

const queryMetrics = async (fluxQuery) => {
  if (!queryApi) return [];
  return await queryApi.collectRows(fluxQuery);
};

module.exports = { writeMetrics, queryMetrics };
