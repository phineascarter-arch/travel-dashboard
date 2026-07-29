(function () {
  'use strict';

  const STORAGE_KEY = 'rtwDashboardState_v1';

  const REGION_LABELS = { asia: '亞洲', europe: '歐洲', americas: '美洲', oceania: '大洋洲', africa: '非洲' };
  const REGION_ORDER = ['asia', 'europe', 'americas', 'oceania', 'africa'];
  const VISA_LABELS = {
    visa_free: '免簽證',
    eta: 'ETA電子許可',
    voa: '落地簽證',
    evisa: '電子簽證',
    visa_required: '需辦簽證',
    restricted: '入境受限',
  };
  const VISA_CLASS = {
    visa_free: 'vfree',
    eta: 'veta',
    voa: 'vvoa',
    evisa: 'vevisa',
    visa_required: 'vreq',
    restricted: 'vrestricted',
  };
  const SAFETY_LABELS = {
    grey: '灰色提醒',
    yellow: '黃色注意',
    orange: '橙色避免前往',
    red: '紅色儘速離境',
  };
  const YELLOW_FEVER_LABELS = {
    required: '需黃熱病證明',
    conditional: '視情況需黃熱病證明',
  };
  // 申根區 29 國，90/180 天規則跨國共用同一個天數額度（跟 seed-countries.js 的
  // 「歐洲：申根區」分組一致）。
  const SCHENGEN_IDS = ['fr', 'de', 'it', 'es', 'pt', 'nl', 'at', 'ch', 'gr', 'cz', 'pl', 'hu', 'hr', 'se', 'no', 'is', 'be', 'dk', 'fi', 'lu', 'mt', 'si', 'sk', 'ee', 'lv', 'lt', 'bg', 'ro', 'li'];
  const STATUS_LABELS = {
    '': '－ 尚未設定 －',
    idea: '💭 想去看看',
    planned: '📝 已規劃',
    booked: '🎫 已訂票/訂房',
    done: '✅ 已完成',
  };

  const GENERAL_CHECKLIST = [
    { id: 'g_passport', label: '護照效期還有6個月以上' },
    { id: 'g_copies', label: '護照/簽證影本（紙本＋雲端備份）' },
    { id: 'g_insurance', label: '旅遊平安險／海外醫療險' },
    { id: 'g_bank', label: '信用卡／提款卡海外用卡預告' },
    { id: 'g_emergency', label: '緊急聯絡人資訊卡' },
    { id: 'g_idp', label: '國際駕照（如需自駕）' },
    { id: 'g_meds', label: '常備藥品與英文/當地語言處方箋' },
    { id: 'g_vaccine', label: '國際預防接種證書（黃皮書，如目的地需要黃熱病等疫苗證明）' },
  ];

  // ---------- state ----------
  function defaultState() {
    return {
      customCountries: [], overrides: {}, personalNotes: {}, status: {}, route: [], schedule: {},
      checklist: { done: {}, customGeneral: [], customCountry: {} },
      homeCurrency: 'TWD',
      budget: { perStop: {}, availableFunds: null },
      cities: {},
      legTransport: {},
      emergencyCard: { insurerName: '', insurerPhone: '', medicalNote: '', passportNo: '', cards: [], contacts: [] },
    };
  }

  // route entries used to be plain country-id strings (one visit per country, max).
  // Migrate to { id: stopId, countryId } objects so a country can be visited more than
  // once (e.g. transiting the same hub twice). Reusing the old country id as the stopId
  // for migrated entries means existing schedule/cities/budget data (keyed by that same
  // string under the old scheme) keeps resolving correctly without a separate remap.
  function migrateRoute(route) {
    if (!Array.isArray(route)) return [];
    return route.map(function (entry) {
      if (typeof entry === 'string') return { id: entry, countryId: entry };
      return entry;
    });
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) throw new Error('empty');
      const parsed = JSON.parse(raw);
      const merged = Object.assign(defaultState(), parsed);
      merged.route = migrateRoute(merged.route);
      return merged;
    } catch (e) {
      return defaultState();
    }
  }

  let state = loadState();
  let selectedId = null;

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function newStopId() {
    return 'stop_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  function findStopIndex(stopId) {
    return state.route.findIndex(function (r) { return r.id === stopId; });
  }

  // ---------- data ----------
  function getAllCountries() {
    const seeded = SEED_COUNTRIES.map(function (c) {
      const ov = state.overrides[c.id];
      return ov ? Object.assign({}, c, ov, { isCustom: false }) : Object.assign({}, c, { isCustom: false });
    });
    const custom = state.customCountries.map(function (c) {
      return Object.assign({}, c, { isCustom: true });
    });
    return seeded.concat(custom);
  }

  function findCountry(id) {
    return getAllCountries().find(function (c) { return c.id === id; });
  }

  function formatFee(country) {
    if (country.fee === null || country.fee === undefined) {
      return country.visaType === 'visa_free' ? '' : '費用待查證';
    }
    if (country.fee === 0) return '免費';
    const cur = country.feeCurrency || '';
    return (cur + ' ' + country.fee).trim();
  }

  const DAY_MS = 86400000;

  function getSchedule(id) {
    return state.schedule[id] || {};
  }

  function getCities(id) {
    return state.cities[id] || [];
  }

  function addCity(countryId, name, nights) {
    if (!state.cities[countryId]) state.cities[countryId] = [];
    state.cities[countryId].push({
      id: 'city_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      name: name,
      nights: nights === '' || nights === null || nights === undefined ? null : Number(nights),
    });
    saveState();
    renderRoute();
  }

  function removeCity(countryId, cityId) {
    if (!state.cities[countryId]) return;
    state.cities[countryId] = state.cities[countryId].filter(function (c) { return c.id !== cityId; });
    saveState();
    renderRoute();
  }

  function parseDay(str) {
    if (!str) return null;
    const d = new Date(str + 'T00:00:00');
    return isNaN(d.getTime()) ? null : d;
  }

  function stopDuration(sched) {
    const a = parseDay(sched.arrive), d = parseDay(sched.depart);
    if (!a || !d || d < a) return null;
    return Math.round((d - a) / DAY_MS);
  }

  function fmtMD(date) {
    return (date.getMonth() + 1) + '/' + date.getDate();
  }

  // ---------- distance / transport-time estimate (country-centroid based, rough planning estimate only) ----------
  const TRANSPORT_SPEEDS = {
    flight: { kmh: 850, overheadH: 0.75 }, // taxi/takeoff/landing/climb buffer
    land: { kmh: 65, overheadH: 0.4 },     // bus/train/drive, incl. border-crossing buffer
    sea: { kmh: 35, overheadH: 0.6 },      // ferry, incl. boarding buffer
  };
  const TRANSPORT_ICONS = { flight: '✈', land: '🚌', sea: '⛴' };
  const TRANSPORT_LABELS = { flight: '飛機', land: '陸路', sea: '海路' };

  function haversineKm(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const toRad = function (d) { return (d * Math.PI) / 180; };
    const dLat = toRad(lat2 - lat1), dLng = toRad(lng2 - lng1);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function legDistanceKm(a, b) {
    if (!a || !b || typeof a.lat !== 'number' || typeof b.lat !== 'number') return null;
    return haversineKm(a.lat, a.lng, b.lat, b.lng);
  }

  // Rough auto-suggestion only — no real border/ferry-route data behind this. Island
  // countries (no practical land border to anywhere in our dataset) always suggest flight;
  // otherwise short hops suggest overland. Always overridable per leg.
  function suggestTransportMode(a, b, km) {
    if (!a || !b) return 'flight';
    if (a.island || b.island) return 'flight';
    if (km !== null && km !== undefined && km <= 800) return 'land';
    return 'flight';
  }

  function getLegMode(stopId, a, b, km) {
    return (stopId && state.legTransport[stopId]) || suggestTransportMode(a, b, km);
  }

  function setLegMode(stopId, mode) {
    if (!mode || mode === 'auto') delete state.legTransport[stopId];
    else state.legTransport[stopId] = mode;
    saveState();
    renderAll();
  }

  function legEstimate(a, b, mode) {
    const km = legDistanceKm(a, b);
    if (km === null) return null;
    const useMode = mode || suggestTransportMode(a, b, km);
    const spec = TRANSPORT_SPEEDS[useMode] || TRANSPORT_SPEEDS.flight;
    return { km: km, hours: km / spec.kmh + spec.overheadH, mode: useMode };
  }

  function fmtKm(km) {
    return Math.round(km).toLocaleString('zh-Hant') + ' km';
  }

  function fmtHours(hours) {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return (h > 0 ? h + 'h' : '') + (m > 0 ? m + 'm' : (h > 0 ? '' : '<1m'));
  }

  function fmtDate(date) {
    return date.getFullYear() + '/' + fmtMD(date);
  }

  // ---------- local time / timezone ----------
  function getTzOffsetMinutes(tz, now) {
    const parts = new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'shortOffset' }).formatToParts(now);
    const offsetPart = parts.find(function (p) { return p.type === 'timeZoneName'; });
    if (!offsetPart) return null;
    const m = offsetPart.value.match(/GMT([+-]\d+)(?::(\d+))?/);
    if (!m) return 0;
    const hours = parseInt(m[1], 10);
    const mins = m[2] ? parseInt(m[2], 10) : 0;
    return hours * 60 + (hours < 0 ? -mins : mins);
  }

  function getLocalTimeInfo(tz) {
    if (!tz) return null;
    const now = new Date();
    let timeStr;
    try {
      timeStr = new Intl.DateTimeFormat('zh-Hant', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false }).format(now);
    } catch (e) {
      return null;
    }
    const tzOffset = getTzOffsetMinutes(tz, now);
    const homeOffset = getTzOffsetMinutes('Asia/Taipei', now);
    if (tzOffset === null || homeOffset === null) return { timeStr: timeStr, diffLabel: '' };
    const diffMinutes = tzOffset - homeOffset;
    let diffLabel;
    if (diffMinutes === 0) {
      diffLabel = '與台灣同時區';
    } else {
      const diffHours = Math.abs(diffMinutes) / 60;
      const hoursLabel = Number.isInteger(diffHours) ? diffHours : diffHours.toFixed(1);
      diffLabel = '比台灣' + (diffMinutes > 0 ? '快' : '慢') + hoursLabel + '小時';
    }
    return { timeStr: timeStr, diffLabel: diffLabel };
  }

  function getFilters() {
    return {
      q: document.getElementById('searchInput').value.trim().toLowerCase(),
      region: document.getElementById('regionFilter').value,
      visaType: document.getElementById('visaFilter').value,
      status: document.getElementById('statusFilter').value,
      safety: document.getElementById('safetyFilter').value,
      heritage: document.getElementById('heritageFilter').value,
      vaccine: document.getElementById('vaccineFilter').value,
    };
  }

  function hasActiveFilter(f) {
    return !!(f.q || f.region || f.visaType || f.status || f.safety || f.heritage || f.vaccine);
  }

  function computeFilteredList() {
    const f = getFilters();
    let list = getAllCountries();

    if (f.q) {
      list = list.filter(function (c) {
        return c.name.toLowerCase().indexOf(f.q) !== -1 ||
          (c.nameEn || '').toLowerCase().indexOf(f.q) !== -1;
      });
    }
    if (f.region) list = list.filter(function (c) { return c.region === f.region; });
    if (f.visaType) list = list.filter(function (c) { return c.visaType === f.visaType; });
    if (f.status) list = list.filter(function (c) { return (state.status[c.id] || '') === f.status; });
    if (f.safety) {
      list = list.filter(function (c) {
        return f.safety === 'none' ? !c.safetyLevel : c.safetyLevel === f.safety;
      });
    }
    if (f.heritage === 'has') {
      list = list.filter(function (c) { return c.heritageSites && c.heritageSites.length; });
    }
    if (f.vaccine) list = list.filter(function (c) { return c.yellowFeverStatus === f.vaccine; });

    list.sort(function (a, b) {
      const ra = REGION_ORDER.indexOf(a.region), rb = REGION_ORDER.indexOf(b.region);
      if (ra !== rb) return ra - rb;
      return a.name.localeCompare(b.name, 'zh-Hant');
    });

    // Clicking a country on the map should make it the first card in the destination list
    // below, not just scrolled into view — bump it to the front, ahead of the normal
    // region/alphabetical order, if it's currently in the filtered results at all.
    if (selectedId) {
      const idx = list.findIndex(function (c) { return c.id === selectedId; });
      if (idx > 0) list.unshift(list.splice(idx, 1)[0]);
    }

    return list;
  }

  // ---------- rendering: stats ----------
  function renderStats() {
    const all = getAllCountries();
    const visaFreeCount = all.filter(function (c) { return c.visaType === 'visa_free'; }).length;
    const routeCount = state.route.length;
    const unknownFeeInRoute = state.route
      .map(function (r) { return findCountry(r.countryId); })
      .filter(Boolean)
      .filter(function (c) { return c.visaType !== 'visa_free' && (c.fee === null || c.fee === undefined); }).length;

    const sc = computeSchedule();

    const stats = [
      { num: all.length, label: '目的地總數' },
      { num: visaFreeCount, label: '免簽證國家' },
      { num: routeCount, label: '已加入路線' },
      { num: unknownFeeInRoute, label: '路線中費用待查證' },
      { num: sc.totalDays || '–', label: '行程總天數' },
    ];

    const el = document.getElementById('statsRow');
    el.innerHTML = stats.map(function (s) {
      return '<div class="stat-card"><span class="num">' + s.num + '</span><span class="label">' + s.label + '</span></div>';
    }).join('');
  }

  // ---------- rendering: grid ----------
  function renderGrid() {
    const list = computeFilteredList();
    const grid = document.getElementById('countryGrid');
    document.getElementById('listCount').textContent = '共 ' + list.length + ' 個目的地';

    if (!list.length) {
      grid.innerHTML = '<div class="empty-state">沒有符合條件的國家，試試調整篩選條件，或按「＋ 新增國家」自己加一個。</div>';
      return;
    }

    grid.innerHTML = list.map(function (c) {
      const routeCount = state.route.filter(function (r) { return r.countryId === c.id; }).length;
      const status = state.status[c.id] || '';
      const note = c.note ? '<div class="card-note">📌 ' + escapeHtml(c.note) + '</div>' : '';
      const personal = state.personalNotes[c.id] ? '<div class="card-personal-note">📝 ' + escapeHtml(state.personalNotes[c.id]) + '</div>' : '';
      const stayLine = c.stayDays ? ('可停留 ' + c.stayDays + ' 天') : '';
      const feeLine = formatFee(c);
      const metaBits = [REGION_LABELS[c.region] || c.region, stayLine, feeLine].filter(Boolean);
      const highlighted = c.id === selectedId ? ' highlighted' : '';
      const safetyBadge = c.safetyLevel ? '<span class="badge safety-badge-' + c.safetyLevel + '">🛡 ' + SAFETY_LABELS[c.safetyLevel] + '</span>' : '';
      const safetyNoteLine = c.safetyNote ? '<div class="card-safety-note">🛡 ' + escapeHtml(c.safetyNote) + '</div>' : '';
      const vaccineBadge = c.yellowFeverStatus ? '<span class="badge badge-vaccine-' + c.yellowFeverStatus + '" title="黃熱病疫苗證明規定">💉 ' + YELLOW_FEVER_LABELS[c.yellowFeverStatus] + '</span>' : '';
      const healthNoteLine = c.healthNote ? '<div class="card-health-note">💉 ' + escapeHtml(c.healthNote) + '</div>' : '';
      const heritageCount = c.heritageSites ? c.heritageSites.length : 0;
      const heritageBadge = heritageCount ? '<span class="badge badge-heritage" title="UNESCO 世界遺產">🏛 ' + heritageCount + '</span>' : '';
      const heritageDetail = heritageCount ? (
        '<details class="card-heritage">' +
          '<summary>🏛 ' + heritageCount + ' 項世界遺產</summary>' +
          '<ul class="heritage-list">' + c.heritageSites.map(function (s) { return '<li>' + escapeHtml(s) + '</li>'; }).join('') + '</ul>' +
        '</details>'
      ) : '';

      return (
        '<div class="country-card' + highlighted + '" data-id="' + c.id + '">' +
          '<div class="card-top">' +
            '<div><div class="card-name">' + escapeHtml(c.name) + '</div>' +
            (c.nameEn ? '<div class="card-name-en">' + escapeHtml(c.nameEn) + '</div>' : '') + '</div>' +
            '<div class="card-badges"><span class="badge badge-' + c.visaType + '">' + VISA_LABELS[c.visaType] + '</span>' + safetyBadge + heritageBadge + vaccineBadge + '</div>' +
          '</div>' +
          '<div class="card-meta">' + metaBits.map(function (b) { return '<span>' + escapeHtml(b) + '</span>'; }).join('') + '</div>' +
          note +
          safetyNoteLine +
          healthNoteLine +
          personal +
          heritageDetail +
          '<div class="card-bottom">' +
            '<select class="status-select" data-action="status" data-id="' + c.id + '">' +
              Object.keys(STATUS_LABELS).map(function (k) {
                return '<option value="' + k + '"' + (k === status ? ' selected' : '') + '>' + STATUS_LABELS[k] + '</option>';
              }).join('') +
            '</select>' +
            '<div class="card-actions">' +
              (routeCount ? '<span class="route-count-badge">路線中×' + routeCount + '</span>' : '') +
              '<button class="btn btn-small btn-primary" data-action="add-route" data-id="' + c.id + '">' + (routeCount ? '＋ 再次加入' : '＋ 加入路線') + '</button>' +
              '<button class="btn btn-small btn-ghost" data-action="edit" data-id="' + c.id + '">編輯</button>' +
            '</div>' +
          '</div>' +
        '</div>'
      );
    }).join('');
  }

  function renderCitySectionHtml(stopId, stopDurationDays) {
    const cities = getCities(stopId);
    const totalNights = cities.reduce(function (sum, c) { return sum + (c.nights || 0); }, 0);
    const hasNights = cities.some(function (c) { return c.nights; });
    let mismatch = '';
    if (hasNights && stopDurationDays !== null && totalNights !== stopDurationDays) {
      mismatch = ' <span class="city-mismatch">（站點排定' + stopDurationDays + '天，城市合計' + totalNights + '晚）</span>';
    }
    const chips = cities.map(function (c) {
      return '<span class="city-chip">' + escapeHtml(c.name) +
        (c.nights ? ' <b>' + c.nights + '晚</b>' : '') +
        '<button type="button" class="city-remove" data-action="city-remove" data-stop="' + stopId + '" data-city="' + c.id + '">✕</button></span>';
    }).join('');

    return (
      '<div class="city-section">' +
        '<div class="city-header">🏙 城市清單' + (cities.length ? '（' + cities.length + '）' + mismatch : '') + '</div>' +
        (chips ? '<div class="city-chips">' + chips + '</div>' : '') +
        '<div class="city-add-row">' +
          '<input type="text" class="city-name-input" data-field="cityName" data-stop="' + stopId + '" placeholder="城市名稱">' +
          '<input type="number" class="city-nights-input" data-field="cityNights" data-stop="' + stopId + '" min="0" placeholder="晚數">' +
          '<button type="button" class="btn btn-small btn-ghost" data-action="city-add" data-stop="' + stopId + '">+ 新增</button>' +
        '</div>' +
      '</div>'
    );
  }

  // ---------- rendering: route ----------
  function renderRoute() {
    const list = document.getElementById('routeList');
    const summary = document.getElementById('routeSummary');

    if (!state.route.length) {
      list.innerHTML = '<div class="empty-state">路線是空的，去地圖或清單挑幾個國家吧！</div>';
      summary.innerHTML = '';
    } else {
      list.innerHTML = state.route.map(function (stop, idx) {
        const id = stop.id;
        const c = findCountry(stop.countryId);
        if (!c) return '';
        const fee = formatFee(c);
        const sched = getSchedule(id);
        const duration = stopDuration(sched);
        let warning = '';
        if (duration !== null && c.stayDays && duration > c.stayDays) {
          warning = '<div class="stay-warning">⚠ 超過免簽/許可天數上限（限' + c.stayDays + '天，目前排' + duration + '天）</div>';
        }
        let legLine = '';
        if (idx > 0) {
          const prev = findCountry(state.route[idx - 1].countryId);
          const km = prev ? legDistanceKm(prev, c) : null;
          if (km !== null) {
            const mode = getLegMode(id, prev, c, km);
            const leg = legEstimate(prev, c, mode);
            const isAuto = !state.legTransport[id];
            legLine = '<div class="leg-line">' + TRANSPORT_ICONS[mode] + ' 距上一站 ' + fmtKm(leg.km) + ' · 預估' + TRANSPORT_LABELS[mode] + ' ' + fmtHours(leg.hours) +
              '<select class="leg-mode-select" data-action="leg-mode" data-id="' + id + '">' +
                '<option value="auto"' + (isAuto ? ' selected' : '') + '>自動建議</option>' +
                '<option value="flight"' + (!isAuto && mode === 'flight' ? ' selected' : '') + '>✈ 飛機</option>' +
                '<option value="land"' + (!isAuto && mode === 'land' ? ' selected' : '') + '>🚌 陸路</option>' +
                '<option value="sea"' + (!isAuto && mode === 'sea' ? ' selected' : '') + '>⛴ 海路</option>' +
              '</select>' +
            '</div>';
          }
        }
        const visitLabel = state.route.filter(function (r, i) { return i <= idx && r.countryId === stop.countryId; }).length > 1
          ? '（第' + state.route.filter(function (r, i) { return i <= idx && r.countryId === stop.countryId; }).length + '次）'
          : '';
        const timeInfo = getLocalTimeInfo(c.tz);
        const timeLine = timeInfo ? '<div class="local-time" data-tz="' + escapeHtml(c.tz) + '">🕐 ' + timeInfo.timeStr + (timeInfo.diffLabel ? '（' + timeInfo.diffLabel + '）' : '') + '</div>' : '';
        return (
          '<li class="route-item" data-id="' + id + '">' +
            '<span class="order">' + (idx + 1) + '</span>' +
            '<div class="info"><div class="name">' + escapeHtml(c.name) + visitLabel + '</div>' +
            '<div class="fee">' + VISA_LABELS[c.visaType] + (fee ? ' · ' + escapeHtml(fee) : '') + (duration !== null ? ' · ' + duration + '天' : '') + '</div>' +
            timeLine +
            legLine + '</div>' +
            '<div class="move-btns">' +
              '<button data-action="move-up" data-id="' + id + '" ' + (idx === 0 ? 'disabled' : '') + '>▲</button>' +
              '<button data-action="move-down" data-id="' + id + '" ' + (idx === state.route.length - 1 ? 'disabled' : '') + '>▼</button>' +
            '</div>' +
            '<button class="btn btn-small btn-ghost" data-action="remove-route" data-id="' + id + '">移除</button>' +
            '<div class="date-row">' +
              '<input type="date" data-action="date-arrive" data-id="' + id + '" value="' + (sched.arrive || '') + '">' +
              '<span class="date-sep">→</span>' +
              '<input type="date" data-action="date-depart" data-id="' + id + '" value="' + (sched.depart || '') + '">' +
            '</div>' +
            warning +
            renderCitySectionHtml(id, duration) +
          '</li>'
        );
      }).join('');

      const totals = {};
      let unknownCount = 0;
      state.route.forEach(function (stop) {
        const c = findCountry(stop.countryId);
        if (!c) return;
        if (c.fee === null || c.fee === undefined) {
          if (c.visaType !== 'visa_free') unknownCount++;
          return;
        }
        const cur = c.feeCurrency || '其他';
        totals[cur] = (totals[cur] || 0) + c.fee;
      });
      const totalParts = Object.keys(totals).map(function (cur) { return cur + ' ' + totals[cur].toFixed(2).replace(/\.00$/, ''); });
      summary.innerHTML =
        '<div>預估簽證費用：<strong>' + (totalParts.length ? totalParts.join(' + ') : '尚無費用資料') + '</strong></div>' +
        (unknownCount ? '<div>⚠️ 還有 ' + unknownCount + ' 個目的地費用待查證</div>' : '');
    }

    renderRouteLines();
    renderTimeline();
    renderShareSummary();
  }

  function computeSchedule() {
    const stops = state.route.map(function (stop) {
      return { id: stop.id, country: findCountry(stop.countryId), sched: getSchedule(stop.id) };
    }).filter(function (s) { return s.country; });

    const scheduled = [];
    const unscheduled = [];
    stops.forEach(function (s) {
      const duration = stopDuration(s.sched);
      if (duration !== null) {
        scheduled.push(Object.assign({}, s, {
          duration: duration,
          arriveDate: parseDay(s.sched.arrive),
          departDate: parseDay(s.sched.depart),
        }));
      } else {
        unscheduled.push(s);
      }
    });

    if (!scheduled.length) return { scheduled: scheduled, unscheduled: unscheduled, minDate: null, maxDate: null, totalDays: 0 };

    const minDate = scheduled.reduce(function (m, s) { return s.arriveDate < m ? s.arriveDate : m; }, scheduled[0].arriveDate);
    const maxDate = scheduled.reduce(function (m, s) { return s.departDate > m ? s.departDate : m; }, scheduled[0].departDate);
    const totalDays = Math.round((maxDate - minDate) / DAY_MS) + 1;
    return { scheduled: scheduled, unscheduled: unscheduled, minDate: minDate, maxDate: maxDate, totalDays: totalDays };
  }

  // Schengen's 90-day allowance is shared across all member countries within any rolling
  // 180-day window — scan every day the trip touches Schengen territory and find the worst
  // 180-day window, rather than checking each country's stay length in isolation.
  function computeSchengenUsage(sc) {
    const ranges = sc.scheduled
      .filter(function (s) { return SCHENGEN_IDS.indexOf(s.country.id) !== -1; })
      .map(function (s) { return { start: s.arriveDate.getTime(), end: s.departDate.getTime() }; });
    if (!ranges.length) return null;

    const minTime = Math.min.apply(null, ranges.map(function (r) { return r.start; }));
    const maxTime = Math.max.apply(null, ranges.map(function (r) { return r.end; }));

    function inSchengenOn(t) {
      return ranges.some(function (r) { return t >= r.start && t <= r.end; });
    }

    let peakDays = 0, peakEndTime = null;
    for (let d = minTime; d <= maxTime; d += DAY_MS) {
      let count = 0;
      for (let w = d - 179 * DAY_MS; w <= d; w += DAY_MS) {
        if (inSchengenOn(w)) count++;
      }
      if (count > peakDays) { peakDays = count; peakEndTime = d; }
    }

    return { peakDays: peakDays, peakDate: peakEndTime !== null ? new Date(peakEndTime) : null, overLimit: peakDays > 90 };
  }

  function renderTimeline() {
    const track = document.getElementById('timelineTrack');
    const summaryEl = document.getElementById('timelineSummary');
    const unscheduledEl = document.getElementById('timelineUnscheduled');
    if (!track) return;

    const sc = computeSchedule();
    const scheduled = sc.scheduled, unscheduled = sc.unscheduled;

    unscheduledEl.innerHTML = unscheduled.map(function (s) {
      return '<button type="button" class="timeline-chip" data-id="' + s.id + '">' + escapeHtml(s.country.name) + ' 未排定</button>';
    }).join('');

    renderTimelineStats(sc);
    renderActivityLog();

    if (!scheduled.length) {
      track.style.width = '';
      track.innerHTML = '<div class="timeline-empty">幫「我的路線」裡的國家填上入境/離境日期，這裡就會出現你的行程時間軸。</div>';
      summaryEl.textContent = '';
      return;
    }

    const minDate = sc.minDate, maxDate = sc.maxDate, totalDays = sc.totalDays;
    const pxPerDay = 20;
    const trackWidth = Math.max(600, totalDays * pxPerDay);

    let gridHtml = '';
    const cursor = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
    while (cursor <= maxDate) {
      const offset = Math.round((cursor - minDate) / DAY_MS) * pxPerDay;
      if (offset >= 0) {
        gridHtml += '<div class="timeline-month-line" style="left:' + offset + 'px"></div>';
        gridHtml += '<div class="timeline-month-label" style="left:' + offset + 'px">' + (cursor.getMonth() + 1) + '月</div>';
      }
      cursor.setMonth(cursor.getMonth() + 1);
    }

    let rowsHtml = '';
    let overlapCount = 0;
    let totalKm = 0, totalHours = 0, legCount = 0;
    const legOf = function (idx) {
      const a = scheduled[idx - 1].country, b = scheduled[idx].country;
      const km = legDistanceKm(a, b);
      if (km === null) return null;
      return legEstimate(a, b, getLegMode(scheduled[idx].id, a, b, km));
    };
    scheduled.forEach(function (s, idx) {
      const left = Math.round((s.arriveDate - minDate) / DAY_MS) * pxPerDay;
      const width = Math.max(pxPerDay * 0.8, s.duration * pxPerDay);
      const routeIdx = findStopIndex(s.id);
      const isOverstay = !!(s.country.stayDays && s.duration > s.country.stayDays);
      let isOverlap = false;
      if (idx > 0 && s.arriveDate < scheduled[idx - 1].departDate) isOverlap = true;
      if (isOverlap) overlapCount++;

      if (idx > 0) {
        const leg = legOf(idx);
        if (leg) {
          totalKm += leg.km; totalHours += leg.hours; legCount++;
          const prev = scheduled[idx - 1];
          const prevLeft = Math.round((prev.arriveDate - minDate) / DAY_MS) * pxPerDay;
          const prevWidth = Math.max(pxPerDay * 0.8, prev.duration * pxPerDay);
          const midX = (prevLeft + prevWidth + left) / 2;
          rowsHtml += '<div class="timeline-transit-row"><span class="timeline-transit" style="left:' + midX + 'px" title="' +
            escapeHtml(prev.country.name + ' → ' + s.country.name + '：約 ' + fmtKm(leg.km) + '，預估' + TRANSPORT_LABELS[leg.mode] + ' ' + fmtHours(leg.hours) + '（粗略估算，未計入轉機/等候時間）') + '">' + TRANSPORT_ICONS[leg.mode] + ' ' +
            fmtKm(leg.km) + ' · ' + fmtHours(leg.hours) + '</span></div>';
        }
      }

      const cls = ['timeline-bar', VISA_CLASS[s.country.visaType]];
      if (isOverstay) cls.push('overstay');
      if (isOverlap) cls.push('overlap');
      const tip = s.country.name + ' ' + s.sched.arrive + ' → ' + s.sched.depart + '（' + s.duration + '天）' +
        (isOverstay ? ' ⚠超過天數上限' : '') + (isOverlap ? ' ⚠與前一站日期重疊' : '');

      rowsHtml += '<div class="timeline-row"><div class="' + cls.join(' ') + '" data-id="' + s.id + '" style="left:' + left + 'px;width:' + width + 'px" title="' + escapeHtml(tip) + '">' +
        '<span class="order">' + (routeIdx + 1) + '</span><span>' + escapeHtml(s.country.name) + '</span><span>' + s.duration + '天</span>' +
        '</div></div>';
    });

    track.style.width = trackWidth + 'px';
    track.innerHTML = gridHtml + '<div class="timeline-rows">' + rowsHtml + '</div>';

    summaryEl.textContent = fmtDate(minDate) + ' → ' + fmtDate(maxDate) + '，共 ' + totalDays + ' 天，' + scheduled.length + ' 站已排定' +
      (unscheduled.length ? '，' + unscheduled.length + ' 站未排定' : '') +
      (overlapCount ? '，⚠ ' + overlapCount + ' 處日期重疊' : '') +
      (legCount ? '，總移動距離約 ' + fmtKm(totalKm) + '（約 ' + fmtHours(totalHours) + '）' : '');
  }

  function routeTripTotals() {
    let km = 0, hours = 0;
    const feesByCurrency = {};
    let feeConvertedTotal = 0, hasUnknownFee = false, hasConvertibleFee = false;

    state.route.forEach(function (stop, idx) {
      const c = findCountry(stop.countryId);
      if (!c) return;
      if (idx > 0) {
        const prevC = findCountry(state.route[idx - 1].countryId);
        const legKm = prevC ? legDistanceKm(prevC, c) : null;
        const leg = legKm !== null ? legEstimate(prevC, c, getLegMode(stop.id, prevC, c, legKm)) : null;
        if (leg) { km += leg.km; hours += leg.hours; }
      }
      if (c.fee !== null && c.fee !== undefined && c.fee > 0) {
        const cur = c.feeCurrency || 'USD';
        feesByCurrency[cur] = (feesByCurrency[cur] || 0) + c.fee;
        if (rates && rates[cur] && state.homeCurrency && rates[state.homeCurrency]) {
          feeConvertedTotal += convertCurrency(c.fee, cur, state.homeCurrency) || 0;
          hasConvertibleFee = true;
        }
      } else if (c.visaType !== 'visa_free') {
        hasUnknownFee = true;
      }
    });

    return { km: km, hours: hours, feesByCurrency: feesByCurrency, feeConvertedTotal: feeConvertedTotal, hasConvertibleFee: hasConvertibleFee, hasUnknownFee: hasUnknownFee };
  }

  function renderTimelineStats(sc) {
    const el = document.getElementById('timelineStats');
    if (!el) return;
    if (!state.route.length) { el.innerHTML = ''; return; }

    const totals = routeTripTotals();
    const feeText = totals.hasConvertibleFee
      ? state.homeCurrency + ' ' + fmtMoney(totals.feeConvertedTotal)
      : (Object.keys(totals.feesByCurrency).length
        ? Object.keys(totals.feesByCurrency).map(function (cur) { return cur + ' ' + totals.feesByCurrency[cur]; }).join(' + ')
        : '－');

    const tiles = [
      { num: sc.totalDays || '－', label: '總天數' },
      { num: state.route.length, label: '站點數' },
      { num: totals.km ? fmtKm(totals.km) : '－', label: '總移動距離' },
      { num: feeText, label: '總簽證費用' + (totals.hasUnknownFee ? '＊' : '') },
    ];

    const schengen = computeSchengenUsage(sc);
    if (schengen) {
      tiles.push({
        num: schengen.peakDays + ' / 90',
        label: '申根區 180 天內累積天數',
        cls: schengen.overLimit ? 'stat-card-warning' : '',
      });
    }

    el.innerHTML = tiles.map(function (t) {
      return '<div class="stat-card' + (t.cls ? ' ' + t.cls : '') + '"><span class="num">' + t.num + '</span><span class="label">' + t.label + '</span></div>';
    }).join('') +
      (totals.hasUnknownFee ? '<div class="timeline-stats-note">＊部分費用待查證，未計入</div>' : '') +
      (schengen && schengen.overLimit
        ? '<div class="timeline-stats-note timeline-stats-warning">⚠ 申根區 90/180 天規則：以 ' + fmtDate(schengen.peakDate) + ' 為基準往回推 180 天，累積在申根區待了 ' + schengen.peakDays + ' 天，已超過 90 天上限，請調整行程或分散申根站點的時間</div>'
        : '');
  }

  function renderActivityLog() {
    const el = document.getElementById('activityLog');
    if (!el) return;
    if (!state.route.length) {
      el.innerHTML = '<div class="empty-state">路線是空的，去地圖或清單挑幾個國家吧！</div>';
      return;
    }

    el.innerHTML = state.route.map(function (stop, idx) {
      const c = findCountry(stop.countryId);
      if (!c) return '';
      const sched = getSchedule(stop.id);
      const duration = stopDuration(sched);
      const visitCount = state.route.filter(function (r, i) { return i <= idx && r.countryId === stop.countryId; }).length;
      const visitLabel = visitCount > 1 ? '<span class="visit-label">（第' + visitCount + '次）</span>' : '';

      const dateText = (sched.arrive && sched.depart) ? (sched.arrive + ' → ' + sched.depart) : '尚未排定日期';

      let legStat = '';
      if (idx > 0) {
        const prevC = findCountry(state.route[idx - 1].countryId);
        const legKm = prevC ? legDistanceKm(prevC, c) : null;
        const leg = legKm !== null ? legEstimate(prevC, c, getLegMode(stop.id, prevC, c, legKm)) : null;
        if (leg) legStat = '<div class="activity-stat"><span class="label">距上一站</span><span class="value">' + fmtKm(leg.km) + '</span></div>' +
          '<div class="activity-stat"><span class="label">' + TRANSPORT_ICONS[leg.mode] + ' 預估' + TRANSPORT_LABELS[leg.mode] + '</span><span class="value">' + fmtHours(leg.hours) + '</span></div>';
      }

      const feeStr = formatFee(c);
      const feeStat = '<div class="activity-stat"><span class="label">簽證費用</span><span class="value' + (feeStr ? '' : ' dim') + '">' + (feeStr || (c.visaType === 'visa_free' ? '免簽證' : '待查證')) + '</span></div>';
      const nightsStat = duration !== null ? '<div class="activity-stat"><span class="label">天數</span><span class="value">' + duration + ' 天</span></div>' : '';

      const cities = getCities(stop.id);
      const citiesHtml = cities.length
        ? '<div class="activity-cities">🏙 ' + cities.map(function (city) { return '<b>' + escapeHtml(city.name) + '</b>' + (city.nights ? '(' + city.nights + '晚)' : ''); }).join('、') + '</div>'
        : '';

      const warning = (duration !== null && c.stayDays && duration > c.stayDays)
        ? '<div class="activity-warning">⚠ 超過免簽/許可天數上限（限' + c.stayDays + '天）</div>'
        : '';

      return (
        '<div class="activity-card">' +
          '<div class="activity-order" style="color:' + (c.safetyLevel === 'red' ? 'var(--c-restricted)' : c.safetyLevel === 'orange' ? 'var(--c-voa)' : '#8ee060') + '">' + (idx + 1) + '</div>' +
          '<div class="activity-body">' +
            '<div class="activity-top">' +
              '<div class="activity-name">' + escapeHtml(c.name) + visitLabel + '</div>' +
              '<div class="activity-dates">' + escapeHtml(dateText) + '</div>' +
            '</div>' +
            '<div class="activity-stats">' + nightsStat + legStat + feeStat + '</div>' +
            citiesHtml +
            warning +
          '</div>' +
        '</div>'
      );
    }).join('');
  }

  function getCountryAutoItems(country, stopId) {
    const items = [];
    if (country.visaType !== 'visa_free') {
      const fee = formatFee(country);
      items.push({ id: 'c_' + stopId + '_visa', label: '辦理' + VISA_LABELS[country.visaType] + (fee ? '（' + fee + '）' : '') });
    }
    if (country.note) {
      items.push({ id: 'c_' + stopId + '_note', label: '確認入境備註：' + country.note });
    }
    if (country.safetyLevel === 'orange' || country.safetyLevel === 'red') {
      items.push({ id: 'c_' + stopId + '_safety', label: '查看外交部旅遊警示（' + SAFETY_LABELS[country.safetyLevel] + (country.safetyNote ? '，' + country.safetyNote : '') + '）' });
    }
    if (country.yellowFeverStatus === 'required') {
      items.push({ id: 'c_' + stopId + '_yf', label: '準備黃熱病疫苗證明（國際預防接種證書，入境強制要求，不論來源地）' + (country.healthNote ? '：' + country.healthNote : '') });
    } else if (country.yellowFeverStatus === 'conditional') {
      items.push({ id: 'c_' + stopId + '_yf', label: '確認是否需準備黃熱病疫苗證明（若行程曾途經/轉機黃熱病疫區可能被要求出示）' + (country.healthNote ? '：' + country.healthNote : '') });
    }
    return items;
  }

  function toggleChecklistItem(id) {
    if (state.checklist.done[id]) delete state.checklist.done[id];
    else state.checklist.done[id] = true;
    saveState();
    renderChecklist();
  }

  function addChecklistItem(scope, countryId, label) {
    const item = { id: (scope === 'general' ? 'gc_' : 'cc_') + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), label: label };
    if (scope === 'general') {
      state.checklist.customGeneral.push(item);
    } else {
      if (!state.checklist.customCountry[countryId]) state.checklist.customCountry[countryId] = [];
      state.checklist.customCountry[countryId].push(item);
    }
    saveState();
    renderChecklist();
  }

  function removeChecklistItem(scope, countryId, itemId) {
    if (scope === 'general') {
      state.checklist.customGeneral = state.checklist.customGeneral.filter(function (it) { return it.id !== itemId; });
    } else if (state.checklist.customCountry[countryId]) {
      state.checklist.customCountry[countryId] = state.checklist.customCountry[countryId].filter(function (it) { return it.id !== itemId; });
    }
    delete state.checklist.done[itemId];
    saveState();
    renderChecklist();
  }

  function renderChecklistItemsHtml(items, scope, countryId) {
    return items.map(function (it) {
      const isCustom = it.id.indexOf('gc_') === 0 || it.id.indexOf('cc_') === 0;
      const done = !!state.checklist.done[it.id];
      return (
        '<li class="checklist-item' + (done ? ' done' : '') + '">' +
          '<input type="checkbox" data-action="cl-toggle" data-id="' + it.id + '"' + (done ? ' checked' : '') + '>' +
          '<span class="cl-label">' + escapeHtml(it.label) + '</span>' +
          (isCustom ? '<button type="button" class="cl-remove" data-action="cl-remove" data-scope="' + scope + '" data-country="' + (countryId || '') + '" data-id="' + it.id + '" title="刪除">✕</button>' : '') +
        '</li>'
      );
    }).join('');
  }

  function renderChecklist() {
    const generalEl = document.getElementById('generalChecklist');
    if (!generalEl) return;
    const generalItems = GENERAL_CHECKLIST.concat(state.checklist.customGeneral);
    generalEl.innerHTML = renderChecklistItemsHtml(generalItems, 'general', null);

    const countryEl = document.getElementById('countryChecklists');
    if (!state.route.length) {
      countryEl.innerHTML = '<div class="empty-state">先把國家加入路線，這裡就會列出對應的文件清單。</div>';
    } else {
      countryEl.innerHTML = state.route.map(function (stop, idx) {
        const id = stop.id;
        const c = findCountry(stop.countryId);
        if (!c) return '';
        const visitLabel = state.route.filter(function (r, i) { return i <= idx && r.countryId === stop.countryId; }).length > 1
          ? '（第' + state.route.filter(function (r, i) { return i <= idx && r.countryId === stop.countryId; }).length + '次）'
          : '';
        const items = getCountryAutoItems(c, id).concat(state.checklist.customCountry[id] || []);
        const doneCount = items.filter(function (it) { return state.checklist.done[it.id]; }).length;
        const itemsHtml = items.length
          ? renderChecklistItemsHtml(items, 'country', id)
          : '<li class="empty-state">這個國家目前沒有需要特別準備的文件</li>';
        return (
          '<div class="country-checklist-group" data-country="' + id + '">' +
            '<h4>' + escapeHtml(c.name) + visitLabel + ' <span class="cl-progress">(' + doneCount + '/' + items.length + ')</span></h4>' +
            '<ul class="checklist-list">' + itemsHtml + '</ul>' +
            '<div class="checklist-add-row"><input type="text" data-action="cl-add-input" data-country="' + id + '" placeholder="+ 新增這國的項目…（按 Enter 新增）"></div>' +
          '</div>'
        );
      }).join('');
    }

    const allItems = generalItems.concat(state.route.reduce(function (acc, stop) {
      const c = findCountry(stop.countryId);
      if (!c) return acc;
      return acc.concat(getCountryAutoItems(c, stop.id)).concat(state.checklist.customCountry[stop.id] || []);
    }, []));
    const doneTotal = allItems.filter(function (it) { return state.checklist.done[it.id]; }).length;
    document.getElementById('checklistSummary').textContent = allItems.length ? ('已完成 ' + doneTotal + ' / ' + allItems.length) : '';
  }

  document.getElementById('generalChecklist').addEventListener('change', function (e) {
    const cb = e.target.closest('[data-action="cl-toggle"]');
    if (cb) toggleChecklistItem(cb.getAttribute('data-id'));
  });
  document.getElementById('generalChecklist').addEventListener('click', function (e) {
    const btn = e.target.closest('[data-action="cl-remove"]');
    if (btn) removeChecklistItem(btn.getAttribute('data-scope'), null, btn.getAttribute('data-id'));
  });
  document.getElementById('generalAddInput').addEventListener('keydown', function (e) {
    if (e.key !== 'Enter') return;
    const value = e.target.value.trim();
    if (!value) return;
    addChecklistItem('general', null, value);
    e.target.value = '';
  });

  document.getElementById('countryChecklists').addEventListener('change', function (e) {
    const cb = e.target.closest('[data-action="cl-toggle"]');
    if (cb) toggleChecklistItem(cb.getAttribute('data-id'));
  });
  document.getElementById('countryChecklists').addEventListener('click', function (e) {
    const btn = e.target.closest('[data-action="cl-remove"]');
    if (btn) removeChecklistItem('country', btn.getAttribute('data-country'), btn.getAttribute('data-id'));
  });
  document.getElementById('countryChecklists').addEventListener('keydown', function (e) {
    const input = e.target.closest('[data-action="cl-add-input"]');
    if (!input || e.key !== 'Enter') return;
    const value = input.value.trim();
    if (!value) return;
    addChecklistItem('country', input.getAttribute('data-country'), value);
  });

  function renderAll() {
    renderStats();
    renderGrid();
    renderRoute();
    renderMap();
    renderChecklist();
    renderCurrencyTab();
    renderConverter();
    renderBudgetTab();
    renderShareSummary();
    renderEmergencyTab();
  }

  // ---------- helpers ----------
  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  function onFiltersChanged() {
    renderGrid();
    renderMap();
  }

  // ---------- actions ----------
  function setStatus(id, value) {
    if (value) state.status[id] = value; else delete state.status[id];
    saveState();
    renderStats();
  }

  function addRouteStop(countryId) {
    state.route.push({ id: newStopId(), countryId: countryId });
    saveState();
    renderAll();
  }

  function setStopDate(id, field, value) {
    state.schedule[id] = Object.assign({}, state.schedule[id], {}, { [field]: value });
    saveState();
    renderStats();
    renderRoute();
    renderBudgetTab();
  }

  function moveRoute(stopId, dir) {
    const idx = findStopIndex(stopId);
    const swapWith = idx + dir;
    if (idx === -1 || swapWith < 0 || swapWith >= state.route.length) return;
    const tmp = state.route[idx];
    state.route[idx] = state.route[swapWith];
    state.route[swapWith] = tmp;
    saveState();
    renderRoute();
  }

  function removeFromRoute(stopId) {
    state.route = state.route.filter(function (r) { return r.id !== stopId; });
    delete state.schedule[stopId];
    delete state.cities[stopId];
    delete state.budget.perStop[stopId];
    delete state.checklist.customCountry[stopId];
    saveState();
    renderAll();
  }

  function selectCountry(id) {
    selectedId = id;
    renderGrid();
    renderMap();
    const grid = document.getElementById('countryGrid');
    grid.scrollTop = 0;
    // Target the actual selected card (not the grid container) so scrollIntoView's ancestor
    // walk brings it fully into the viewport, including scrolling the page itself past the
    // map above it — calling it on the container only guaranteed the container's *top edge*
    // was reachable, not that the browser would actually scroll the outer page to reveal it.
    const card = grid.querySelector('.country-card.highlighted');
    if (card) card.scrollIntoView({ block: 'start' });
    history.replaceState(null, '', location.pathname + location.search);
    location.hash = 'countryGrid';
    if (card) {
      card.classList.remove('just-selected');
      // eslint-disable-next-line no-unused-expressions
      void card.offsetWidth; // restart the CSS animation even if the same card flashes twice in a row
      card.classList.add('just-selected');
    }
  }

  // ---------- modal ----------
  const backdrop = document.getElementById('modalBackdrop');
  const form = document.getElementById('countryForm');

  let modalOpenerEl = null;

  function getModalFocusable() {
    return Array.from(document.getElementById('countryModal').querySelectorAll(
      'input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]):not([hidden])'
    ));
  }

  function openModal(country) {
    modalOpenerEl = document.activeElement;
    document.getElementById('modalTitle').textContent = country ? '編輯國家' : '新增國家';
    document.getElementById('f_id').value = country ? country.id : '';
    document.getElementById('f_name').value = country ? country.name : '';
    document.getElementById('f_nameEn').value = country ? (country.nameEn || '') : '';
    document.getElementById('f_region').value = country ? country.region : 'asia';
    document.getElementById('f_visaType').value = country ? country.visaType : 'visa_free';
    document.getElementById('f_stayDays').value = country && country.stayDays !== null && country.stayDays !== undefined ? country.stayDays : '';
    document.getElementById('f_fee').value = country && country.fee !== null && country.fee !== undefined ? country.fee : '';
    document.getElementById('f_feeCurrency').value = country ? (country.feeCurrency || '') : '';
    document.getElementById('f_note').value = country ? (country.note || '') : '';
    document.getElementById('f_safetyLevel').value = country ? (country.safetyLevel || '') : '';
    document.getElementById('f_safetyNote').value = country ? (country.safetyNote || '') : '';
    document.getElementById('f_yellowFeverStatus').value = country ? (country.yellowFeverStatus || '') : '';
    document.getElementById('f_healthNote').value = country ? (country.healthNote || '') : '';
    document.getElementById('f_personalNote').value = country ? (state.personalNotes[country.id] || '') : '';

    const deleteBtn = document.getElementById('deleteCountryBtn');
    if (country) {
      deleteBtn.hidden = false;
      deleteBtn.textContent = country.isCustom ? '刪除這個國家' : '重設為預設資料';
    } else {
      deleteBtn.hidden = true;
    }
    backdrop.classList.add('open');
    document.getElementById('f_name').focus();
  }

  function closeModal() {
    backdrop.classList.remove('open');
    form.reset();
    if (modalOpenerEl && typeof modalOpenerEl.focus === 'function') modalOpenerEl.focus();
    modalOpenerEl = null;
  }

  backdrop.addEventListener('keydown', function (e) {
    if (!backdrop.classList.contains('open')) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      closeModal();
      return;
    }
    if (e.key !== 'Tab') return;
    const focusable = getModalFocusable();
    if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const id = document.getElementById('f_id').value;
    const fields = {
      name: document.getElementById('f_name').value.trim(),
      nameEn: document.getElementById('f_nameEn').value.trim(),
      region: document.getElementById('f_region').value,
      visaType: document.getElementById('f_visaType').value,
      stayDays: document.getElementById('f_stayDays').value === '' ? null : Number(document.getElementById('f_stayDays').value),
      fee: document.getElementById('f_fee').value === '' ? null : Number(document.getElementById('f_fee').value),
      feeCurrency: document.getElementById('f_feeCurrency').value.trim() || null,
      note: document.getElementById('f_note').value.trim(),
      safetyLevel: document.getElementById('f_safetyLevel').value || null,
      safetyNote: document.getElementById('f_safetyNote').value.trim(),
      yellowFeverStatus: document.getElementById('f_yellowFeverStatus').value || null,
      healthNote: document.getElementById('f_healthNote').value.trim(),
    };
    const personalNote = document.getElementById('f_personalNote').value.trim();

    if (!id) {
      const newId = 'custom_' + Date.now().toString(36);
      state.customCountries.push(Object.assign({ id: newId }, fields));
      if (personalNote) state.personalNotes[newId] = personalNote;
    } else {
      const existing = findCountry(id);
      if (existing && existing.isCustom) {
        state.customCountries = state.customCountries.map(function (c) {
          return c.id === id ? Object.assign({ id: id }, fields) : c;
        });
      } else {
        state.overrides[id] = fields;
      }
      if (personalNote) state.personalNotes[id] = personalNote; else delete state.personalNotes[id];
    }
    saveState();
    closeModal();
    renderAll();
  });

  document.getElementById('cancelModalBtn').addEventListener('click', closeModal);
  backdrop.addEventListener('click', function (e) { if (e.target === backdrop) closeModal(); });

  document.getElementById('deleteCountryBtn').addEventListener('click', function () {
    const id = document.getElementById('f_id').value;
    const country = findCountry(id);
    if (!country) return closeModal();
    if (country.isCustom) {
      if (!confirm('確定要刪除「' + country.name + '」嗎？這會一併移除它的狀態、筆記與路線紀錄。')) return;
      state.customCountries = state.customCountries.filter(function (c) { return c.id !== id; });
      delete state.status[id];
      delete state.personalNotes[id];
      const removedStopIds = state.route.filter(function (r) { return r.countryId === id; }).map(function (r) { return r.id; });
      removedStopIds.forEach(function (stopId) {
        delete state.schedule[stopId];
        delete state.cities[stopId];
        delete state.budget.perStop[stopId];
        delete state.checklist.customCountry[stopId];
      });
      state.route = state.route.filter(function (r) { return r.countryId !== id; });
    } else {
      delete state.overrides[id];
    }
    saveState();
    closeModal();
    renderAll();
  });

  document.getElementById('addCountryBtn').addEventListener('click', function () { openModal(null); });

  // ---------- event delegation: list + route ----------
  document.getElementById('countryGrid').addEventListener('click', function (e) {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const id = btn.getAttribute('data-id');
    const action = btn.getAttribute('data-action');
    if (action === 'add-route') addRouteStop(id);
    if (action === 'edit') openModal(findCountry(id));
  });

  document.getElementById('countryGrid').addEventListener('change', function (e) {
    const sel = e.target.closest('[data-action="status"]');
    if (!sel) return;
    setStatus(sel.getAttribute('data-id'), sel.value);
  });

  function addCityFromInputs(stopId) {
    const nameInput = document.querySelector('.city-name-input[data-stop="' + stopId + '"]');
    const nightsInput = document.querySelector('.city-nights-input[data-stop="' + stopId + '"]');
    const name = nameInput.value.trim();
    if (!name) return;
    addCity(stopId, name, nightsInput.value);
  }

  document.getElementById('routeList').addEventListener('click', function (e) {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const id = btn.getAttribute('data-id');
    const action = btn.getAttribute('data-action');
    if (action === 'move-up') moveRoute(id, -1);
    if (action === 'move-down') moveRoute(id, 1);
    if (action === 'remove-route') removeFromRoute(id);
    if (action === 'city-remove') removeCity(btn.getAttribute('data-stop'), btn.getAttribute('data-city'));
    if (action === 'city-add') addCityFromInputs(btn.getAttribute('data-stop'));
  });

  document.getElementById('routeList').addEventListener('keydown', function (e) {
    if (e.key !== 'Enter') return;
    const input = e.target.closest('.city-name-input, .city-nights-input');
    if (!input) return;
    e.preventDefault();
    addCityFromInputs(input.getAttribute('data-stop'));
  });

  document.getElementById('routeList').addEventListener('change', function (e) {
    const dateInput = e.target.closest('[data-action="date-arrive"], [data-action="date-depart"]');
    if (dateInput) {
      const field = dateInput.getAttribute('data-action') === 'date-arrive' ? 'arrive' : 'depart';
      setStopDate(dateInput.getAttribute('data-id'), field, dateInput.value);
      return;
    }
    const legModeSelect = e.target.closest('[data-action="leg-mode"]');
    if (legModeSelect) setLegMode(legModeSelect.getAttribute('data-id'), legModeSelect.value);
  });

  function focusStopDateInput(id) {
    const el = document.querySelector('.route-item[data-id="' + id + '"] input[data-action="date-arrive"]');
    if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.focus(); }
  }

  document.getElementById('timelineUnscheduled').addEventListener('click', function (e) {
    const chip = e.target.closest('[data-id]');
    if (!chip) return;
    focusStopDateInput(chip.getAttribute('data-id'));
  });

  document.getElementById('timelineTrack').addEventListener('click', function (e) {
    const bar = e.target.closest('.timeline-bar');
    if (!bar) return;
    focusStopDateInput(bar.getAttribute('data-id'));
  });

  ['searchInput', 'regionFilter', 'visaFilter', 'statusFilter', 'safetyFilter', 'heritageFilter', 'vaccineFilter'].forEach(function (id) {
    document.getElementById(id).addEventListener('input', onFiltersChanged);
    document.getElementById(id).addEventListener('change', onFiltersChanged);
  });

  // ---------- export / import ----------
  document.getElementById('exportBtn').addEventListener('click', function () {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rtw-dashboard-backup-' + new Date().toISOString().slice(0, 10) + '.json';
    a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById('importBtn').addEventListener('click', function () {
    document.getElementById('importFile').click();
  });

  document.getElementById('importFile').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function () {
      try {
        const parsed = JSON.parse(reader.result);
        if (!confirm('匯入將會覆蓋目前的資料，確定要繼續嗎？')) return;
        state = Object.assign(defaultState(), parsed);
        state.route = migrateRoute(state.route);
        saveState();
        renderAll();
      } catch (err) {
        alert('匯入失敗，檔案格式不正確。');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  });

  // =========================================================
  // ---------- world map ----------
  // =========================================================
  let mapSvg = null;
  const mapGroups = {};
  let routeLinesLayer = null;
  const tooltip = document.getElementById('mapTooltip');

  function renderLegend() {
    const items = [
      { cls: 'vfree', label: VISA_LABELS.visa_free },
      { cls: 'veta', label: VISA_LABELS.eta },
      { cls: 'vvoa', label: VISA_LABELS.voa },
      { cls: 'vevisa', label: VISA_LABELS.evisa },
      { cls: 'vreq', label: VISA_LABELS.visa_required },
      { cls: 'vrestricted', label: VISA_LABELS.restricted },
    ];
    const colorVar = {
      vfree: 'var(--c-free)', veta: 'var(--c-eta)', vvoa: 'var(--c-voa)',
      vevisa: 'var(--c-evisa)', vreq: 'var(--c-required)', vrestricted: 'var(--c-restricted)',
    };
    document.getElementById('mapLegend').innerHTML = items.map(function (it) {
      return '<div class="legend-item"><span class="legend-swatch" style="background:' + colorVar[it.cls] + '"></span>' + it.label + '</div>';
    }).join('') + '<div class="legend-item"><span class="legend-swatch" style="background:#1a2338"></span>尚無資料</div>' +
      '<div class="legend-sep"></div>' +
      '<div class="legend-item"><span class="legend-swatch legend-swatch-outline" style="border-color:var(--c-voa)"></span>橙色旅遊警示</div>' +
      '<div class="legend-item"><span class="legend-swatch legend-swatch-outline" style="border-color:var(--c-restricted)"></span>紅色旅遊警示</div>';
  }

  // The SVG carries an English name for every shape via a sibling <text id="XX-label">
  // element (permanently display:none — never meant to render on the map itself, see the
  // #labels group), which doubles as a name source for the ~90 countries on the map that
  // aren't in our curated 152-country dataset and so have no `country.name` of their own.
  function getMapLabelName(svgGroupId) {
    if (!mapSvg) return svgGroupId;
    const labelEl = mapSvg.querySelector('#' + CSS.escape(svgGroupId + '-label'));
    return labelEl ? labelEl.textContent : svgGroupId;
  }

  function initMap() {
    const container = document.getElementById('mapContainer');
    if (typeof WORLD_MAP_SVG === 'undefined') return;
    container.innerHTML = WORLD_MAP_SVG;
    mapSvg = container.querySelector('svg');
    if (!mapSvg) return;
    mapSvg.removeAttribute('width');
    mapSvg.removeAttribute('height');
    // styling targets this class (not a container id) since the same SVG node gets
    // physically reparented between the map tab and the timeline tab's mini preview.
    mapSvg.classList.add('world-map-svg');

    mapSvg.querySelectorAll('g[id]').forEach(function (g) {
      mapGroups[g.id.toLowerCase()] = g;
    });

    routeLinesLayer = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    routeLinesLayer.setAttribute('id', 'routeLinesLayer');
    mapSvg.appendChild(routeLinesLayer);

    // Country selection is handled in the pointerup listener below (via setupMapZoomPan),
    // not here — while the pointer is captured for pan-dragging, the click event paired with
    // this interaction gets its target retargeted to the capturing viewport element, so
    // e.target.closest('g.country') can never resolve correctly for a real click.

    mapSvg.addEventListener('mouseover', function (e) {
      const g = e.target.closest('g.country');
      if (!g) return;
      const c = findCountry(g.id.toLowerCase());
      if (!c) {
        tooltip.innerHTML =
          '<div class="tt-name">' + escapeHtml(getMapLabelName(g.id)) + '</div>' +
          '<div class="tt-badge">尚無簽證資料</div>';
        tooltip.hidden = false;
        return;
      }
      const fee = formatFee(c);
      const heritageCount = c.heritageSites ? c.heritageSites.length : 0;
      tooltip.innerHTML =
        '<div class="tt-name">' + escapeHtml(c.name) + '</div>' +
        '<div class="tt-badge badge badge-' + c.visaType + '">' + VISA_LABELS[c.visaType] + '</div>' +
        (c.stayDays ? '<div>可停留 ' + c.stayDays + ' 天</div>' : '') +
        (fee ? '<div>' + escapeHtml(fee) + '</div>' : '') +
        (c.safetyLevel ? '<div class="tt-badge safety-badge-' + c.safetyLevel + '">🛡 ' + SAFETY_LABELS[c.safetyLevel] + '</div>' : '') +
        (heritageCount ? '<div class="tt-badge badge-heritage">🏛 ' + heritageCount + ' 項世界遺產</div>' : '');
      tooltip.hidden = false;
    });
    mapSvg.addEventListener('mousemove', function (e) {
      if (tooltip.hidden) return;
      tooltip.style.left = (e.clientX + 16) + 'px';
      tooltip.style.top = (e.clientY + 16) + 'px';
    });
    mapSvg.addEventListener('mouseout', function (e) {
      const g = e.target.closest('g.country');
      if (!g) return;
      tooltip.hidden = true;
    });

    setupMapZoomPan();
    renderLegend();
  }

  function renderMap() {
    if (!mapSvg) return;
    const all = getAllCountries();
    const byId = {};
    all.forEach(function (c) { byId[c.id] = c; });

    const filteredList = computeFilteredList();
    const filteredIds = new Set(filteredList.map(function (c) { return c.id; }));
    const f = getFilters();
    const filtering = hasActiveFilter(f);

    Object.keys(mapGroups).forEach(function (id) {
      const g = mapGroups[id];
      const country = byId[id];
      g.classList.remove('country', 'vfree', 'veta', 'vvoa', 'vevisa', 'vreq', 'vrestricted', 'in-route', 'dimmed', 'safety-orange', 'safety-red', 'no-data');
      g.removeAttribute('role');
      g.removeAttribute('aria-label');
      const existingTitle = g.querySelector(':scope > title');
      if (existingTitle) existingTitle.remove();

      // 'country' is what makes a shape hoverable/clickable at all (see the mouseover/click
      // handlers below) — apply it even without curated data, so at least the country's name
      // (pulled from the SVG's own <text id="XX-label"> element) shows on hover instead of the
      // shape being a dead, unlabeled area on the map.
      if (!country) {
        g.classList.add('country', 'no-data');
        const name = getMapLabelName(g.id);
        g.setAttribute('role', 'button');
        g.setAttribute('aria-label', name + ' - 尚無簽證資料');
        const noDataTitle = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        noDataTitle.textContent = name + ' · 尚無簽證資料';
        g.insertBefore(noDataTitle, g.firstChild);
        return;
      }

      g.classList.add('country', VISA_CLASS[country.visaType]);
      // deliberately not keyboard-focusable: 150+ map shapes in the tab order would bury
      // keyboard users for a long time before reaching anything else. The country list
      // below gives full keyboard access to the same data instead.
      g.setAttribute('role', 'button');
      g.setAttribute('aria-label', country.name + ' - ' + VISA_LABELS[country.visaType]);

      if (state.route.some(function (r) { return r.countryId === id; })) g.classList.add('in-route');
      if (filtering && !filteredIds.has(id)) g.classList.add('dimmed');
      if (country.safetyLevel === 'orange') g.classList.add('safety-orange');
      if (country.safetyLevel === 'red') g.classList.add('safety-red');

      const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      title.textContent = country.name + ' · ' + VISA_LABELS[country.visaType] +
        (country.safetyLevel ? ' · 旅遊警示：' + SAFETY_LABELS[country.safetyLevel] : '');
      g.insertBefore(title, g.firstChild);
    });
  }

  function renderRouteLines() {
    if (!mapSvg || !routeLinesLayer) return;
    routeLinesLayer.innerHTML = '';
    const points = [];
    state.route.forEach(function (stop, idx) {
      const g = mapGroups[stop.countryId];
      if (!g) return;
      try {
        const bbox = g.getBBox();
        points.push({ id: stop.countryId, stopId: stop.id, x: bbox.x + bbox.width / 2, y: bbox.y + bbox.height / 2, order: idx + 1 });
      } catch (e) { /* element not rendered yet */ }
    });

    const svgNS = 'http://www.w3.org/2000/svg';
    for (let i = 0; i < points.length - 1; i++) {
      const line = document.createElementNS(svgNS, 'line');
      line.setAttribute('x1', points[i].x);
      line.setAttribute('y1', points[i].y);
      line.setAttribute('x2', points[i + 1].x);
      line.setAttribute('y2', points[i + 1].y);
      routeLinesLayer.appendChild(line);

      const legA = findCountry(points[i].id), legB = findCountry(points[i + 1].id);
      const legKm = legDistanceKm(legA, legB);
      const leg = legKm !== null ? legEstimate(legA, legB, getLegMode(points[i + 1].stopId, legA, legB, legKm)) : null;
      if (leg) {
        const label = document.createElementNS(svgNS, 'text');
        label.setAttribute('class', 'route-leg-label');
        label.setAttribute('x', (points[i].x + points[i + 1].x) / 2);
        label.setAttribute('y', (points[i].y + points[i + 1].y) / 2 - 2);
        label.textContent = TRANSPORT_ICONS[leg.mode] + ' ' + fmtKm(leg.km) + ' · ' + fmtHours(leg.hours);
        routeLinesLayer.appendChild(label);
      }
    }
    points.forEach(function (p) {
      const dot = document.createElementNS(svgNS, 'circle');
      dot.setAttribute('class', 'route-dot');
      dot.setAttribute('cx', p.x);
      dot.setAttribute('cy', p.y);
      dot.setAttribute('r', 4.5);
      routeLinesLayer.appendChild(dot);
      const text = document.createElementNS(svgNS, 'text');
      text.setAttribute('class', 'route-order');
      text.setAttribute('x', p.x);
      text.setAttribute('y', p.y);
      text.textContent = p.order;
      routeLinesLayer.appendChild(text);
    });
  }

  // ---------- zoom & pan ----------
  let zoomScale = 1, panX = 0, panY = 0;
  let mapDragging = false, mapDragMoved = false, dragStartX = 0, dragStartY = 0, dragStartPanX = 0, dragStartPanY = 0;

  function applyMapTransform() {
    mapSvg.style.transform = 'translate(' + panX + 'px,' + panY + 'px) scale(' + zoomScale + ')';
  }

  function setupMapZoomPan() {
    const viewport = document.getElementById('mapViewport');

    // Shared by wheel-zoom and the +/- buttons: zooms toward (cx, cy), a point expressed in
    // viewport-local pixels (e.g. the mouse position, or the viewport's own center for the
    // buttons, which have no pointer position to anchor to).
    function zoomBy(factor, cx, cy) {
      const newScale = Math.min(6, Math.max(1, zoomScale * factor));
      panX = cx - (cx - panX) * (newScale / zoomScale);
      panY = cy - (cy - panY) * (newScale / zoomScale);
      zoomScale = newScale;
      applyMapTransform();
    }

    viewport.addEventListener('wheel', function (e) {
      e.preventDefault();
      const rect = viewport.getBoundingClientRect();
      zoomBy(e.deltaY > 0 ? 0.88 : 1.14, e.clientX - rect.left, e.clientY - rect.top);
    }, { passive: false });

    document.getElementById('mapZoomIn').addEventListener('click', function () {
      const rect = viewport.getBoundingClientRect();
      zoomBy(1.3, rect.width / 2, rect.height / 2);
    });
    document.getElementById('mapZoomOut').addEventListener('click', function () {
      const rect = viewport.getBoundingClientRect();
      zoomBy(1 / 1.3, rect.width / 2, rect.height / 2);
    });
    document.getElementById('mapZoomReset').addEventListener('click', function () {
      zoomScale = 1; panX = 0; panY = 0;
      applyMapTransform();
    });

    viewport.addEventListener('pointerdown', function (e) {
      mapDragging = true;
      mapDragMoved = false;
      dragStartX = e.clientX - panX;
      dragStartY = e.clientY - panY;
      dragStartPanX = panX;
      dragStartPanY = panY;
      viewport.setPointerCapture(e.pointerId);
      viewport.classList.add('grabbing');
    });
    viewport.addEventListener('pointermove', function (e) {
      if (!mapDragging) return;
      const nx = e.clientX - dragStartX, ny = e.clientY - dragStartY;
      // Compare against the pan position at press-down (not the continuously-updated panX/panY),
      // i.e. total displacement since the click started, not the delta since the last pointermove.
      // Comparing against the live panX/panY under-counted real drags spread across many small
      // move events, and could also over-count on low-sample-rate input (touch/some trackpads)
      // where a single event reports a jump — either way it made click-vs-drag detection
      // unreliable for real pointer input even though it looked fine in single-event tests.
      if (!mapDragMoved && (Math.abs(nx - dragStartPanX) > 8 || Math.abs(ny - dragStartPanY) > 8)) mapDragMoved = true;
      panX = nx; panY = ny;
      applyMapTransform();
    });
    function endDrag(e) {
      mapDragging = false;
      viewport.classList.remove('grabbing');
      if (e && e.pointerId != null && viewport.hasPointerCapture(e.pointerId)) {
        viewport.releasePointerCapture(e.pointerId);
      }
      setTimeout(function () { mapDragMoved = false; }, 0);
    }
    viewport.addEventListener('pointerup', function (e) {
      const wasClick = !mapDragMoved;
      endDrag(e);
      if (!wasClick) return;
      // Releasing capture above still isn't enough on its own: capture was already active back
      // when pointerdown/mousedown fired for this same interaction, and a browser's click target
      // is the common ancestor of the mousedown target and the mouseup target — so a captured
      // mousedown (retargeted to viewport, an ANCESTOR of every country shape) poisons the click
      // target regardless of when capture is released afterwards. Skip the click event entirely
      // and hit-test directly from the pointerup coordinates instead.
      const hit = document.elementFromPoint(e.clientX, e.clientY);
      const g = hit && hit.closest('g.country');
      if (!g) return;
      if (!findCountry(g.id.toLowerCase())) return; // no curated data — nothing to select
      selectCountry(g.id.toLowerCase());
    });
    viewport.addEventListener('pointercancel', endDrag);

    viewport.addEventListener('dblclick', function () {
      zoomScale = 1; panX = 0; panY = 0;
      applyMapTransform();
    });
  }

  // =========================================================
  // ---------- tabs ----------
  // =========================================================
  const TAB_STORAGE_KEY = 'rtwActiveTab_v1';

  function switchTab(tab) {
    document.querySelectorAll('.tab-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tab);
    });
    document.querySelectorAll('.tab-panel').forEach(function (panel) {
      panel.hidden = panel.getAttribute('data-tab-panel') !== tab;
    });
    localStorage.setItem(TAB_STORAGE_KEY, tab);
    relocateMap(tab);
    // route-line positions need live layout (getBBox), which a hidden map container can't
    // provide — refresh once the map has landed somewhere visible.
    if (tab === 'map' || tab === 'timeline') renderRoute();
  }

  // The world map SVG is ~1.3MB — rather than keep a second copy for the timeline's mini
  // preview, the single instance is physically reparented between the map tab and the
  // timeline tab, whichever is visible. Zoom/pan resets on the move since a scroll state
  // from one context rarely makes sense in the other.
  function relocateMap(tab) {
    if (!mapSvg) return;
    const mainHost = document.getElementById('mapContainer');
    const timelineHost = document.getElementById('timelineMapContainer');
    if (!mainHost || !timelineHost) return;
    const targetHost = tab === 'timeline' ? timelineHost : mainHost;
    if (mapSvg.parentElement !== targetHost) targetHost.appendChild(mapSvg);
    mapSvg.classList.toggle('in-timeline-context', tab === 'timeline');
    if (routeLinesLayer) routeLinesLayer.classList.toggle('in-timeline-context', tab === 'timeline');
    zoomScale = 1; panX = 0; panY = 0;
    applyMapTransform();
  }

  document.getElementById('tabBar').addEventListener('click', function (e) {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;
    switchTab(btn.getAttribute('data-tab'));
  });

  // =========================================================
  // ---------- currency & budget ----------
  // =========================================================
  const RATES_URL = 'https://open.er-api.com/v6/latest/USD';
  const RATES_CACHE_KEY = 'rtwCurrencyRatesCache_v1';
  const FALLBACK_RATES = {
    USD: 1, TWD: 32.35, KRW: 1459.6, GBP: 0.7495, CAD: 1.4087,
    AUD: 1.4304, NZD: 1.7256, EUR: 0.878, JPY: 163.68,
  };
  let rates = null;
  let lastBudgetTotal = 0;

  function convertCurrency(amount, from, to) {
    if (!rates || !amount || !rates[from] || !rates[to]) return null;
    return (amount / rates[from]) * rates[to];
  }

  function fmtMoney(n) {
    if (n === null || n === undefined || isNaN(n)) return '–';
    return n.toLocaleString('zh-Hant', { maximumFractionDigits: 2 });
  }

  function populateCurrencySelects() {
    if (!rates) return;
    const codes = Object.keys(rates).sort();
    const home = state.homeCurrency || 'TWD';
    ['homeCurrencySelect', 'budgetHomeCurrencySelect'].forEach(function (id) {
      const sel = document.getElementById(id);
      if (!sel) return;
      sel.innerHTML = codes.map(function (c) { return '<option value="' + c + '">' + c + '</option>'; }).join('');
      sel.value = codes.indexOf(home) !== -1 ? home : 'TWD';
    });
    const fromSel = document.getElementById('convFrom'), toSel = document.getElementById('convTo');
    fromSel.innerHTML = codes.map(function (c) { return '<option value="' + c + '">' + c + '</option>'; }).join('');
    toSel.innerHTML = codes.map(function (c) { return '<option value="' + c + '">' + c + '</option>'; }).join('');
    fromSel.value = codes.indexOf('USD') !== -1 ? 'USD' : codes[0];
    toSel.value = codes.indexOf('TWD') !== -1 ? 'TWD' : codes[0];
  }

  function currencyOptionsHtml(selected, codes) {
    return codes.map(function (c) {
      return '<option value="' + c + '"' + (c === selected ? ' selected' : '') + '>' + c + '</option>';
    }).join('');
  }

  function renderCurrencyTab() {
    if (!rates) return;
    const home = document.getElementById('homeCurrencySelect').value || state.homeCurrency;
    const body = document.getElementById('feeTableBody');
    const route = state.route;
    if (!route.length) {
      body.innerHTML = '<tr><td colspan="4" class="empty-state">「我的路線」目前是空的，先去地圖或清單加幾個國家吧。</td></tr>';
      document.getElementById('feeTotal').textContent = '–';
      return;
    }
    let total = 0, hasUnknown = false;
    const rows = route.map(function (stop) {
      const c = findCountry(stop.countryId);
      if (!c) return '';
      let converted = null, origText = '—';
      if (c.fee !== null && c.fee !== undefined) {
        origText = c.fee === 0 ? '免費' : (c.feeCurrency || '') + ' ' + c.fee;
        if (c.fee > 0) {
          converted = convertCurrency(c.fee, c.feeCurrency || 'USD', home);
          if (converted !== null) total += converted; else hasUnknown = true;
        }
      } else if (c.visaType !== 'visa_free') {
        hasUnknown = true;
      }
      return '<tr><td>' + escapeHtml(c.name) + '</td><td>' + (VISA_LABELS[c.visaType] || c.visaType) + '</td>' +
        '<td class="num">' + escapeHtml(origText) + '</td><td class="num">' + (converted !== null ? home + ' ' + fmtMoney(converted) : '–') + '</td></tr>';
    }).join('');
    body.innerHTML = rows;
    document.getElementById('feeTotal').textContent = home + ' ' + fmtMoney(total) + (hasUnknown ? '（尚有費用待查證，未計入）' : '');
  }

  function renderConverter() {
    if (!rates) return;
    const amount = parseFloat(document.getElementById('convAmount').value) || 0;
    const from = document.getElementById('convFrom').value;
    const to = document.getElementById('convTo').value;
    const result = convertCurrency(amount, from, to);
    document.getElementById('convResult').textContent = result !== null ? (fmtMoney(amount) + ' ' + from + ' ≈ ' + fmtMoney(result) + ' ' + to) : '無法換算';
    document.getElementById('convRateLine').textContent = (result !== null && amount > 0) ? '匯率：1 ' + from + ' ≈ ' + fmtMoney(convertCurrency(1, from, to)) + ' ' + to : '';
  }

  function getStopBudget(id) {
    if (!state.budget.perStop[id]) state.budget.perStop[id] = { nights: null, currency: 'USD', accom: null, daily: null, transport: null };
    return state.budget.perStop[id];
  }

  function renderBudgetTab() {
    if (!rates) return;
    const home = document.getElementById('budgetHomeCurrencySelect').value || state.homeCurrency;
    const codes = Object.keys(rates).sort();
    const body = document.getElementById('budgetTableBody');
    const route = state.route;
    if (!route.length) {
      body.innerHTML = '<tr><td colspan="8" class="empty-state">「我的路線」目前是空的，先去地圖或清單加幾個國家吧。</td></tr>';
      document.getElementById('budgetTotal').textContent = '–';
      lastBudgetTotal = 0;
      renderSavings(0, home);
      return;
    }

    let grandTotal = 0;
    const rows = route.map(function (stop) {
      const id = stop.id;
      const c = findCountry(stop.countryId);
      if (!c) return '';
      const sb = getStopBudget(id);
      const autoNights = stopDuration(getSchedule(id));
      const nights = (sb.nights !== null && sb.nights !== undefined && sb.nights !== '') ? Number(sb.nights) : (autoNights !== null ? autoNights : 0);
      const livingCost = (Number(sb.accom) || 0) * nights + (Number(sb.daily) || 0) * nights + (Number(sb.transport) || 0);
      const livingConverted = convertCurrency(livingCost, sb.currency, home) || 0;
      let visaConverted = 0, visaText = '—';
      if (c.fee !== null && c.fee !== undefined && c.fee > 0) {
        visaConverted = convertCurrency(c.fee, c.feeCurrency || 'USD', home) || 0;
        visaText = home + ' ' + fmtMoney(visaConverted);
      } else if (c.fee === 0) {
        visaText = '免費';
      }
      const subtotal = livingConverted + visaConverted;
      grandTotal += subtotal;

      return '<tr data-id="' + id + '" data-country="' + stop.countryId + '">' +
        '<td>' + escapeHtml(c.name) + '</td>' +
        '<td><input type="number" min="0" data-field="nights" data-id="' + id + '" value="' + (sb.nights !== null && sb.nights !== undefined ? sb.nights : '') + '" placeholder="' + (autoNights !== null ? autoNights : 0) + '"></td>' +
        '<td><select data-field="currency" data-id="' + id + '">' + currencyOptionsHtml(sb.currency, codes) + '</select></td>' +
        '<td><input type="number" min="0" data-field="accom" data-id="' + id + '" value="' + (sb.accom || '') + '"></td>' +
        '<td><input type="number" min="0" data-field="daily" data-id="' + id + '" value="' + (sb.daily || '') + '"></td>' +
        '<td><input type="number" min="0" data-field="transport" data-id="' + id + '" value="' + (sb.transport || '') + '"></td>' +
        '<td class="num visa-fee-cell">' + visaText + '</td>' +
        '<td class="num subtotal">' + home + ' ' + fmtMoney(subtotal) + '</td>' +
      '</tr>';
    }).join('');

    body.innerHTML = rows;
    lastBudgetTotal = grandTotal;
    document.getElementById('budgetTotal').textContent = home + ' ' + fmtMoney(grandTotal);
    renderSavings(grandTotal, home);
  }

  // lightweight patch for per-keystroke edits — avoids rebuilding inputs (and losing focus) on every keystroke
  function updateBudgetSubtotals() {
    if (!rates) return;
    const home = document.getElementById('budgetHomeCurrencySelect').value || state.homeCurrency;
    let grandTotal = 0;
    document.querySelectorAll('#budgetTableBody tr[data-id]').forEach(function (tr) {
      const id = tr.getAttribute('data-id');
      const c = findCountry(tr.getAttribute('data-country'));
      if (!c) return;
      const nightsInput = tr.querySelector('[data-field="nights"]');
      const currencySel = tr.querySelector('[data-field="currency"]');
      const accomInput = tr.querySelector('[data-field="accom"]');
      const dailyInput = tr.querySelector('[data-field="daily"]');
      const transportInput = tr.querySelector('[data-field="transport"]');
      const autoNights = stopDuration(getSchedule(id));
      const nights = nightsInput.value !== '' ? Number(nightsInput.value) : (autoNights !== null ? autoNights : 0);
      const livingCost = (Number(accomInput.value) || 0) * nights + (Number(dailyInput.value) || 0) * nights + (Number(transportInput.value) || 0);
      const livingConverted = convertCurrency(livingCost, currencySel.value, home) || 0;
      let visaConverted = 0;
      const visaCell = tr.querySelector('.visa-fee-cell');
      if (c.fee !== null && c.fee !== undefined && c.fee > 0) {
        visaConverted = convertCurrency(c.fee, c.feeCurrency || 'USD', home) || 0;
        if (visaCell) visaCell.textContent = home + ' ' + fmtMoney(visaConverted);
      } else if (visaCell) {
        visaCell.textContent = c.fee === 0 ? '免費' : '—';
      }
      const subtotal = livingConverted + visaConverted;
      grandTotal += subtotal;
      const subtotalCell = tr.querySelector('.subtotal');
      if (subtotalCell) subtotalCell.textContent = home + ' ' + fmtMoney(subtotal);
    });
    lastBudgetTotal = grandTotal;
    document.getElementById('budgetTotal').textContent = home + ' ' + fmtMoney(grandTotal);
    renderSavings(grandTotal, home);
    renderShareSummary();
  }

  function renderSavings(total, home) {
    const el = document.getElementById('savingsGap');
    const funds = parseFloat(document.getElementById('availableFunds').value);
    if (isNaN(funds)) { el.textContent = ''; return; }
    const gap = funds - total;
    el.innerHTML = gap >= 0
      ? '<span class="savings-gap ok">✅ 資金足夠，還多 ' + home + ' ' + fmtMoney(gap) + '</span>'
      : '<span class="savings-gap short">⚠ 還差 ' + home + ' ' + fmtMoney(-gap) + '</span>';
  }

  function setRateStatus(live, extra) {
    const el = document.getElementById('rateStatus');
    if (!el) return;
    el.className = 'rate-status ' + (live ? 'live' : 'fallback');
    el.textContent = live
      ? '✅ 已連線至即時匯率' + (extra ? '（' + extra + '）' : '')
      : '⚠ 無法取得即時匯率，使用內建參考匯率（可能已過時，僅供估算）' + (extra ? '（' + extra + '）' : '');
  }

  function renderCurrencyAndBudget() {
    populateCurrencySelects();
    renderCurrencyTab();
    renderConverter();
    renderBudgetTab();
    renderTimeline();
    renderShareSummary();
  }

  // =========================================================
  // ---------- emergency info ----------
  // =========================================================
  function newEmergencyRowId() {
    return 'ec_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  function renderEmergencyCard() {
    const ec = state.emergencyCard;
    document.querySelectorAll('#emergencyForm [data-ecfield]').forEach(function (input) {
      input.value = ec[input.getAttribute('data-ecfield')] || '';
    });

    const cardsList = document.getElementById('ec_cardsList');
    cardsList.innerHTML = ec.cards.length ? ec.cards.map(function (row) {
      return '<div class="emergency-row">' +
        '<input type="text" data-ecrow="cards" data-ecfield="label" data-id="' + row.id + '" placeholder="卡片名稱（例如：OO銀行 Visa）" value="' + escapeHtml(row.label || '') + '">' +
        '<input type="text" data-ecrow="cards" data-ecfield="phone" data-id="' + row.id + '" placeholder="海外掛失電話" value="' + escapeHtml(row.phone || '') + '">' +
        '<button type="button" class="btn btn-small btn-ghost" data-action="ec-remove-card" data-id="' + row.id + '">移除</button>' +
      '</div>';
    }).join('') : '<div class="empty-state-small">尚未新增</div>';

    const contactsList = document.getElementById('ec_contactsList');
    contactsList.innerHTML = ec.contacts.length ? ec.contacts.map(function (row) {
      return '<div class="emergency-row">' +
        '<input type="text" data-ecrow="contacts" data-ecfield="name" data-id="' + row.id + '" placeholder="姓名" value="' + escapeHtml(row.name || '') + '">' +
        '<input type="text" data-ecrow="contacts" data-ecfield="relation" data-id="' + row.id + '" placeholder="關係" value="' + escapeHtml(row.relation || '') + '">' +
        '<input type="text" data-ecrow="contacts" data-ecfield="phone" data-id="' + row.id + '" placeholder="電話" value="' + escapeHtml(row.phone || '') + '">' +
        '<button type="button" class="btn btn-small btn-ghost" data-action="ec-remove-contact" data-id="' + row.id + '">移除</button>' +
      '</div>';
    }).join('') : '<div class="empty-state-small">尚未新增</div>';
  }

  function renderMissionList() {
    const el = document.getElementById('missionList');
    if (!el) return;
    if (!state.route.length) {
      el.innerHTML = '<div class="empty-state">路線是空的，去地圖或清單挑幾個國家吧！</div>';
      return;
    }
    const seen = {};
    const stops = state.route.filter(function (r) {
      if (seen[r.countryId]) return false;
      seen[r.countryId] = true;
      return true;
    });
    el.innerHTML = stops.map(function (stop) {
      const c = findCountry(stop.countryId);
      if (!c) return '';
      const localEmergencyLine = c.localEmergencyNumber
        ? '<div class="mission-line mission-line-emergency">🚨 當地報警/消防/救護車：' + escapeHtml(c.localEmergencyNumber) + '</div>'
        : '';
      if (c.missionName) {
        return '<div class="mission-card">' +
          '<div class="mission-country">' + escapeHtml(c.name) + '</div>' +
          localEmergencyLine +
          '<div class="mission-name">' + escapeHtml(c.missionName) + '</div>' +
          (c.missionAddress ? '<div class="mission-line">📍 ' + escapeHtml(c.missionAddress) + '</div>' : '') +
          (c.missionPhone ? '<div class="mission-line">☎ ' + escapeHtml(c.missionPhone) + '</div>' : '') +
          (c.missionEmergencyPhone ? '<div class="mission-line">🆘 急難救助：' + escapeHtml(c.missionEmergencyPhone) + '</div>' : '') +
          (c.missionNote ? '<div class="mission-note">' + escapeHtml(c.missionNote) + '</div>' : '') +
        '</div>';
      }
      return '<div class="mission-card mission-card-none">' +
        '<div class="mission-country">' + escapeHtml(c.name) + '</div>' +
        localEmergencyLine +
        '<div class="mission-line dim">此地區查無中華民國駐外館處資料，請至外交部官網查詢鄰近代表處：<a href="https://www.mofa.gov.tw/OverseasOffice.aspx?n=168&sms=87" target="_blank" rel="noopener">駐外館處查詢</a></div>' +
      '</div>';
    }).join('');
  }

  function renderEmergencyTab() {
    renderEmergencyCard();
    renderMissionList();
  }

  document.getElementById('emergencyForm').addEventListener('input', function (e) {
    const field = e.target.closest('[data-ecfield]');
    if (!field) return;
    const rowType = field.getAttribute('data-ecrow');
    if (rowType) {
      const row = state.emergencyCard[rowType].find(function (r) { return r.id === field.getAttribute('data-id'); });
      if (row) row[field.getAttribute('data-ecfield')] = field.value;
    } else {
      state.emergencyCard[field.getAttribute('data-ecfield')] = field.value;
    }
    saveState();
  });

  document.getElementById('emergencyForm').addEventListener('click', function (e) {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.getAttribute('data-action');
    if (action === 'ec-add-card') {
      state.emergencyCard.cards.push({ id: newEmergencyRowId(), label: '', phone: '' });
    } else if (action === 'ec-add-contact') {
      state.emergencyCard.contacts.push({ id: newEmergencyRowId(), name: '', relation: '', phone: '' });
    } else if (action === 'ec-remove-card') {
      state.emergencyCard.cards = state.emergencyCard.cards.filter(function (r) { return r.id !== btn.getAttribute('data-id'); });
    } else if (action === 'ec-remove-contact') {
      state.emergencyCard.contacts = state.emergencyCard.contacts.filter(function (r) { return r.id !== btn.getAttribute('data-id'); });
    } else {
      return;
    }
    saveState();
    renderEmergencyCard();
  });

  // =========================================================
  // ---------- share / printable summary ----------
  // =========================================================
  function buildShareData() {
    const home = state.homeCurrency || 'TWD';
    const stops = state.route.map(function (stop, idx) {
      const c = findCountry(stop.countryId);
      if (!c) return null;
      const sched = getSchedule(stop.id);
      const duration = stopDuration(sched);
      const cities = getCities(stop.id);
      const sb = state.budget.perStop[stop.id] || null;
      let leg = null;
      if (idx > 0) {
        const prevC = findCountry(state.route[idx - 1].countryId);
        const km = prevC ? legDistanceKm(prevC, c) : null;
        if (km !== null) leg = legEstimate(prevC, c, getLegMode(stop.id, prevC, c, km));
      }
      const visitCount = state.route.filter(function (r, i) { return i <= idx && r.countryId === stop.countryId; }).length;
      return { stop: stop, country: c, sched: sched, duration: duration, cities: cities, budget: sb, leg: leg, visitCount: visitCount, order: idx + 1 };
    }).filter(Boolean);

    const sc = computeSchedule();

    let accomTotal = 0, dailyTotal = 0, transportTotal = 0, visaTotal = 0;
    let hasUnknownFee = false;
    stops.forEach(function (s) {
      const sb = s.budget;
      const nights = sb && sb.nights !== null && sb.nights !== undefined && sb.nights !== '' ? Number(sb.nights) : (s.duration !== null ? s.duration : 0);
      if (sb) {
        accomTotal += convertCurrency((Number(sb.accom) || 0) * nights, sb.currency, home) || 0;
        dailyTotal += convertCurrency((Number(sb.daily) || 0) * nights, sb.currency, home) || 0;
        transportTotal += convertCurrency(Number(sb.transport) || 0, sb.currency, home) || 0;
      }
      if (s.country.fee !== null && s.country.fee !== undefined && s.country.fee > 0) {
        visaTotal += convertCurrency(s.country.fee, s.country.feeCurrency || 'USD', home) || 0;
      } else if (s.country.visaType !== 'visa_free') {
        hasUnknownFee = true;
      }
    });
    const grandTotal = accomTotal + dailyTotal + transportTotal + visaTotal;

    return {
      stops: stops, sc: sc, home: home,
      accomTotal: accomTotal, dailyTotal: dailyTotal, transportTotal: transportTotal, visaTotal: visaTotal,
      grandTotal: grandTotal, hasUnknownFee: hasUnknownFee,
      availableFunds: state.budget.availableFunds,
    };
  }

  function shareDocBodyHtml(data) {
    if (!data.stops.length) {
      return '<div class="share-empty">「我的路線」目前是空的，先回總覽地圖加幾個國家，這裡就會出現行程摘要。</div>';
    }
    const sc = data.sc;
    const dateRangeText = sc.totalDays ? (fmtDate(sc.minDate) + ' → ' + fmtDate(sc.maxDate)) : '日期尚未排定';

    const rows = data.stops.map(function (s) {
      const c = s.country;
      const visitLabel = s.visitCount > 1 ? '（第' + s.visitCount + '次）' : '';
      const dateText = (s.sched.arrive && s.sched.depart) ? (s.sched.arrive + ' ~ ' + s.sched.depart) : '未排定';
      const legText = s.leg ? (TRANSPORT_ICONS[s.leg.mode] + ' ' + TRANSPORT_LABELS[s.leg.mode] + ' ' + fmtKm(s.leg.km) + ' / ' + fmtHours(s.leg.hours)) : '－';
      const visaText = VISA_LABELS[c.visaType] + (formatFee(c) ? '（' + formatFee(c) + '）' : '') +
        (c.yellowFeverStatus ? '｜💉 ' + YELLOW_FEVER_LABELS[c.yellowFeverStatus] : '');
      const citiesText = s.cities.length ? s.cities.map(function (city) { return city.name + (city.nights ? city.nights + '晚' : ''); }).join('、') : '－';
      let subtotal = 0;
      if (s.budget) {
        const nights = s.budget.nights !== null && s.budget.nights !== undefined && s.budget.nights !== '' ? Number(s.budget.nights) : (s.duration !== null ? s.duration : 0);
        subtotal += convertCurrency((Number(s.budget.accom) || 0) * nights, s.budget.currency, data.home) || 0;
        subtotal += convertCurrency((Number(s.budget.daily) || 0) * nights, s.budget.currency, data.home) || 0;
        subtotal += convertCurrency(Number(s.budget.transport) || 0, s.budget.currency, data.home) || 0;
      }
      if (c.fee > 0) subtotal += convertCurrency(c.fee, c.feeCurrency || 'USD', data.home) || 0;

      return '<tr>' +
        '<td>' + s.order + '</td>' +
        '<td>' + escapeHtml(c.name) + escapeHtml(visitLabel) + '</td>' +
        '<td>' + escapeHtml(dateText) + (s.duration !== null ? '<br><small>' + s.duration + ' 天</small>' : '') + '</td>' +
        '<td>' + escapeHtml(visaText) + '</td>' +
        '<td>' + escapeHtml(legText) + '</td>' +
        '<td>' + escapeHtml(citiesText) + '</td>' +
        '<td class="num">' + data.home + ' ' + fmtMoney(subtotal) + '</td>' +
      '</tr>';
    }).join('');

    const gapLine = (data.availableFunds !== null && data.availableFunds !== undefined && data.availableFunds !== '')
      ? '<tr><td>可用資金</td><td class="num">' + data.home + ' ' + fmtMoney(Number(data.availableFunds)) + '</td></tr>' +
        '<tr><td><strong>' + (Number(data.availableFunds) - data.grandTotal >= 0 ? '結餘' : '缺口') + '</strong></td><td class="num"><strong>' + data.home + ' ' + fmtMoney(Math.abs(Number(data.availableFunds) - data.grandTotal)) + '</strong></td></tr>'
      : '';

    const emergencyRows = data.stops
      .filter(function (s) { return s.country.localEmergencyNumber || s.country.missionPhone; })
      .map(function (s) {
        const c = s.country;
        return '<tr>' +
          '<td>' + escapeHtml(c.name) + '</td>' +
          '<td>' + escapeHtml(c.localEmergencyNumber || '－') + '</td>' +
          '<td>' + (c.missionPhone ? escapeHtml(c.missionName + '　' + c.missionPhone) : '查無代表處，請上外交部官網查詢鄰近館處') + '</td>' +
        '</tr>';
      }).join('');
    const emergencySection = emergencyRows
      ? '<h2>緊急聯絡資訊</h2>' +
        '<table class="share-table">' +
          '<thead><tr><th>國家</th><th>當地報警/消防/救護車</th><th>台灣駐外代表處</th></tr></thead>' +
          '<tbody>' + emergencyRows + '</tbody>' +
        '</table>'
      : '';

    const schengen = computeSchengenUsage(sc);
    const schengenWarning = (schengen && schengen.overLimit)
      ? '<p class="share-warning">⚠ 申根區 90/180 天規則：以 ' + fmtDate(schengen.peakDate) + ' 為基準往回推 180 天，累積在申根區待了 ' + schengen.peakDays + ' 天，已超過 90 天上限，請調整行程。</p>'
      : '';

    return (
      '<div class="share-header">' +
        '<h1>🧭 我的大航海時代 · 環遊世界行程摘要</h1>' +
        '<p class="share-meta">' + escapeHtml(dateRangeText) + (sc.totalDays ? '　·　共 ' + sc.totalDays + ' 天' : '') + '　·　' + data.stops.length + ' 站　·　產生於 ' + fmtDate(new Date()) + '</p>' +
      '</div>' +
      '<table class="share-table">' +
        '<thead><tr><th>#</th><th>國家</th><th>日期</th><th>簽證</th><th>交通方式</th><th>城市</th><th class="num">預估花費</th></tr></thead>' +
        '<tbody>' + rows + '</tbody>' +
      '</table>' +
      '<h2>預算總覽</h2>' +
      '<table class="share-table share-budget-table">' +
        '<tbody>' +
          '<tr><td>簽證費用</td><td class="num">' + data.home + ' ' + fmtMoney(data.visaTotal) + (data.hasUnknownFee ? '　(部分待查證，未計入)' : '') + '</td></tr>' +
          '<tr><td>住宿費用</td><td class="num">' + data.home + ' ' + fmtMoney(data.accomTotal) + '</td></tr>' +
          '<tr><td>生活費用</td><td class="num">' + data.home + ' ' + fmtMoney(data.dailyTotal) + '</td></tr>' +
          '<tr><td>交通費用</td><td class="num">' + data.home + ' ' + fmtMoney(data.transportTotal) + '</td></tr>' +
          '<tr class="share-grand-total"><td>總計</td><td class="num">' + data.home + ' ' + fmtMoney(data.grandTotal) + '</td></tr>' +
          gapLine +
        '</tbody>' +
      '</table>' +
      emergencySection +
      '<div class="share-footer">' +
        schengenWarning +
        '<p>⚠ 簽證與旅遊警示資訊僅供規劃參考，出發前請至 <a href="https://www.boca.gov.tw" target="_blank" rel="noopener">外交部領事事務局</a> 核實最新規定；距離與交通時間為粗略估算，未計入轉機/等候時間。</p>' +
        '<p>由「大航海時代」環遊世界 Dashboard 產生</p>' +
      '</div>'
    );
  }

  function renderShareSummary() {
    const el = document.getElementById('shareDoc');
    if (!el) return;
    el.innerHTML = shareDocBodyHtml(buildShareData());
  }

  function buildStandaloneShareHtml(data) {
    const printCss = document.getElementById('sharePrintStyle') ? document.getElementById('sharePrintStyle').textContent : '';
    return '<!DOCTYPE html><html lang="zh-Hant"><head><meta charset="UTF-8">' +
      '<title>環遊世界行程摘要</title><style>' + printCss + '</style></head>' +
      '<body><div class="share-doc">' + shareDocBodyHtml(data) + '</div></body></html>';
  }

  document.getElementById('printSummaryBtn').addEventListener('click', function () {
    window.print();
  });

  document.getElementById('exportSummaryBtn').addEventListener('click', function () {
    const html = buildStandaloneShareHtml(buildShareData());
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '環遊世界行程摘要-' + new Date().toISOString().slice(0, 10) + '.html';
    a.click();
    URL.revokeObjectURL(url);
  });

  function initRates() {
    let cached = null;
    try { cached = JSON.parse(localStorage.getItem(RATES_CACHE_KEY) || 'null'); } catch (e) { cached = null; }

    fetch(RATES_URL).then(function (res) {
      if (!res.ok) throw new Error('bad response');
      return res.json();
    }).then(function (data) {
      if (!data || !data.rates) throw new Error('no rates');
      rates = data.rates;
      localStorage.setItem(RATES_CACHE_KEY, JSON.stringify({ rates: rates, fetchedAt: Date.now() }));
      setRateStatus(true, data.time_last_update_utc ? '更新於 ' + data.time_last_update_utc : '');
      renderCurrencyAndBudget();
    }).catch(function () {
      if (cached && cached.rates) {
        rates = cached.rates;
        const ageDays = Math.round((Date.now() - cached.fetchedAt) / 86400000);
        setRateStatus(false, '使用 ' + ageDays + ' 天前的快取匯率');
      } else {
        rates = FALLBACK_RATES;
        setRateStatus(false, '使用內建匯率表');
      }
      renderCurrencyAndBudget();
    });
  }

  document.getElementById('homeCurrencySelect').addEventListener('change', function () {
    state.homeCurrency = this.value;
    saveState();
    renderCurrencyTab();
  });
  document.getElementById('budgetHomeCurrencySelect').addEventListener('change', function () {
    state.homeCurrency = this.value;
    saveState();
    document.getElementById('homeCurrencySelect').value = this.value;
    renderBudgetTab();
  });
  ['convAmount', 'convFrom', 'convTo'].forEach(function (id) {
    document.getElementById(id).addEventListener('input', renderConverter);
    document.getElementById(id).addEventListener('change', renderConverter);
  });
  document.getElementById('convSwap').addEventListener('click', function () {
    const f = document.getElementById('convFrom'), t = document.getElementById('convTo');
    const tmp = f.value; f.value = t.value; t.value = tmp;
    renderConverter();
  });
  document.getElementById('availableFunds').addEventListener('input', function () {
    state.budget.availableFunds = this.value === '' ? null : Number(this.value);
    saveState();
    renderSavings(lastBudgetTotal, document.getElementById('budgetHomeCurrencySelect').value || state.homeCurrency);
    renderShareSummary();
  });
  document.getElementById('budgetTableBody').addEventListener('input', function (e) {
    const el = e.target.closest('[data-field]');
    if (!el || el.tagName === 'SELECT') return;
    const sb = getStopBudget(el.getAttribute('data-id'));
    sb[el.getAttribute('data-field')] = el.value === '' ? null : el.value;
    saveState();
    updateBudgetSubtotals();
  });
  document.getElementById('budgetTableBody').addEventListener('change', function (e) {
    const el = e.target.closest('[data-field="currency"]');
    if (!el) return;
    getStopBudget(el.getAttribute('data-id')).currency = el.value;
    saveState();
    updateBudgetSubtotals();
  });

  // Ticks the already-rendered local-time labels in the route sidebar once a minute.
  // Deliberately only touches those text nodes (not a full renderRoute()), since a full
  // re-render would wipe out any in-progress, not-yet-submitted input the traveller is
  // mid-typing (e.g. a new city name) every time the clock ticks.
  function updateRouteClocks() {
    document.querySelectorAll('#routeList .local-time[data-tz]').forEach(function (el) {
      const info = getLocalTimeInfo(el.getAttribute('data-tz'));
      if (!info) return;
      el.textContent = '🕐 ' + info.timeStr + (info.diffLabel ? '（' + info.diffLabel + '）' : '');
    });
  }

  // ---------- init ----------
  document.getElementById('lastCompiled').textContent = SEED_META.lastCompiled;
  document.getElementById('disclaimerBody').innerHTML = [SEED_META.sourceNote, SEED_META.safetyNote, SEED_META.healthNote]
    .filter(Boolean)
    .map(function (note) { return '<p>' + escapeHtml(note) + '</p>'; })
    .join('') + '<p><a href="https://www.boca.gov.tw" target="_blank" rel="noopener">前往外交部領事事務局官網</a></p>';
  if (state.budget.availableFunds !== null && state.budget.availableFunds !== undefined) {
    document.getElementById('availableFunds').value = state.budget.availableFunds;
  }
  initMap();
  initRates();
  renderAll();
  switchTab(localStorage.getItem(TAB_STORAGE_KEY) || 'map');
  setInterval(updateRouteClocks, 60000);
})();
