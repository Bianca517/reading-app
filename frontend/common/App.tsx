import React from 'react';
import Navigation from './UI/components/navigation';
import * as Sentry from "@sentry/react-native";
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Warning', 'ExpoFaceDetector']);

Sentry.init({
  dsn: "https://bff5a74ac1918c1dc8f5b6a83d3bc66a@o4507443188400128.ingest.de.sentry.io/4507443202555984",

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for tracing.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
  //debug: true,
  _experiments: {
    // The sampling rate for profiling is relative to TracesSampleRate.
    // In this case, we'll capture profiles for 100% of transactions.
    profilesSampleRate: 1.0,
  },
  integrations: [
    new Sentry.ReactNativeTracing({tracePropagationTargets: ['http://192.168.1.135:8080']})
  ],
});

 function App() {
  return (
    <Navigation />
  );
}


export default Sentry.wrap(App);
