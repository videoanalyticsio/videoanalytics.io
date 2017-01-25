# videoanalytics.io

[![Build Status](https://img.shields.io/travis/videoanalyticsio/videoanalytics.io/master.svg)](https://travis-ci.org/videoanalyticsio/videoanalytics.io) [![Coverage Status](https://img.shields.io/coveralls/videoanalyticsio/videoanalytics.io/master.svg)](https://coveralls.io/github/videoanalyticsio/videoanalytics.io?branch=master) [![dependencies Status](https://img.shields.io/david/videoanalyticsio/videoanalytics.io.svg)](https://david-dm.org/videoanalyticsio/videoanalytics.io) [![devDependencies Status](https://img.shields.io/david/dev/videoanalyticsio/videoanalytics.io.svg)](https://david-dm.org/videoanalyticsio/videoanalytics.io?type=dev) [![Slack Status](http://slack.videoanalytics.io/badge.svg)](http://slack.videoanalytics.io)

> Thanks for checking out the **videoanalytics.io** npm module. It's still a work-in-progress. Check back soon for updates!
> If you'd like to contribute to the project, join the [Slack group](http://slack.videoanalytics.io) and drop us a line!

## Installation

The fastest way to get started is to serve JavaScript from the [unpkg](https://unpkg.com/) CDN:

```html
<!-- Unminified -->
<script src="https://unpkg.com/videoanalytics.io@0.1.2/dist/videoanalytics.io.js"></script>

<!-- Minified -->
<script src="https://unpkg.com/videoanalytics.io@0.1.2/dist/videoanalytics.io.min.js"></script>
```

If you'd like to use [npm](https://www.npmjs.com/), it's as easy as:

```sh
npm -i --save videoanalytics.io
```

## Getting Started

```javascript
const vAnalytics = new VideoAnalyticsIO();
vAnalytics.init((data, done) => {
  // do what you want with data
  console.log(data);
  done();
});
```

### Configuration

```javascript
vAnalytics.init([options], callback);
```
* `EVENTS_TO_TRACK`: an array of user interactions to track (e.g., play, pause, seek)
* `NUM_DECIMAL_PLACES`: an integer for the number of decimal places to round (e.g., 12.68)
* `NUM_EVENTS_BEFORE_SENDING`: an integer for the number of events per video to store before calling your provided callback function

The default options can be seen in `src/config.defaults.js`.

### Examples

For full examples, see the `examples/` directory.

## License
[MIT License](LICENSE.md)
