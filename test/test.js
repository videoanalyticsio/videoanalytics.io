const expect = require('chai').expect;
const _ = require('lodash');
const fs = require('fs');
const path = require('path');

const VideoAnalyticsIO = require('../src/index');

const html = fs.readFileSync(path.resolve(__dirname, './test.html'), 'utf-8');

describe('videoanalytics.io', () => {
  before(() => {
    this.document = require('jsdom-global')(html);
    this.window = document.defaultView;
    vAnalytics = new VideoAnalyticsIO();
    vAnalytics.init();
  });

  it('players array has length of 1', () => {
    const count = _.size(vAnalytics.videoPlayers);
    expect(count).to.be.equal(1);
  });

  after(() => {
    vAnalytics = null;
    this.document(); // cleanup
  });
});

