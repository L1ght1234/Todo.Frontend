import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { getWebAutoInstrumentations } from '@opentelemetry/auto-instrumentations-web';
import { defaultResource, resourceFromAttributes } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

const resource = defaultResource().merge(
  resourceFromAttributes({
    [SemanticResourceAttributes.SERVICE_NAME]: 'Todo.Frontend',
    [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0',
  })
);

const exporter = new OTLPTraceExporter({
  url: 'http://localhost:4318/v1/traces',
});

const provider = new WebTracerProvider({
  resource,
  spanProcessors: [new BatchSpanProcessor(exporter)],
});

provider.register({
  contextManager: new ZoneContextManager(),
});

registerInstrumentations({
  instrumentations: [
    getWebAutoInstrumentations({
      '@opentelemetry/instrumentation-xml-http-request': {
        propagateTraceHeaderCorsUrls: [/.*/],
      },
      '@opentelemetry/instrumentation-fetch': {
        propagateTraceHeaderCorsUrls: [/.*/],
      },
    }),
  ],
});