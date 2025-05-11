import { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { type IMessageOptions } from '../../types';
import './styles.css';

export interface MessageBoxHandle {
  showMessage: (msg: string, opts?: IMessageOptions) => void;
}

interface MessageBoxProps {
  message?: string;
  options?: IMessageOptions;
  autoClose?: boolean;
}

const MessageBox = forwardRef<MessageBoxHandle, MessageBoxProps>(({ 
  message = '', 
  options = { type: 'info', duration: 3000 }, 
  autoClose = true 
}, ref) => {
  const [visible, setVisible] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(message);
  const [messageType, setMessageType] = useState(options.type || 'info');

  const showMessage = useCallback((msg: string, opts: IMessageOptions = {}) => {
    setCurrentMessage(msg);
    setMessageType(opts.type || 'info');
    setVisible(true);
    
    if (autoClose && (opts.duration || options.duration)) {
      const duration = opts.duration || options.duration || 3000;
      setTimeout(() => {
        setVisible(false);
      }, duration);
    }
  }, [autoClose, options.duration]);

  // Show message when prop changes
  useEffect(() => {
    if (message) {
      showMessage(message, options);
    }
  }, [message, options, showMessage]);

  // Expose method to parent components
  useImperativeHandle(ref, () => ({
    showMessage
  }));

  if (!visible) return null;

  return (
    <div className={`message-box message-${messageType}`}>
      {currentMessage}
      {!autoClose && (
        <button 
          className="close-button" 
          onClick={() => setVisible(false)}
          aria-label="Close message"
        >
          ×
        </button>
      )}
    </div>
  );
});

MessageBox.displayName = 'MessageBox';

export default MessageBox;