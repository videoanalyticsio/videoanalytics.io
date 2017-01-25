# videoanalytics.io

[![Build Status](https://img.shields.io/travis/videoanalyticsio/videoanalytics.io/master.svg)](https://travis-ci.org/videoanalyticsio/videoanalytics.io) [![Coverage Status](https://img.shields.io/coveralls/videoanalyticsio/videoanalytics.io/master.svg)](https://coveralls.io/github/videoanalyticsio/videoanalytics.io?branch=master) [![dependencies Status](https://img.shields.io/david/videoanalyticsio/videoanalytics.io.svg)](https://david-dm.org/videoanalyticsio/videoanalytics.io) [![devDependencies Status](https://img.shields.io/david/dev/videoanalyticsio/videoanalytics.io.svg)](https://david-dm.org/videoanalyticsio/videoanalytics.io?type=dev) [![Slack Status](http://slack.videoanalytics.io/badge.svg)](http://slack.videoanalytics.io)

> Thanks for checking out the **videoanalytics.io** npm module. It's still a work-in-progress. Check back soon for updates!
> If you'd like to contribute to the project, join the [Slack group](http://slack.videoanalytics.io) and drop us a line!

## Installation

The fastest way to get started is to serve JavaScript from the [unpkg](https://unpkg.com/) CDN:

```html
<!-- Unminified -->
<script src="https://unpkg.com/videoanalytics.io@0.1.0/dist/videoanalytics.io.js"></script>

<!-- Minified -->
<script src="https://unpkg.com/videoanalytics.io@0.1.0/dist/videoanalytics.io.min.js"></script>
```

If you'd like to use [npm](https://www.npmjs.com/), it's as easy as:

```sh
npm -i --save videoanalytics.io
```

## Getting Started

To use, instantiate `VideoAnalyticsIO()` and call the `init()` method:

```javascript
var vAnalytics = new VideoAnalyticsIO()
vAnalytics.init({
  DATA_CALLBACK: (data, callback) => {
    // do what you wish with the data, e.g., send to your server
    console.log(data);
    callback();
  },
});
```

For more examples, see the `examples/` directory.

### Configuration Options
When calling `init()`, you must pass in a configuration object. The following fields may be used:

| Option | Required | Description | Default |
| ------ | ---------| ----------- | ------- |
| DATA_CALLBACK | Yes | Function, A callback function to handle new user interactions | None |
| EVENTS_TO_TRACK | No | Array, User interactions to track (e.g., play, pause, seek) | `['loaded','end','seek','play','pause','volumeChange']` |
| NUM_DECIMAL_PLACES | No | Integer, Number of decimal places to round (e.g., 12.682) | 3 |
| NUM_EVENTS_BEFORE_SENDING | No | Integer, Number of events per video to store before calling the function in `DATA_CALLBACK` | 25 |

The default options can be seen in `src/config.defaults.js`.

## License
[MIT License](LICENSE.md)
