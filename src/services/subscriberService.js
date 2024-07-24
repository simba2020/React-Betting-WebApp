import { NativeEventSource, EventSourcePolyfill } from 'event-source-polyfill';
import { updateBalance } from 'redux/actions/user';
import eventBus from 'services/eventBus';
import Env from 'utils/Env';
import store from 'redux/configureStore';

const subscriberService = {
  initialize() {
    const EventSource = NativeEventSource || EventSourcePolyfill;
    const url = new URL(Env.PUBLISHER_URL);
    url.searchParams.append('topic', 'sportsbook');
    this.eventSource = new EventSource(url);
    this.eventSource.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      const data = msg.data;
      switch (msg.type) {
        case 'eventodds':
          for (var i in data) {
            eventBus.dispatch('ODDS_' + i, data[i]);
          }
          break;
        case 'eventend':
          eventBus.dispatch('EVENT_' + msg.id, data);
          break;
        case 'timerevent': // needs to be updated with correct name and data format
          eventBus.dispatch('TIMER_' + msg.id, data);
          break;
        default:
          break;
      }
    };
  },
  userInitialize(subId) {
    const EventSource = NativeEventSource || EventSourcePolyfill;
    const url = new URL(Env.PUBLISHER_URL);

    url.searchParams.append('topic', 'uid_' + subId);

    this.eventSource = new EventSource(url);
    this.eventSource.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      const data = msg.data;

      switch (msg.type) {
        case 'balance':
          store.dispatch(updateBalance(data));
          break;
        default:
          break;
      }
    };
  },

  closeEventSource(subId) {
    const EventSource = NativeEventSource || EventSourcePolyfill;
    const url = new URL(Env.PUBLISHER_URL);
    url.searchParams.append('topic', 'uid_' + subId);
    this.eventSource = new EventSource(url);
    this.eventSource.close();
  },
};

export default subscriberService;
