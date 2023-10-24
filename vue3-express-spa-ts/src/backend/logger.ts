import _isPlainObject from 'lodash/isPlainObject';
import bunyan, { LogLevel } from 'bunyan';

const notEmptyObject = (obj: any) => _isPlainObject(obj) && Object.keys(obj).length > 0;

const serializers = {
  req(req: any) {
    if (req && typeof req.method === 'string' && typeof req.url === 'string') {
      const { method, url, originalUrl, headers, params, query, body, file, files } = req;
      return {
        method,
        url: originalUrl || url, // Support Express's Router
        route: req.route?.path,
        headers,
        params: notEmptyObject(params) ? params : undefined,
        query: notEmptyObject(query) ? query : undefined,
        body: notEmptyObject(body) ? body : undefined,
        file: notEmptyObject(file) ? file : undefined,
        files: Array.isArray(files) && files.length ? files : undefined,
      };
    }

    return req;
  },
  res(res: any) {
    if (res && typeof res.statusCode === 'number' && typeof res.getHeaders === 'function') {
      const { statusCode } = res;
      const headers = res.getHeaders();
      return { statusCode, headers };
    }

    return res;
  },
  err(err: any | any[]): any {
    if (Array.isArray(err)) {
      return err.map(e => serializers.err(e));
    } else if (err instanceof Error) {
      const output = bunyan.stdSerializers.err(err);

      Object.entries(err).forEach(([ key, value ]) => {
        if (key !== 'message' && key !== 'stack') {
          output[key] = value;
        }
      });

      const cycles = bunyan.safeCycles();
      return JSON.parse(JSON.stringify(output, (key, value) => {
        if (value && typeof value === 'object' && value?.type === 'Buffer' && Array.isArray(value?.data)) {
          // eslint-disable-next-line no-param-reassign
          return `[Buffer (length=${value.data.length})]`;
        } else {
          return cycles(key, value);
        }
      }));
    } else {
      return err;
    }
  },
};

const logger = bunyan.createLogger({
  name: process.env.LOG_NAME || 'vue3-express-spa-ts',
  level: process.env.LOG_LEVEL as LogLevel || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  serializers,
});

export default logger;
