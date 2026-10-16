/* ───────────── Ansicht: Radio · Home Aurora ───────────── */
  _vRadio() {
    const e = this._c.radio?.entity || 'media_player.wohnzimmer';
    const s = this._s(e), a = s?.attributes || {};
    const state = s?.state || 'unavailable';
    const playing = state === 'playing';
    const title = a.media_title || a.media_title_short || (playing ? 'Live-Wiedergabe' : 'Bereit für deinen Lieblingssender');
    const artist = a.media_artist || a.media_album_name || '';
    const stations = this._c.radio?.stations || [];
    const volume = Math.round((Number(a.volume_level) || 0) * 100);
    const presets = stations.map((x, i) => {
      const active = this._radioPreset === x.id;
      return `<button class="rst ${active ? 'on' : ''}" data-act="radio-station" data-id="${esc(x.id)}" style="--ri:${i}">
        <span class="rsico">${ic('music', 21)}</span>
        <span class="rsname">${esc(x.name)}</span>
        <span class="rsgenre">${esc(x.genre || 'Internetradio')}</span>
        <span class="rsplay">${ic('play', 13)}${active ? 'Ausgewählt' : 'Abspielen'}</span>
      </button>`;
    }).join('');
    return `<div class="vh radio-vh">
        <div><h1>Radio</h1><p>Deine Sender · Wohnzimmer Alexa</p></div>
        <span class="radio-live ${playing ? 'on' : ''}"><i></i>${playing ? 'ON AIR' : (state === 'unavailable' ? 'NICHT VERFÜGBAR' : 'BEREIT')}</span>
      </div>
      <div class="bento radio-layout">
        <section class="c radio-deck s12" style="--i:0">
          <div class="radio-decktop">
            <div class="radio-brand"><span class="radio-brandicon">${ic('speaker', 22)}</span><div><div class="radio-eyebrow">HOME AURORA · AUDIO SYSTEM</div><div class="radio-title">SONIC <b>RADIO</b></div></div></div>
            <span class="radio-eq ${playing ? 'playing' : ''}"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span>
          </div>
          <div class="radio-display">
            <div class="radio-freq"><span>FM</span><span class="radio-frequency">LIVE STREAM</span><span class="radio-band">DIGITAL AUDIO</span></div>
            <div class="radio-screen">
              <div class="radio-disc">${ic('music', 30)}</div>
              <div class="radio-track"><div class="radio-track-kicker">${playing ? 'JETZT LÄUFT' : 'AUSGEWÄHLTER LAUTSPRECHER'}</div>
                <div class="radio-track-title">${esc(title)}</div>
                <div class="radio-track-artist">${esc(artist || (playing ? 'Live · Internetradio' : 'Wähle unten einen Sender'))}</div>
              </div>
              <div class="radio-level">${Array.from({length:18},(_,i)=>`<i style="--h:${8+((i*7)%23)}px"></i>`).join('')}</div>
            </div>
            <div class="radio-wave">${Array.from({length:56},(_,i)=>`<span style="--i:${i}"></span>`).join('')}</div>
          </div>
          <div class="radio-controls">
            <button class="radio-transport" data-act="radio-prev" aria-label="Vorheriger Titel">${ic('prev',20)}</button>
            <button class="radio-transport main" data-act="radio-play" aria-label="Wiedergabe oder Pause">${ic(playing ? 'pause' : 'play',24)}</button>
            <button class="radio-transport" data-act="radio-stop" aria-label="Stopp">${ic('power',20)}</button>
            <div class="radio-volume">
              <div class="radio-vol-head"><span>${ic('speaker',16)} LAUTSTÄRKE</span><b>${volume}%</b></div>
              <input type="range" min="0" max="100" value="${volume}" data-act="radio-volume" aria-label="Lautstärke Wohnzimmer">
              <div class="radio-vol-range"><span>0</span><span>50</span><span>100</span></div>
            </div>
          </div>
          <div class="radio-device-row"><span><i class="radio-dot ${playing ? 'on' : ''}"></i>${esc(a.friendly_name || 'Wohnzimmer')}</span>
            <span>${esc(state === 'playing' ? 'Wiedergabe aktiv' : state === 'paused' ? 'Pausiert' : state === 'unavailable' ? 'Player nicht verfügbar' : 'Wartet auf Wiedergabe')}</span>
          </div>
        </section>
        <section class="s12">
          <div class="h">${ic('music',14)} Sender-Favoriten <span class="r">Direkt starten</span></div>
          <div class="radio-presets">${presets}</div>
        </section>
        <section class="c radio-footer s12"><div class="radio-footer-icon">${ic('speaker',22)}</div>
          <div><b>Wiedergabe auf Alexa</b><p>Sender per Favoritentaste starten. Lautstärke, Pause und Stopp steuern den Wohnzimmer-Player.</p></div>
          <button class="qb" data-act="music">${ic('speaker',14)}Alle Player</button>
        </section>
      </div>`;
  }
