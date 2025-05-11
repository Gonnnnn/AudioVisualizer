import { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react';
import { type IMessageOptions } from '../../types';

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

  // Tailwind classes for different message types
  const messageStyles = {
    info: "bg-pink-500/85 shadow-[0_0_10px_#FF007F,0_0_20px_#FF007F]",
    success: "bg-green-500/85 shadow-[0_0_10px_#00FF00,0_0_20px_#00FF00]",
    error: "bg-red-500/85 shadow-[0_0_10px_#FF0000,0_0_20px_#FF0000]",
    warning: "bg-yellow-400/85 text-black shadow-[0_0_10px_#FFFF00,0_0_20px_#FFFF00]",
  };

  if (!visible) return null;

  return (
    <div 
      className={`fixed bottom-5 left-1/2 -translate-x-1/2 p-4 py-3 rounded-lg z-[1000] text-center text-white shadow-lg animate-[fadeIn_0.3s_ease-in-out] ${messageStyles[messageType as keyof typeof messageStyles]}`}
    >
      {currentMessage}
      {!autoClose && (
        <button 
          className="bg-transparent border-none text-inherit text-lg cursor-pointer ml-2.5 px-1.5 opacity-70 transition-opacity hover:opacity-100" 
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