const DEFAULTS = {
  EVENTS_TO_TRACK: [
    'loaded',
    'end',
    'seek',
    'play',
    'pause',
    'volumeChange',
  ],
  NUM_DECIMAL_PLACES: 3,
  NUM_EVENTS_BEFORE_SENDING: 25,
  DATA_CALLBACK: (data, callback) => {
    const err = new Error('Callback function for handling video events does not exist.', data);
    callback(err);
  },
};

export default DEFAULTS;
