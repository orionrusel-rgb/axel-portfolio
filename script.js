(() => {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Shared handle so anchor navigation can stop the inertial scroll loop.
  let stopInertialScroll = () => {};

  /* ========================================================================
     1. WORLD CLOCK — ALL COUNTRIES (~195) DRIVING HERO (12H) & PRINCIPLE 5 (24H)
     ======================================================================== */
  const COUNTRY_TIMEZONES = [
    ['Indonesia — Sidoarjo', 'SIDOARJO, ID', 'Asia/Jakarta'],
    ['Afghanistan', 'KABUL, AF', 'Asia/Kabul'],
    ['Albania', 'TIRANA, AL', 'Europe/Tirane'],
    ['Algeria', 'ALGIERS, DZ', 'Africa/Algiers'],
    ['Andorra', 'ANDORRA LA VELLA, AD', 'Europe/Andorra'],
    ['Angola', 'LUANDA, AO', 'Africa/Luanda'],
    ['Antigua and Barbuda', 'SAINT JOHN’S, AG', 'America/Antigua'],
    ['Argentina', 'BUENOS AIRES, AR', 'America/Argentina/Buenos_Aires'],
    ['Armenia', 'YEREVAN, AM', 'Asia/Yerevan'],
    ['Australia', 'SYDNEY, AU', 'Australia/Sydney'],
    ['Austria', 'VIENNA, AT', 'Europe/Vienna'],
    ['Azerbaijan', 'BAKU, AZ', 'Asia/Baku'],
    ['Bahamas', 'NASSAU, BS', 'America/Nassau'],
    ['Bahrain', 'MANAMA, BH', 'Asia/Bahrain'],
    ['Bangladesh', 'DHAKA, BD', 'Asia/Dhaka'],
    ['Barbados', 'BRIDGETOWN, BB', 'America/Barbados'],
    ['Belarus', 'MINSK, BY', 'Europe/Minsk'],
    ['Belgium', 'BRUSSELS, BE', 'Europe/Brussels'],
    ['Belize', 'BELMOPAN, BZ', 'America/Belize'],
    ['Benin', 'PORTO-NOVO, BJ', 'Africa/Porto-Novo'],
    ['Bhutan', 'THIMPHU, BT', 'Asia/Thimphu'],
    ['Bolivia', 'LA PAZ, BO', 'America/La_Paz'],
    ['Bosnia and Herzegovina', 'SARAJEVO, BA', 'Europe/Sarajevo'],
    ['Botswana', 'GABORONE, BW', 'Africa/Gaborone'],
    ['Brazil', 'BRASILIA, BR', 'America/Sao_Paulo'],
    ['Brunei', 'BANDAR SERI BEGAWAN, BN', 'Asia/Brunei'],
    ['Bulgaria', 'SOFIA, BG', 'Europe/Sofia'],
    ['Burkina Faso', 'OUAGADOUGOU, BF', 'Africa/Ouagadougou'],
    ['Burundi', 'GITEGA, BI', 'Africa/Bujumbura'],
    ['Cambodia', 'PHNOM PENH, KH', 'Asia/Phnom_Penh'],
    ['Cameroon', 'YAOUNDE, CM', 'Africa/Douala'],
    ['Canada', 'OTTAWA, CA', 'America/Toronto'],
    ['Cape Verde', 'PRAIA, CV', 'Atlantic/Cape_Verde'],
    ['Central African Republic', 'BANGUI, CF', 'Africa/Bangui'],
    ['Chad', 'N’DJAMENA, TD', 'Africa/Ndjamena'],
    ['Chile', 'SANTIAGO, CL', 'America/Santiago'],
    ['China', 'BEIJING, CN', 'Asia/Shanghai'],
    ['Colombia', 'BOGOTA, CO', 'America/Bogota'],
    ['Comoros', 'MORONI, KM', 'Indian/Comoro'],
    ['Congo', 'BRAZZAVILLE, CG', 'Africa/Brazzaville'],
    ['Costa Rica', 'SAN JOSE, CR', 'America/Costa_Rica'],
    ['Croatia', 'ZAGREB, HR', 'Europe/Zagreb'],
    ['Cuba', 'HAVANA, CU', 'America/Havana'],
    ['Cyprus', 'NICOSIA, CY', 'Asia/Nicosia'],
    ['Czech Republic', 'PRAGUE, CZ', 'Europe/Prague'],
    ['Denmark', 'COPENHAGEN, DK', 'Europe/Copenhagen'],
    ['Djibouti', 'DJIBOUTI, DJ', 'Africa/Djibouti'],
    ['Dominica', 'ROSEAU, DM', 'America/Dominica'],
    ['Dominican Republic', 'SANTO DOMINGO, DO', 'America/Santo_Domingo'],
    ['DR Congo', 'KINSHASA, CD', 'Africa/Kinshasa'],
    ['Ecuador', 'QUITO, EC', 'America/Guayaquil'],
    ['Egypt', 'CAIRO, EG', 'Africa/Cairo'],
    ['El Salvador', 'SAN SALVADOR, SV', 'America/El_Salvador'],
    ['Equatorial Guinea', 'MALABO, GQ', 'Africa/Malabo'],
    ['Eritrea', 'ASMARA, ER', 'Africa/Asmara'],
    ['Estonia', 'TALLINN, EE', 'Europe/Tallinn'],
    ['Eswatini', 'MBABANE, SZ', 'Africa/Mbabane'],
    ['Ethiopia', 'ADDIS ABABA, ET', 'Africa/Addis_Ababa'],
    ['Fiji', 'SUVA, FJ', 'Pacific/Fiji'],
    ['Finland', 'HELSINKI, FI', 'Europe/Helsinki'],
    ['France', 'PARIS, FR', 'Europe/Paris'],
    ['Gabon', 'LIBREVILLE, GA', 'Africa/Libreville'],
    ['Gambia', 'BANJUL, GM', 'Africa/Banjul'],
    ['Georgia', 'TBILISI, GE', 'Asia/Tbilisi'],
    ['Germany', 'BERLIN, DE', 'Europe/Berlin'],
    ['Ghana', 'ACCRA, GH', 'Africa/Accra'],
    ['Greece', 'ATHENS, GR', 'Europe/Athens'],
    ['Grenada', 'SAINT GEORGE’S, GD', 'America/Grenada'],
    ['Guatemala', 'GUATEMALA CITY, GT', 'America/Guatemala'],
    ['Guinea', 'CONAKRY, GN', 'Africa/Conakry'],
    ['Guinea-Bissau', 'BISSAU, GW', 'Africa/Bissau'],
    ['Guyana', 'GEORGETOWN, GY', 'America/Guyana'],
    ['Haiti', 'PORT-AU-PRINCE, HT', 'America/Port-au-Prince'],
    ['Honduras', 'TEGUCIGALPA, HN', 'America/Tegucigalpa'],
    ['Hungary', 'BUDAPEST, HU', 'Europe/Budapest'],
    ['Iceland', 'REYKJAVIK, IS', 'Atlantic/Reykjavik'],
    ['India', 'NEW DELHI, IN', 'Asia/Kolkata'],
    ['Iraq', 'BAGHDAD, IQ', 'Asia/Baghdad'],
    ['Ireland', 'DUBLIN, IE', 'Europe/Dublin'],
    ['Israel', 'JERUSALEM, IL', 'Asia/Jerusalem'],
    ['Italy', 'ROME, IT', 'Europe/Rome'],
    ['Ivory Coast', 'ABIDJAN, CI', 'Africa/Abidjan'],
    ['Jamaica', 'KINGSTON, JM', 'America/Jamaica'],
    ['Japan', 'TOKYO, JP', 'Asia/Tokyo'],
    ['Jordan', 'AMMAN, JO', 'Asia/Amman'],
    ['Kazakhstan', 'ASTANA, KZ', 'Asia/Almaty'],
    ['Kenya', 'NAIROBI, KE', 'Africa/Nairobi'],
    ['Kiribati', 'TARAWA, KI', 'Pacific/Tarawa'],
    ['Kuwait', 'KUWAIT CITY, KW', 'Asia/Kuwait'],
    ['Kyrgyzstan', 'BISHKEK, KG', 'Asia/Bishkek'],
    ['Laos', 'VIENTIANE, LA', 'Asia/Vientiane'],
    ['Latvia', 'RIGA, LV', 'Europe/Riga'],
    ['Lebanon', 'BEIRUT, LB', 'Asia/Beirut'],
    ['Lesotho', 'MASERU, LS', 'Africa/Maseru'],
    ['Liberia', 'MONROVIA, LR', 'Africa/Monrovia'],
    ['Libya', 'TRIPOLI, LY', 'Africa/Tripoli'],
    ['Liechtenstein', 'VADUZ, LI', 'Europe/Vaduz'],
    ['Lithuania', 'VILNIUS, LT', 'Europe/Vilnius'],
    ['Luxembourg', 'LUXEMBOURG, LU', 'Europe/Luxembourg'],
    ['Madagascar', 'ANTANANARIVO, MG', 'Indian/Antananarivo'],
    ['Malawi', 'LILONGWE, MW', 'Africa/Blantyre'],
    ['Malaysia', 'KUALA LUMPUR, MY', 'Asia/Kuala_Lumpur'],
    ['Maldives', 'MALE, MV', 'Indian/Maldives'],
    ['Mali', 'BAMAKO, ML', 'Africa/Bamako'],
    ['Malta', 'VALLETTA, MT', 'Europe/Malta'],
    ['Marshall Islands', 'MAJURO, MH', 'Pacific/Majuro'],
    ['Mauritania', 'NOUAKCHOTT, MR', 'Africa/Nouakchott'],
    ['Mauritius', 'PORT LOUIS, MU', 'Indian/Mauritius'],
    ['Mexico', 'MEXICO CITY, MX', 'America/Mexico_City'],
    ['Micronesia', 'PALIKIR, FM', 'Pacific/Chuuk'],
    ['Moldova', 'CHISINAU, MD', 'Europe/Chisinau'],
    ['Monaco', 'MONACO, MC', 'Europe/Monaco'],
    ['Mongolia', 'ULAANBAATAR, MN', 'Asia/Ulaanbaatar'],
    ['Montenegro', 'PODGORICA, ME', 'Europe/Podgorica'],
    ['Morocco', 'RABAT, MA', 'Africa/Casablanca'],
    ['Mozambique', 'MAPUTO, MZ', 'Africa/Maputo'],
    ['Myanmar', 'NAYPYIDAW, MM', 'Asia/Yangon'],
    ['Namibia', 'WINDHOEK, NA', 'Africa/Windhoek'],
    ['Nauru', 'YAREN, NR', 'Pacific/Nauru'],
    ['Nepal', 'KATHMANDU, NP', 'Asia/Kathmandu'],
    ['Netherlands', 'AMSTERDAM, NL', 'Europe/Amsterdam'],
    ['New Zealand', 'WELLINGTON, NZ', 'Pacific/Auckland'],
    ['Nicaragua', 'MANAGUA, NI', 'America/Managua'],
    ['Niger', 'NIAMEY, NE', 'Africa/Niamey'],
    ['Nigeria', 'ABUJA, NG', 'Africa/Lagos'],
    ['North Korea', 'PYONGYANG, KP', 'Asia/Pyongyang'],
    ['North Macedonia', 'SKOPJE, MK', 'Europe/Skopje'],
    ['Norway', 'OSLO, NO', 'Europe/Oslo'],
    ['Oman', 'MUSCAT, OM', 'Asia/Muscat'],
    ['Pakistan', 'ISLAMABAD, PK', 'Asia/Karachi'],
    ['Palau', 'NGERULMUD, PW', 'Pacific/Palau'],
    ['Palestine', 'RAMALLAH, PS', 'Asia/Gaza'],
    ['Panama', 'PANAMA CITY, PA', 'America/Panama'],
    ['Papua New Guinea', 'PORT MORESBY, PG', 'Pacific/Port_Moresby'],
    ['Paraguay', 'ASUNCION, PY', 'America/Asuncion'],
    ['Peru', 'LIMA, PE', 'America/Lima'],
    ['Philippines', 'MANILA, PH', 'Asia/Manila'],
    ['Poland', 'WARSAW, PL', 'Europe/Warsaw'],
    ['Portugal', 'LISBON, PT', 'Europe/Lisbon'],
    ['Qatar', 'DOHA, QA', 'Asia/Qatar'],
    ['Romania', 'BUCHAREST, RO', 'Europe/Bucharest'],
    ['Russia', 'MOSCOW, RU', 'Europe/Moscow'],
    ['Rwanda', 'KIGALI, RW', 'Africa/Kigali'],
    ['Saint Kitts and Nevis', 'BASSETERRE, KN', 'America/St_Kitts'],
    ['Saint Lucia', 'CASTRIES, LC', 'America/St_Lucia'],
    ['Saint Vincent and the Grenadines', 'KINGSTOWN, VC', 'America/St_Vincent'],
    ['Samoa', 'APIA, WS', 'Pacific/Apia'],
    ['San Marino', 'SAN MARINO, SM', 'Europe/San_Marino'],
    ['Sao Tome and Principe', 'SAO TOME, ST', 'Africa/Sao_Tome'],
    ['Saudi Arabia', 'RIYADH, SA', 'Asia/Riyadh'],
    ['Senegal', 'DAKAR, SN', 'Africa/Dakar'],
    ['Serbia', 'BELGRADE, RS', 'Europe/Belgrade'],
    ['Seychelles', 'VICTORIA, SC', 'Indian/Mahe'],
    ['Sierra Leone', 'FREETOWN, SL', 'Africa/Freetown'],
    ['Singapore', 'SINGAPORE, SG', 'Asia/Singapore'],
    ['Slovakia', 'BRATISLAVA, SK', 'Europe/Bratislava'],
    ['Slovenia', 'LJUBLJANA, SI', 'Europe/Ljubljana'],
    ['Solomon Islands', 'HONIARA, SB', 'Pacific/Guadalcanal'],
    ['Somalia', 'MOGADISHU, SO', 'Africa/Mogadishu'],
    ['South Africa', 'PRETORIA, ZA', 'Africa/Johannesburg'],
    ['South Korea', 'SEOUL, KR', 'Asia/Seoul'],
    ['South Sudan', 'JUBA, SS', 'Africa/Juba'],
    ['Spain', 'MADRID, ES', 'Europe/Madrid'],
    ['Sri Lanka', 'COLOMBO, LK', 'Asia/Colombo'],
    ['Sudan', 'KHARTOUM, SD', 'Africa/Khartoum'],
    ['Suriname', 'PARAMARIBO, SR', 'America/Paramaribo'],
    ['Sweden', 'STOCKHOLM, SE', 'Europe/Stockholm'],
    ['Switzerland', 'BERN, CH', 'Europe/Zurich'],
    ['Syria', 'DAMASCUS, SY', 'Asia/Damascus'],
    ['Taiwan', 'TAIPEI, TW', 'Asia/Taipei'],
    ['Tajikistan', 'DUSHANBE, TJ', 'Asia/Dushanbe'],
    ['Tanzania', 'DODOMA, TZ', 'Africa/Dar_es_Salaam'],
    ['Thailand', 'BANGKOK, TH', 'Asia/Bangkok'],
    ['Timor-Leste', 'DILI, TL', 'Asia/Dili'],
    ['Togo', 'LOME, TG', 'Africa/Lome'],
    ['Tonga', 'NUKU’ALOFA, TO', 'Pacific/Tongatapu'],
    ['Trinidad and Tobago', 'PORT OF SPAIN, TT', 'America/Port_of_Spain'],
    ['Tunisia', 'TUNIS, TN', 'Africa/Tunis'],
    ['Turkey', 'ANKARA, TR', 'Europe/Istanbul'],
    ['Turkmenistan', 'ASHGABAT, TM', 'Asia/Ashgabat'],
    ['Tuvalu', 'FUNAFUTI, TV', 'Pacific/Funafuti'],
    ['Uganda', 'KAMPALA, UG', 'Africa/Kampala'],
    ['Ukraine', 'KYIV, UA', 'Europe/Kyiv'],
    ['United Arab Emirates', 'DUBAI, AE', 'Asia/Dubai'],
    ['United Kingdom', 'LONDON, GB', 'Europe/London'],
    ['United States', 'NEW YORK, US', 'America/New_York'],
    ['Uruguay', 'MONTEVIDEO, UY', 'America/Montevideo'],
    ['Uzbekistan', 'TASHKENT, UZ', 'Asia/Tashkent'],
    ['Vanuatu', 'PORT VILA, VU', 'Pacific/Efate'],
    ['Vatican City', 'VATICAN CITY, VA', 'Europe/Vatican'],
    ['Venezuela', 'CARACAS, VE', 'America/Caracas'],
    ['Vietnam', 'HO CHI MINH, VN', 'Asia/Ho_Chi_Minh'],
    ['Yemen', 'SANAA, YE', 'Asia/Aden'],
    ['Zambia', 'LUSAKA, ZM', 'Africa/Lusaka'],
    ['Zimbabwe', 'HARARE, ZW', 'Africa/Harare'],
  ];

  function initWorldClocks() {
    const heroClockEl = document.getElementById('live-clock-hero');
    const principleClockEl = document.getElementById('live-clock-principle');
    const heroLocationEl = document.getElementById('clock-location');
    const principleLocationEl = document.getElementById('principle-clock-location');
    const dropdownEl = document.getElementById('country-tz-dropdown');
    const triggerEl = document.getElementById('country-tz-trigger');
    const triggerLabelEl = document.getElementById('country-tz-label');
    const listEl = document.getElementById('country-tz-list');
    const searchEl = document.getElementById('country-tz-search');
    const emptyEl = document.getElementById('country-tz-empty');

    if (!heroClockEl && !principleClockEl) return;

    let selectedIndex = 0;

    function format12Hour(date, timeZone) {
      try {
        const parts = new Intl.DateTimeFormat('en-US', {
          timeZone,
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        }).formatToParts(date);

        let hour = '00';
        let minute = '00';
        let period = '';
        for (const p of parts) {
          if (p.type === 'hour') hour = p.value.padStart(2, '0');
          if (p.type === 'minute') minute = p.value.padStart(2, '0');
          if (p.type === 'dayPeriod') period = p.value.toUpperCase();
        }
        return `${hour}:${minute} ${period}`;
      } catch {
        return format12Hour(date, 'UTC');
      }
    }

    function format24Hour(date, timeZone) {
      try {
        const parts = new Intl.DateTimeFormat('en-GB', {
          timeZone,
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).formatToParts(date);

        let hour = '00';
        let minute = '00';
        for (const p of parts) {
          if (p.type === 'hour') hour = p.value === '24' ? '00' : p.value.padStart(2, '0');
          if (p.type === 'minute') minute = p.value.padStart(2, '0');
        }
        return `${hour}:${minute}`;
      } catch {
        return format24Hour(date, 'UTC');
      }
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function renderClockTime(el, text) {
      if (!el) return;
      if (el.dataset.text === text) return;
      const prev = el.dataset.text || '';
      const frag = document.createDocumentFragment();
      [...text].forEach((ch, i) => {
        const charEl = document.createElement('span');
        charEl.className = 'clock-char';
        if (ch === ':') charEl.classList.add('clock-char-colon');
        const display = ch === ' ' ? '\u00A0' : ch;
        if (!reduceMotion && prev && prev[i] !== undefined && prev[i] !== ch) {
          const oldDisplay = prev[i] === ' ' ? '\u00A0' : prev[i];
          charEl.classList.add('is-rolling');
          const stack = document.createElement('span');
          stack.className = 'clock-char-stack';
          const oldSpan = document.createElement('span');
          oldSpan.textContent = oldDisplay;
          const newSpan = document.createElement('span');
          newSpan.textContent = display;
          stack.appendChild(oldSpan);
          stack.appendChild(newSpan);
          charEl.appendChild(stack);
          const settle = () => {
            if (!charEl.isConnected || !charEl.querySelector('.clock-char-stack')) return;
            charEl.classList.remove('is-rolling');
            charEl.textContent = display;
          };
          stack.addEventListener('animationend', settle, { once: true });
          setTimeout(settle, 700);
        } else {
          charEl.textContent = display;
        }
        frag.appendChild(charEl);
      });
      el.replaceChildren(frag);
      el.dataset.text = text;
    }

    function setLocation(el, label, animate) {
      if (!el || el.textContent === label) return;
      el.textContent = label;
      if (animate) {
        el.classList.remove('loc-swap');
        void el.offsetWidth;
        el.classList.add('loc-swap');
      }
    }

    function renderClocks(animateLocation = false) {
      const entry = COUNTRY_TIMEZONES[selectedIndex] || COUNTRY_TIMEZONES[0];
      const [, label, tz] = entry;
      const now = new Date();
      const iso = now.toISOString();

      setLocation(heroLocationEl, label, animateLocation);
      setLocation(principleLocationEl, label, animateLocation);

      if (heroClockEl) {
        renderClockTime(heroClockEl, format12Hour(now, tz));
        heroClockEl.setAttribute('datetime', iso);
      }

      if (principleClockEl) {
        renderClockTime(principleClockEl, format24Hour(now, tz));
        principleClockEl.setAttribute('datetime', iso);
      }
    }

    function visibleOptions() {
      return [...listEl.querySelectorAll('.tz-option')].filter((li) => !li.hidden);
    }

    function setActiveOption(li) {
      listEl.querySelectorAll('.tz-option.is-active').forEach((item) => {
        item.classList.remove('is-active');
        item.removeAttribute('aria-selected');
      });
      if (li) {
        li.classList.add('is-active');
        li.setAttribute('aria-selected', 'true');
        li.scrollIntoView({ block: 'nearest' });
      }
    }

    function closeDropdown() {
      if (!dropdownEl) return;
      dropdownEl.classList.remove('is-open');
      triggerEl.setAttribute('aria-expanded', 'false');
      setActiveOption(null);
    }

    function selectCountry(idx, { close = true } = {}) {
      if (!COUNTRY_TIMEZONES[idx]) return;
      selectedIndex = idx;
      const [name] = COUNTRY_TIMEZONES[idx];
      if (triggerLabelEl) triggerLabelEl.textContent = name;
      listEl.querySelectorAll('.tz-option').forEach((li) => {
        li.classList.toggle('is-selected', Number(li.dataset.index) === idx);
      });
      renderClocks(true);
      if (close) closeDropdown();
    }

    function openDropdown() {
      if (!dropdownEl) return;
      dropdownEl.classList.add('is-open');
      triggerEl.setAttribute('aria-expanded', 'true');
      const panel = document.getElementById('country-tz-panel');
      if (panel) {
        if (window.innerWidth <= 809) {
          panel.style.top = `${triggerEl.getBoundingClientRect().bottom + 10}px`;
        } else {
          panel.style.top = '';
        }
      }
      if (searchEl) {
        searchEl.value = '';
        filterOptions('');
        if (window.matchMedia('(pointer: fine)').matches) {
          setTimeout(() => searchEl.focus(), 60);
        }
      }
      const selected = listEl.querySelector('.tz-option.is-selected');
      if (selected) selected.scrollIntoView({ block: 'nearest' });
    }

    function filterOptions(query) {
      const q = query.trim().toLowerCase();
      let shown = 0;
      listEl.querySelectorAll('.tz-option').forEach((li) => {
        const match = !q || li.dataset.search.includes(q);
        li.hidden = !match;
        if (match) shown += 1;
      });
      if (emptyEl) emptyEl.hidden = shown > 0;
      setActiveOption(null);
    }

    if (dropdownEl && triggerEl && listEl) {
      const frag = document.createDocumentFragment();
      COUNTRY_TIMEZONES.forEach(([countryName, label], idx) => {
        const li = document.createElement('li');
        li.className = 'tz-option';
        li.setAttribute('role', 'option');
        li.dataset.index = String(idx);
        li.dataset.search = `${countryName} ${label}`.toLowerCase();
        if (idx === 0) li.classList.add('is-selected');
        const nameEl = document.createElement('span');
        nameEl.textContent = countryName;
        const cityEl = document.createElement('span');
        cityEl.className = 'tz-option-city';
        cityEl.textContent = label;
        li.appendChild(nameEl);
        li.appendChild(cityEl);
        frag.appendChild(li);
      });
      listEl.appendChild(frag);

      triggerEl.addEventListener('click', () => {
        if (dropdownEl.classList.contains('is-open')) {
          closeDropdown();
        } else {
          openDropdown();
        }
      });

      listEl.addEventListener('click', (event) => {
        const li = event.target.closest('.tz-option');
        if (!li) return;
        selectCountry(Number(li.dataset.index));
        triggerEl.focus();
      });

      if (searchEl) {
        searchEl.addEventListener('input', () => filterOptions(searchEl.value));
        searchEl.addEventListener('keydown', (event) => {
          if (event.key === 'Escape') {
            closeDropdown();
            triggerEl.focus();
          }
        });
      }

      document.addEventListener('keydown', (event) => {
        if (!dropdownEl.classList.contains('is-open')) return;
        const options = visibleOptions();
        if (event.key === 'Escape') {
          closeDropdown();
          triggerEl.focus();
          return;
        }
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault();
          if (!options.length) return;
          const dir = event.key === 'ArrowDown' ? 1 : -1;
          const current = options.findIndex((li) => li.classList.contains('is-active'));
          const next = (current + dir + options.length) % options.length;
          setActiveOption(options[next]);
          return;
        }
        if (event.key === 'Enter') {
          const current = options.find((li) => li.classList.contains('is-active'));
          if (current) {
            event.preventDefault();
            selectCountry(Number(current.dataset.index));
            triggerEl.focus();
          }
        }
      });

      document.addEventListener('click', (event) => {
        if (!dropdownEl.contains(event.target)) closeDropdown();
      });

      window.addEventListener('scroll', closeDropdown, { passive: true });
      window.addEventListener('resize', closeDropdown);
    }

    renderClocks();
    setInterval(renderClocks, 1000);
  }

  /* ========================================================================
     V4. GENERIC TEXT ROLL — wrap every .roll-hover host's text in the same
     two-copy roll stack the bracket buttons use.
     ======================================================================== */
  function initRollText() {
    document.querySelectorAll('.roll-hover').forEach((host) => {
      const target = host.querySelector('.faq-question') || host;
      if (target.querySelector('.roll-stack')) return;
      const text = target.textContent.trim();
      if (!text) return;
      const roll = document.createElement('span');
      roll.className = 'roll';
      const stack = document.createElement('span');
      stack.className = 'roll-stack';
      const copy1 = document.createElement('span');
      copy1.className = 'roll-copy';
      copy1.textContent = text;
      const copy2 = document.createElement('span');
      copy2.className = 'roll-copy';
      copy2.setAttribute('aria-hidden', 'true');
      copy2.textContent = text;
      stack.appendChild(copy1);
      stack.appendChild(copy2);
      roll.appendChild(stack);
      target.textContent = '';
      target.appendChild(roll);
    });
  }

  /* ========================================================================
     2. HAMBURGER MENU & FULLSCREEN BLACK OVERLAY
     ======================================================================== */
  function initOverlayMenu() {
    const openBtn = document.getElementById('menu-toggle');
    const closeBtn = document.getElementById('menu-close');
    const overlay = document.getElementById('nav-overlay');
    if (!openBtn || !overlay) return;

    const closeLinks = overlay.querySelectorAll('.overlay-close-link');

    function openMenu() {
      overlay.classList.add('is-open');
      overlay.setAttribute('aria-hidden', 'false');
      openBtn.setAttribute('aria-expanded', 'true');
      document.body.classList.add('menu-open');
      document.documentElement.classList.add('menu-open');
    }

    function closeMenu() {
      overlay.classList.remove('is-open');
      overlay.setAttribute('aria-hidden', 'true');
      openBtn.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('menu-open');
      document.documentElement.classList.remove('menu-open');
    }

    openBtn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);

    closeLinks.forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && overlay.classList.contains('is-open')) {
        closeMenu();
        openBtn.focus();
      }
    });

    const desktopBreakpoint = window.matchMedia('(min-width: 810px)');
    desktopBreakpoint.addEventListener('change', (event) => {
      if (event.matches && overlay.classList.contains('is-open')) {
        closeMenu();
      }
    });
  }

  /* ========================================================================
     3. /WORKED WITH — CONTINUOUS MARQUEE (~20px/s, measured from reference)
     ======================================================================== */
  function initWorkedMarquee() {
    const track = document.getElementById('worked-track');
    if (!track) return;
    if (prefersReducedMotion) {
      track.style.animation = 'none';
      return;
    }
    const setDuration = () => {
      const setWidth = track.scrollWidth / 2;
      if (setWidth > 0) {
        track.style.animationDuration = `${setWidth / 20}s`;
      }
    };
    setDuration();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(setDuration);
    }
    window.addEventListener('load', setDuration);
  }

  /* ========================================================================
     4. FACTS & FIGURES COUNT-UP (~1.4s, measured from reference)
     ======================================================================== */
  function initStatCounters() {
    const factsSection = document.getElementById('facts-figures');
    const counters = Array.from(document.querySelectorAll('.stat-number[data-target]'));
    if (!factsSection || !counters.length) return;

    function setFinalValues() {
      counters.forEach((el) => {
        const target = el.dataset.target || '0';
        const suffix = el.dataset.suffix || '';
        el.textContent = `${target}${suffix}`;
      });
    }

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      setFinalValues();
      return;
    }

    counters.forEach((el) => {
      const suffix = el.dataset.suffix || '';
      el.textContent = `0${suffix}`;
    });

    function runCountUp() {
      const startTime = performance.now();

      counters.forEach((el) => {
        const target = parseInt(el.dataset.target, 10);
        const suffix = el.dataset.suffix || '';
        if (Number.isNaN(target)) return;

        const duration = 2100;

        function tick(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.round(eased * target);

          el.textContent = `${current}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(tick);
          } else {
            el.textContent = `${target}${suffix}`;
          }
        }

        requestAnimationFrame(tick);
      });
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runCountUp();
            observer.unobserve(factsSection);
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(factsSection);
  }

  /* ========================================================================
     5. TESTIMONIALS HORIZONTAL RAIL (PURE AUTOPLAY ~5s, NO ARROWS/DOTS,
     HARDENED INFINITE LOOP — NEVER SHOWS EMPTY SPACE)
     ======================================================================== */
  function initTestimonialRail() {
    const rail = document.getElementById('testimonial-rail');
    if (!rail) return;

    const track = rail.querySelector('.testimonial-rail-track');
    if (!track) return;

    const originalCards = Array.from(track.children);
    const totalOriginal = originalCards.length;
    if (!totalOriginal) return;

    const INTERVAL_MS = 5000;
    const TRANSITION_MS = 750;
    const CLONE_SETS = 3; // 1 original + 3 cloned sets (12 cards) fills ~4.5+ visible slots at any index

    const frag = document.createDocumentFragment();
    for (let copy = 0; copy < CLONE_SETS; copy += 1) {
      originalCards.forEach((card) => {
        const clone = card.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        frag.appendChild(clone);
      });
    }
    track.appendChild(frag);

    let index = 0;
    let animating = false;
    let timerId = null;
    let settleTimerId = null;

    function getStepPx() {
      const firstCard = track.children[0];
      if (!firstCard) return 0;
      const cardRect = firstCard.getBoundingClientRect();
      const styles = getComputedStyle(track);
      const gap = parseFloat(styles.columnGap || styles.gap || '0') || 0;
      return cardRect.width + gap;
    }

    function applyOffset(animate) {
      const step = getStepPx();
      track.style.transition = animate
        ? `transform ${TRANSITION_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`
        : 'none';
      track.style.transform = `translate3d(${-(index * step)}px, 0, 0)`;
    }

    function settleStep() {
      if (settleTimerId !== null) {
        clearTimeout(settleTimerId);
        settleTimerId = null;
      }
      animating = false;
      if (index >= totalOriginal) {
        index = index % totalOriginal;
        applyOffset(false);
      }
    }

    function stepNext() {
      if (animating) return;
      if (index >= totalOriginal) {
        index = index % totalOriginal;
        applyOffset(false);
        void track.offsetWidth;
      }
      animating = true;
      index += 1;
      applyOffset(true);
      // Fallback in case transitionend is skipped (e.g. background tab or resize)
      settleTimerId = setTimeout(settleStep, TRANSITION_MS + 120);
    }

    track.addEventListener('transitionend', (event) => {
      if (event.target !== track || event.propertyName !== 'transform') return;
      settleStep();
    });

    function startAutoplay() {
      stopAutoplay();
      if (prefersReducedMotion) return;
      timerId = setInterval(stepNext, INTERVAL_MS);
    }

    function stopAutoplay() {
      if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
      }
    }

    applyOffset(false);
    startAutoplay();

    window.addEventListener(
      'resize',
      () => {
        if (settleTimerId !== null) {
          clearTimeout(settleTimerId);
          settleTimerId = null;
        }
        animating = false;
        index = index % totalOriginal;
        applyOffset(false);
      },
      { passive: true }
    );

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        stopAutoplay();
        settleStep();
      } else {
        startAutoplay();
      }
    });
  }

  /* ========================================================================
     6. FAQ — INDEPENDENT OPEN/CLOSE TOGGLES
     ======================================================================== */
  function initFaq() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach((item) => {
      const trigger = item.querySelector('.faq-trigger');
      if (!trigger) return;

      trigger.addEventListener('click', () => {
        const willOpen = !item.classList.contains('is-open');
        item.classList.toggle('is-open', willOpen);
        trigger.setAttribute('aria-expanded', String(willOpen));
      });
    });
  }

  /* ========================================================================
     7. INERTIAL SCROLL (V5)
     ======================================================================== */
  function initInertialScroll() {
    if (prefersReducedMotion) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const html = document.documentElement;
    html.style.scrollBehavior = 'auto';

    const LERP = 0.11;
    const DELTA_SCALE = 0.9;

    let target = window.scrollY;
    let current = window.scrollY;
    let lastSetY = window.scrollY;
    let rafId = null;
    let lastTime = 0;

    const maxScroll = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

    function step(timestamp) {
      const dt = Math.min(timestamp - lastTime, 50);
      lastTime = timestamp;
      if (target > maxScroll()) target = maxScroll();
      const factor = 1 - Math.pow(1 - LERP, dt / 16.667);
      current += (target - current) * factor;
      if (Math.abs(target - current) < 0.5) {
        current = target;
        window.scrollTo(0, current);
        lastSetY = window.scrollY;
        rafId = null;
        return;
      }
      window.scrollTo(0, current);
      lastSetY = window.scrollY;
      rafId = requestAnimationFrame(step);
    }

    function start(timestamp) {
      if (rafId === null) {
        lastTime = timestamp || performance.now();
        rafId = requestAnimationFrame(step);
      }
    }

    function stop() {
      if (rafId !== null) cancelAnimationFrame(rafId);
      rafId = null;
      target = window.scrollY;
      current = window.scrollY;
      lastSetY = window.scrollY;
    }
    stopInertialScroll = stop;

    window.addEventListener('wheel', (event) => {
      if (document.body.classList.contains('menu-open')) return;
      if (event.ctrlKey) return;
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
      const t = event.target;
      if (t && t.closest && (t.closest('.tz-panel') || t.closest('input, textarea, select'))) return;
      event.preventDefault();
      let dy = event.deltaY;
      if (event.deltaMode === 1) dy *= 32;
      else if (event.deltaMode === 2) dy *= window.innerHeight;
      if (rafId === null) {
        current = window.scrollY;
        target = window.scrollY;
      }
      target = Math.min(Math.max(target + dy * DELTA_SCALE, 0), maxScroll());
      start();
    }, { passive: false });

    window.addEventListener('scroll', () => {
      if (rafId === null) {
        target = window.scrollY;
        current = window.scrollY;
        lastSetY = window.scrollY;
        return;
      }
      if (Math.abs(window.scrollY - lastSetY) > 4) stop();
    }, { passive: true });

    window.addEventListener('keydown', (event) => {
      if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) stop();
    });
    window.addEventListener('touchstart', stop, { passive: true });
    window.addEventListener('resize', () => { if (target > maxScroll()) target = maxScroll(); });
    document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
  }

  /* ========================================================================
     8. SMOOTH SCROLL FOR INTERNAL ANCHOR LINKS
     ======================================================================== */
  function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    if (!anchorLinks.length) return;

    anchorLinks.forEach((link) => {
      link.addEventListener('click', (event) => {
        const href = link.getAttribute('href');
        if (!href || href === '#') return;

        if (href === '#top') {
          event.preventDefault();
          stopInertialScroll();
          window.scrollTo({
            top: 0,
            behavior: prefersReducedMotion ? 'auto' : 'smooth',
          });
          return;
        }

        const target = document.querySelector(href);
        if (!target) return;

        event.preventDefault();
        stopInertialScroll();
        target.scrollIntoView({
          behavior: prefersReducedMotion ? 'auto' : 'smooth',
          block: 'start',
        });

        if (history.pushState) {
          history.pushState(null, '', href);
        }
      });
    });
  }

  /* ========================================================================
     INITIALIZE ALL MODULES
     ======================================================================== */
  function init() {
    initWorldClocks();
    initRollText();
    initOverlayMenu();
    initWorkedMarquee();
    initStatCounters();
    initTestimonialRail();
    initFaq();
    initSmoothScroll();
    initInertialScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();