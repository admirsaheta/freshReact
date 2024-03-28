/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import * as React from 'react';
import styles from './styles.module.css';

// need to declare window for typescript stop complaining about fcWidget
declare const window: any;

type FreshchatInitProps = {
  config?: any;
  email?: string;
  externalId?: string;
  faqTags?: any;
  firstName?: string;
  host?: string;
  lastName?: string;
  locale?: string;
  open?: boolean;
  phone?: string;
  phoneCountryCode?: string;
  restoreId?: string;
  tags?: [string];
  token: string;
};

export interface FreshchatStyles {
  backgroundColor: string;
  color: string;
}

export interface FreshChatProps extends FreshchatInitProps {
  icStyles?: FreshchatStyles;
  label?: string;
}

export function Freshchat({ label, icStyles, ...rest }: FreshChatProps) {
  const [isWidgetOpen, setIsWidgetOpen] = React.useState(false);
  const UrlIcon =
    'https://firebasestorage.googleapis.com/v0/b/repfinder-450e2.appspot.com/o/chat.svg?alt=media&token=885c5d28-2165-4a24-a96c-c1b0c98fab3f';

  // Inject FreshChat script in the html
  // oficial doc: https://developers.freshchat.com/web-sdk/#intro
  const loadScript = () => {
    const id = 'freshchat-lib';

    if (document.getElementById(id) || window.fcWidget) return;

    const script = document.createElement('script');
    script.async = true;
    script.type = 'text/javascript';
    script.src = 'https://wchat.freshchat.com/js/widget.js';
    script.id = id;
    document.head.appendChild(script);
  };

  // Init FreshChat with the data passed in
  const init = () => {
    if (label) {
      if (!rest.config) {
        // eslint-disable-next-line no-param-reassign
        rest.config = {
          headerProperty: {
            hideChatButton: true,
          },
        };
      } else {
        // eslint-disable-next-line no-param-reassign
        rest.config = {
          ...rest.config,
          headerProperty: {
            hideChatButton: true,
          },
        };
      }
    }

    // eslint-disable-next-line no-param-reassign
    if (!rest.host) rest.host = 'https://wchat.freshchat.com';

    window.fcWidget.init({
      ...rest,
    });
  };

  const toggleWidget = () => {
    // hide button
    setIsWidgetOpen(true);

    if (window.fcWidget === undefined) return;
    window.fcWidget.open();
    const script = document.createElement('script');
    script.async = true;
    script.type = 'text/javascript';
    script.src = `${window.fcWidget.on('widget:closed', () => {
      // show button
      setIsWidgetOpen(false);
    })}`;
    document.head.appendChild(script);

    const scriptEvent = document.createElement('script');
    scriptEvent.async = true;
    scriptEvent.type = 'text/javascript';
    scriptEvent.src = `${window.fcWidget.on('user:created', () => {
      // eslint-disable-next-line no-console
      console.log('User has been created');
    })}`;
    document.head.appendChild(scriptEvent);
  };

  React.useEffect(() => {
    loadScript();

    // need check if the FresChat was initalized before try to init the icon
    const interval = setInterval(() => {
      if (window.fcWidget) {
        clearInterval(interval);
        try {
          init();
        } catch (error) {
          // eslint-disable-next-line no-console
          console.log(error);
        }
      }
    }, 1000);
  });

  if (!label) {
    return null;
  }

  return !isWidgetOpen ? (
    <div
      id="btn-widget"
      className={styles.buttonContainer}
      onClick={() => toggleWidget()}
    >
      <div
        className={styles.buttonContent}
        style={{
          backgroundColor: icStyles ? icStyles.backgroundColor : '#002d85',
          color: icStyles ? icStyles.color : '#ffffff',
          borderColor: icStyles
            ? `transparent ${icStyles.backgroundColor} transparent transparent`
            : `transparent #002d85 transparent transparent`,
        }}
      >
        <div>{label}</div>
        <img src={UrlIcon} alt="chat icon" width="22px" height="22px" />
      </div>
    </div>
  ) : null;
}
