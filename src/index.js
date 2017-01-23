import _ from 'lodash';

class VideoAnalyticsIO {
  constructor(options) {
    const config = options || {};

    const DEFAULT_EVENTS_TO_TRACK = [
      'loaded', // done
      'end', // done
      'seek', // in progress
      'play', // done
      'pause', // done
      'volumeChange', // done
    ];
    const DEFAULT_NUM_DECIMAL_PLACES = 3;
    const DEFAULT_NUM_EVENTS_BEFORE_SENDING = 25;

    this.numEventsBeforeSending =
      config.numEventsBeforeSending || DEFAULT_NUM_EVENTS_BEFORE_SENDING;
    this.eventsToTrack = config.eventsToTrack || DEFAULT_EVENTS_TO_TRACK;
    this.numDecimalPlaces = config.numDecimalPlaces || DEFAULT_NUM_DECIMAL_PLACES;
    this.videoPlayers = [];
  }

  init() {
    this.getAllVideoPlayers();
    this.setEventListeners();
  }

  getAllVideoPlayers() {
    _.forEach(document.getElementsByTagName('video'), (el) => {
      const obj = {
        el,
        ready: false,
        currentTime: 0,
        currentVolume: 1,
        duration: 0,
        seeking: {
          active: false,
          from: 0,
          to: 0,
        },
        events: [],
      };
      this.videoPlayers.push(obj);
    });
  }

  setEventListeners() {
    _.forEach(this.videoPlayers, (obj, index) => {
      if (_.indexOf(this.eventsToTrack, 'loaded') >= 0) {
        obj.el.addEventListener('loadedmetadata', event => this.handleEvent('loaded', event, index));
      }

      if (_.indexOf(this.eventsToTrack, 'play') >= 0) {
        obj.el.addEventListener('play', event => this.handleEvent('play', event, index));
      }

      if (_.indexOf(this.eventsToTrack, 'pause') >= 0) {
        obj.el.addEventListener('pause', event => this.handleEvent('pause', event, index));
      }

      if (_.indexOf(this.eventsToTrack, 'end') >= 0) {
        obj.el.addEventListener('ended', event => this.handleEvent('end', event, index));
      }

      if (_.indexOf(this.eventsToTrack, 'seek') >= 0) {
        obj.el.addEventListener('seeked', event => this.handleEvent('seeked', event, index));
      }

      if (_.indexOf(this.eventsToTrack, 'volumeChange') >= 0) {
        obj.el.addEventListener('volumechange', event => this.handleEvent('volumeChange', event, index));
      }

      obj.el.addEventListener('timeupdate', () => this.timeUpdate(index));
    });
  }

  handleEvent(label, event, index) {
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

    if (label === 'play') {
      this.videoPlayers[index].seeking.active = false;
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
    // TODO send events to server
    this.resetVideoEvents(index);
  }

  resetVideoEvents(index) {
    this.videoPlayers[index].events = [];
  }

  loaded(index) {
    this.videoPlayers[index].ready = true;
    this.videoPlayers[index].duration =
      +(this.videoPlayers[index].el.duration.toFixed(this.numDecimalPlaces));
    this.videoPlayers[index].currentVolume = this.videoPlayers[index].el.volume;
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
