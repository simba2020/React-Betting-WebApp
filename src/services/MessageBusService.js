import { BroadcastChannel } from 'broadcast-channel';
import store from 'redux/configureStore';
import { autoSignIn, abroadTokenRefreshRequest, abroadTokenRequest } from 'redux/reducers/user';

const MessageBusService = (() => {
  const senderName = 'sportsbook';
  const channelName = 'tether.bet';
  const channel = new BroadcastChannel(channelName);

  const listen = () => {
    channel.onmessage = ({ senderName: abroadSenderName, message }) => {
      if (abroadSenderName === senderName) {
        return;
      }

      switch (message.id) {
        case 'ClientProfile/AbroadTokenRequest':
          store.dispatch(abroadTokenRequest());
          break;
        case 'ClientProfile/AbroadTokenRefreshRequest':
          store.dispatch(abroadTokenRefreshRequest());
          break;
        case 'ClientProfile/AbroadSignIn':
          store.dispatch(autoSignIn(message.payload));
          break;
        case 'ClientProfile/AbroadRedirect':
          window.location.replace(message.payload.url);
          break;
        default:
          return;
      }
    };
  };

  const post = async (message) => {
    return channel.postMessage({
      senderName,
      message,
    });
  };

  return {
    listen,
    post,
  };
})();

export default MessageBusService;
