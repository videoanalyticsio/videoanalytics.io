import _ from 'lodash';

import DEFAULTS from './config.defaults';

class VideoAnalyticsIO {
  constructor() {
    this.videoPlayers = [];
  }

  init(options) {
    const config = options || DEFAULTS;

    this.numEventsBeforeSending =
      config.NUM_EVENTS_BEFORE_SENDING || DEFAULTS.NUM_EVENTS_BEFORE_SENDING;
    this.eventsToTrack = config.EVENTS_TO_TRACK || DEFAULTS.EVENTS_TO_TRACK;
    this.numDecimalPlaces = config.NUM_DECIMAL_PLACES || DEFAULTS.NUM_DECIMAL_PLACES;
    this.dataCallback = config.DATA_CALLBACK || DEFAULTS.DATA_CALLBACK;

    this.getAllVideoPlayers();
    this.setEventListeners();
  }

  getAllVideoPlayers() {
    _.forEach(document.getElementsByTagName('video'), (el) => {
      const obj = {
        el,
        title: '',
        ready: false,
        currentTime: 0,
        currentVolume: 1,
        duration: 0,
        events: [],
      };
      this.videoPlayers.push(obj);
    });
  }

  setEventListeners() {
    _.forEach(this.videoPlayers, (obj, index) => {
      if (_.indexOf(this.eventsToTrack, 'loaded') >= 0) {
        const handleLoaded = (i) => {
          this.handleEvent('loaded', i);
        };
        obj.el.addEventListener('loadedmetadata', () => handleLoaded(index));

        // Check video readyState if metadata is loaded before the loadedmetadata event fires
        if (obj.el.readyState >= 1) {
          handleLoaded(index);
        }
      }

      if (_.indexOf(this.eventsToTrack, 'play') >= 0) {
        obj.el.addEventListener('play', () => this.handleEvent('play', index));
      }

      if (_.indexOf(this.eventsToTrack, 'pause') >= 0) {
        obj.el.addEventListener('pause', () => this.handleEvent('pause', index));
      }

      if (_.indexOf(this.eventsToTrack, 'end') >= 0) {
        obj.el.addEventListener('ended', () => this.handleEvent('end', index));
      }

      if (_.indexOf(this.eventsToTrack, 'seek') >= 0) {
        obj.el.addEventListener('seeked', () => this.handleEvent('seeked', index));
      }

      if (_.indexOf(this.eventsToTrack, 'volumeChange') >= 0) {
        obj.el.addEventListener('volumechange', () => this.handleEvent('volumeChange', index));
      }

      obj.el.addEventListener('timeupdate', () => this.timeUpdate(index));
    });
  }

  handleEvent(label, index) {
    const video = this.videoPlayers[index];
    let append = true;
    if (label === 'loaded') {
      this.loaded(index);
    }

    const eventObj = {
      type: label,
      playbackTime: +(video.el.currentTime.toFixed(this.numDecimalPlaces)),
      timestamp: Date.now(),
    };

    if (label === 'volumeChange') {
      const volume = video.el.volume.toFixed;
      eventObj.metaData = {
        previous: video.currentVolume,
        current: volume,
      };
      if (Math.abs(volume - video.currentVolume) >= 0.1) {
        this.videoPlayers[index].currentVolume = volume;
      } else {
        append = false;
      }
    }

    if (label === 'seeked') {
      const prev = video.currentTime;
      const curr = +(this.videoPlayers[index].el.currentTime.toFixed(this.numDecimalPlaces));
      this.videoPlayers[index].currentTime = curr;
      if (Math.abs(curr - prev) < 1) {
        append = false;
      }
    }

    if (label === 'end') {
      this.videoPlayers[index].events = _.dropRightWhile(this.videoPlayers[index].events, ['type', 'pause']);
    }

    if (append) {
      this.videoPlayers[index].events.push(eventObj);
      const numEvents = _.size(this.videoPlayers[index].events);
      if (numEvents >= this.numEventsBeforeSending) {
        this.sendEventsForVideo(index);
      }
    }
  }

  sendEventsForVideo(index) {
    const obj = {
      meta: {
        title: this.videoPlayers[index].title,
        duration: this.videoPlayers[index].duration,
      },
      events: this.videoPlayers[index].events,
    };
    this.dataCallback(obj, (error) => {
      if (error) throw error;
      this.resetVideoEvents(index);
    });
  }

  resetVideoEvents(index) {
    this.videoPlayers[index].events = [];
  }

  loaded(index) {
    this.videoPlayers[index].ready = true;
    this.videoPlayers[index].duration =
      +(this.videoPlayers[index].el.duration.toFixed(this.numDecimalPlaces));
    this.videoPlayers[index].currentVolume = this.videoPlayers[index].el.volume;

    // Get the video title with the data-title attribute or "guess" it by using the path
    // to the video, extracting out the file extension (e.g., examples/videos/big_buck_bunny).
    this.videoPlayers[index].title = this.videoPlayers[index].el.getAttribute('data-title') ||
      this.videoPlayers[index].el.currentSrc.split('/').slice(3).join('/').replace(/\.(\w{3,4})(\?.*)?$/i, '');
  }

  timeUpdate(index) {
    const prev = this.videoPlayers[index].currentTime;
    const curr = +(this.videoPlayers[index].el.currentTime.toFixed(this.numDecimalPlaces));
    if (Math.abs(curr - prev) < 1) {
      this.videoPlayers[index].currentTime = curr;
    }
  }
}

module.exports = VideoAnalyticsIO;
