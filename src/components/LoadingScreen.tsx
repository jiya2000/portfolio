import { useState, useEffect, useCallback } from 'react';

interface LoadingScreenProps {
  onStart: () => void;
}

export function LoadingScreen({ onStart }: LoadingScreenProps) {
  const [showBios, setShowBios] = useState(false);
  const [showResources, setShowResources] = useState(false);
  const [resources, setResources] = useState<string[]>([]);
  const [doneLoading, setDoneLoading] = useState(false);

  const [textOpacity, setTextOpacity] = useState(1);
  const [startOpacity, setStartOpacity] = useState(0);
  const [overlayOpacity, setOverlayOpacity] = useState(1);

  const getCurrentDate = () => {
    const d = new Date();
    return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}`;
  };

  // Simulate loading resources
  useEffect(() => {
    setShowBios(true);
    const fakeResources = [
      'deskModel.glb', 'monitorModel.glb', 'bakedTexture.jpg',
      'environment.hdr', 'smudges.jpg', 'shadow.png',
      'keyboard_sfx.mp3', 'startup_sfx.mp3', 'atmosphere.mp3',
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < fakeResources.length) {
        const name = fakeResources[i];
        const spaces = '\u00A0'.repeat(Math.max(0, 24 - name.length));
        const pct = Math.round(((i + 1) / fakeResources.length) * 100);
        setResources(prev => {
          const next = [...prev, `Loaded ${name}${spaces} ... ${pct}%`];
          return next.length > 8 ? next.slice(-8) : next;
        });
        setShowResources(true);
        i++;
      } else {
        clearInterval(interval);
        setDoneLoading(true);
        setTimeout(() => {
          setTextOpacity(0);
          setTimeout(() => setStartOpacity(1), 500);
        }, 800);
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

  const handleStart = useCallback(() => {
    setOverlayOpacity(0);
    setTimeout(() => onStart(), 300);
  }, [onStart]);

  if (overlayOpacity === 0) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      background: '#000', zIndex: 1000,
      opacity: overlayOpacity,
      transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out',
      transform: overlayOpacity === 0 ? 'scale(1.05)' : 'scale(1)',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      fontFamily: "'Share Tech Mono', monospace", color: '#fff',
      fontSize: 16, letterSpacing: '0.8px',
    }}>
      {/* BIOS Header + Body */}
      <div style={{ opacity: textOpacity, transition: 'opacity 0.5s', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ padding: '48px 48px 0 48px', display: 'flex' }}>
          <div>
            <p style={{ color: '#33ff33' }}><b>Sharma,</b></p>
            <p style={{ color: '#33ff33' }}><b>Aditi Inc.</b></p>
          </div>
          <div style={{ marginLeft: 64 }}>
            <p>Released: 07/20/2000</p>
            <p>SABIOS (C)2000 Sharma Aditi Inc.,</p>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '0 48px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <p>SAP S13 2000-2025 Special UC131S</p>
          <div style={{ height: 16 }} />
          {showBios && (
            <>
              <p>SAP Showcase(tm) XX 113</p>
              <p>Checking RAM : 14000 OK</p>
              <div style={{ height: 16 }} />
              <div style={{ height: 16 }} />
              {showResources ? (
                doneLoading ? (
                  <p>FINISHED LOADING RESOURCES</p>
                ) : (
                  <p className="loading">LOADING RESOURCES ({resources.length}/9)</p>
                )
              ) : (
                <p className="loading">WAIT</p>
              )}
            </>
          )}
          <div style={{ height: 16 }} />
          <div style={{ paddingLeft: 32, paddingBottom: 32 }}>
            {resources.map((r, i) => <p key={i}>{r}</p>)}
          </div>
          <div style={{ height: 16 }} />
          {doneLoading && (
            <p>All Content Loaded, launching <b style={{ color: '#33ff33' }}>'Aditi Sharma Portfolio Showcase'</b> V1.0</p>
          )}
          <div style={{ height: 16 }} />
          <span className="blinking-cursor" />
        </div>

        {/* Footer */}
        <div style={{ padding: '0 48px 64px 48px' }}>
          <p>Press <b>DEL</b> to enter SETUP , <b>ESC</b> to skip memory test</p>
          <p>{getCurrentDate()}</p>
        </div>
      </div>

      {/* Start Popup */}
      {startOpacity > 0 && (
        <div style={{
          position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          opacity: startOpacity, transition: 'opacity 0.5s',
        }}>
          <div style={{
            background: '#000', padding: 24, border: '7px solid #fff',
            display: 'flex', flexDirection: 'column', maxWidth: 500,
          }}>
            <p>Aditi Sharma Portfolio Showcase 2025</p>
            <br />
            <div style={{ display: 'flex', alignItems: 'flex-end' }}>
              <p>Click start to begin&nbsp;</p>
              <span className="blinking-cursor" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
              <div
                onClick={handleStart}
                style={{
                  background: '#000', border: '4px solid #fff', cursor: 'pointer',
                  padding: '8px 24px', transition: 'all 0.1s',
                }}
                onMouseEnter={e => { (e.target as HTMLElement).style.background = '#fff'; (e.target as HTMLElement).style.color = '#000'; }}
                onMouseLeave={e => { (e.target as HTMLElement).style.background = '#000'; (e.target as HTMLElement).style.color = '#fff'; }}
              >
                <p style={{ pointerEvents: 'none' }}>START</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Blinking cursor overlay (between transitions) */}
      {startOpacity === 0 && textOpacity === 0 && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', padding: 48 }}>
          <span className="blinking-cursor" />
        </div>
      )}
    </div>
  );
}
