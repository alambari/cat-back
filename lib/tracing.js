const { globalTracer, FORMAT_HTTP_HEADERS, Span, Tags } = require('opentracing');

const ERR_STATUS_CODE = 400;

const startSpanFromCtx = (operationName, headers) => {
  const tracer = globalTracer();

  const prevTraceContext = tracer.extract(
    FORMAT_HTTP_HEADERS,
    headers,
  );

  let parentCtx;
  if (prevTraceContext) {
    parentCtx = prevTraceContext;
  }

  return tracer.startSpan(operationName, { childOf: parentCtx });
};

const makeFinish = (span, req, res, errCallback) => {
  return () => {
    if (errCallback ? errCallback(req, res) : (res.statusCode >= ERR_STATUS_CODE)) {
      span.setTag(Tags.SAMPLING_PRIORITY, 1);
      span.setTag(Tags.ERROR, true);
      span.log({
        event: 'error.status_message',
        message: res.statusMessage,
      });
    }

    span.setTag(Tags.HTTP_STATUS_CODE, res.statusCode);
    span.log({
      event: 'request_ended',
    });

    spanSafeFinish(span);
  };
};  

const spanSafeFinish = (span) => {
  if (!span._duration) {
    span.finish();
  }
};

const startTracing = (config) => {
  return (req, res, next) => {

    const span = startSpanFromCtx(req.path, req.headers);
    res.on('finish', makeFinish(span, req, res, config && config.errCallback));

    span.log({
      event: 'request_started',
    });

    span.addTags({
      [Tags.HTTP_METHOD]: req.method,
      [Tags.HTTP_URL]: req.path,
      'http.full_url': `${req.protocol}://${req.get('host')}${req.originalUrl}`,
    });

    const tracer = span.tracer();

    if (config && config.injectResponseHeader) {
      const injectedHeaders = {};
      tracer.inject(span, FORMAT_HTTP_HEADERS, injectedHeaders);
      res.set(injectedHeaders);
    }

    // add span & tracer to the req object as opentracing
    Object.assign(req, {
      opentracing: {
        traceId: span.context().toTraceId(),
        tracer,
        span,
      },
    });


    next();
  };
};

const endTracing = (errMiddlewareFn) => {
  return (err, req, res, next) => {
    const { opentracing } = req;
    if (opentracing && opentracing.span && opentracing.span instanceof Span) {
      const { span } = opentracing;
      span.setTag(Tags.SAMPLING_PRIORITY, 1);
      span.setTag(Tags.ERROR, true);
      span.log({
          event: 'error.message',
          message: err.message || (['string', 'number'].includes(typeof err) ? err : ''),
      });
      span.log({
        event: 'request_ended',
      });

      spanSafeFinish(span);
    }

    return errMiddlewareFn.apply(null, [err, req, res, next]);
  };
};

module.exports = {
  startTracing,
  endTracing
};