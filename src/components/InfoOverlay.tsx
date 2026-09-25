import { useEffect, useState, useRef } from 'react';

interface InfoOverlayProps {
  visible: boolean;
}

const NAME = 'Aditi Sharma';
const TITLE = 'Software Engineer';

export function InfoOverlay({ visible }: InfoOverlayProps) {
  const [nameText, setNameText] = useState('');
  const [titleText, setTitleText] = useState('');
  const [timeText, setTimeText] = useState('');
  const [textDone, setTextDone] = useState(false);
  const visRef = useRef(visible);

  const typeText = (
    i: number,
    cur: string,
    full: string,
    setter: (s: string) => void,
    cb: () => void,
  ) => {
    if (i < full.length) {
      setTimeout(() => {
        setter(cur + full[i]);
        typeText(i + 1, cur + full[i], full, setter, cb);
      }, Math.random() * 50 + 50);
    } else {
      cb();
    }
  };

  useEffect(() => {
    if (visible && nameText === '') {
      setTimeout(() => {
        typeText(0, '', NAME, setNameText, () => {
          typeText(0, '', TITLE, setTitleText, () => {
            const t = new Date().toLocaleTimeString();
            typeText(0, '', t, setTimeText, () => setTextDone(true));
          });
        });
      }, 400);
    }
    visRef.current = visible;
  }, [visible]);

  // Update time
  useEffect(() => {
    if (!textDone) return;
    const iv = setInterval(() => setTimeText(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(iv);
  }, [textDone]);

  return (
    <div style={{
      position: 'absolute',
      top: 64, left: 64,
      display: 'flex', flexDirection: 'column',
      width: '100%', pointerEvents: 'auto',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateX(0)' : 'translateX(-32px)',
      transition: 'opacity 0.5s ease-out 0.3s, transform 0.5s ease-out 0.3s',
      fontFamily: "'Share Tech Mono', monospace",
    }}>
      {nameText && (
        <div style={{ background: '#000', padding: '4px 16px', marginBottom: 4, display: 'inline-flex', alignSelf: 'flex-start' }}>
          <p style={{ color: '#fff' }}>{nameText}</p>
        </div>
      )}
      {titleText && (
        <div style={{ background: '#000', padding: '4px 16px', marginBottom: 4, display: 'inline-flex', alignSelf: 'flex-start' }}>
          <p style={{ color: '#fff' }}>{titleText}</p>
        </div>
      )}
      {timeText && (
        <div style={{ display: 'flex', gap: 4 }}>
          <div style={{ background: '#000', padding: '4px 16px', display: 'inline-flex' }}>
            <p style={{ color: '#fff' }}>{timeText}</p>
          </div>
        </div>
      )}
    </div>
  );
}
