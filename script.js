document.documentElement.classList.add('has-js');
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const activeMotion = new Set();
const elementMotion = new WeakMap();
const motionEase = 'cubic-bezier(0.22, 1, 0.36, 1)';

function animateElement(element, keyframes, options = {}) {
  elementMotion.get(element)?.cancel();
  if (motionPreference.matches || typeof element.animate !== 'function') return null;
  const animation = element.animate(keyframes, { duration: 600, easing: motionEase, ...options });
  elementMotion.set(element, animation);
  activeMotion.add(animation);
  const cleanup = () => {
    activeMotion.delete(animation);
    if (elementMotion.get(element) === animation) elementMotion.delete(element);
  };
  animation.finished.then(cleanup, cleanup);
  return animation;
}

document.querySelectorAll('.paper-authors').forEach((element) => {
  element.innerHTML = element.textContent.replace(/\bShi QH\b/g, '<strong class="shi-author">Shi QH</strong>');
});

document.querySelectorAll('.paper-citation').forEach((element) => {
  const citation = element.textContent.trim();
  const match = citation.match(/^(.*?)(\s(?:19|20)\d{2},.*)$/);
  if (match) element.innerHTML = `<strong>${match[1]}</strong>${match[2]}`;
});

document.querySelectorAll('.paper-list .paper-item time').forEach((element, index) => {
  const number = document.createElement('span');
  number.className = 'paper-number';
  number.textContent = String(index + 1);
  number.setAttribute('aria-label', `Publication ${index + 1}`);
  element.replaceWith(number);
});

const pubmedPmids = new Map([
  ['Spatial multi-omics unveils the monoclonal origin, neuroendocrine plasticity, and microenvironment niches in combined small-cell lung cancer', '41966692'],
  ['Single-cell sequencing-guided annotation of rare tumor cells for deep learning-based cytopathologic diagnosis of early lung cancer', '40231585'],
  ['Single-cell low-pass whole genome sequencing accurately detects circulating tumor cells for liquid biopsy-based multi-cancer diagnosis', '38321112'],
  ['Liquid biopsy-based accurate diagnosis and genomic profiling of hard-to-biopsy tumors via parallel single-cell genomic sequencing of exfoliated tumor cells', '39197101'],
  ['Single-cell genomics-based molecular algorithm for early cancer detection', '35077134'],
  ['A multicancer malignant pleural effusion diagnostic test using hexokinase 2 and single-cell sequencing', '35142335'],
  ['Metabolic regulation of prostate cancer heterogeneity and plasticity', '33290846'],
  ['Hexokinase 2 discerns a novel circulating tumor cell population associated with poor prognosis in lung cancer patients', '33836566'],
  ['Single-cell sequencing-enabled hexokinase 2 assay for noninvasive bladder cancer diagnosis and screening by detecting rare malignant cells in urine', '33269906'],
  ['Liquid Biopsy-Based Single-Cell Metabolic Phenotyping of Lung Cancer Patients for Informative Diagnostics', '31451693'],
  ['High-throughput screening of rare metabolically active tumor cells in pleural effusion and peripheral blood of lung cancer patients', '28223509'],
  ['Hypoxia Induces a Phase Transition within a Kinase Signaling Network in Cancer Cells', '23530221'],
  ['A clinical microchip for evaluation of single immune cells reveals high functional heterogeneity in phenotypically similar T cells', '21602800']
]);

document.querySelectorAll('.paper-list .paper-item').forEach((item) => {
  const title = item.querySelector('.paper-title')?.textContent.trim();
  const content = item.querySelector(':scope > div');
  const pmid = title ? pubmedPmids.get(title) : null;
  if (!pmid || !content) return;
  const links = document.createElement('div');
  links.className = 'paper-links';
  const pubmed = document.createElement('a');
  pubmed.className = 'pubmed-link';
  pubmed.href = `https://pubmed.ncbi.nlm.nih.gov/${pmid}/`;
  pubmed.target = '_blank';
  pubmed.rel = 'noreferrer';
  pubmed.innerHTML = 'PubMed <span>↗</span>';
  links.appendChild(pubmed);
  content.appendChild(links);
});

const navigation = document.querySelector('#site-nav');
const menuButton = document.querySelector('.menu-toggle');
if (navigation && menuButton) {
  const mobileNavigation = window.matchMedia('(max-width: 850px)');
  const setMenuOpen = (open) => {
    navigation.classList.toggle('open', open);
    navigation.inert = mobileNavigation.matches && !open;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  };
  menuButton.addEventListener('click', () => {
    setMenuOpen(menuButton.getAttribute('aria-expanded') !== 'true');
  });
  navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenuOpen(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
      setMenuOpen(false);
      menuButton.focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.site-header')) setMenuOpen(false);
  });
  mobileNavigation.addEventListener('change', () => setMenuOpen(false));
  setMenuOpen(false);
  const updateCurrentNavigation = () => {
    const page = location.pathname.split('/').pop() || 'index.html';
    const atlasChildPage = ['biology.html', 'data.html', 'gallery.html'].includes(page);
    navigation.querySelectorAll('a').forEach((link) => {
      link.removeAttribute('aria-current');
      const target = new URL(link.href);
      if (target.origin !== location.origin || target.hash) return;
      const targetPage = target.pathname.split('/').pop() || 'index.html';
      if (page === targetPage) link.setAttribute('aria-current', 'page');
      else if (atlasChildPage && targetPage === 'atlas.html') link.setAttribute('aria-current', 'location');
    });
  };
  updateCurrentNavigation();
  window.addEventListener('hashchange', updateCurrentNavigation);
}

const specimenFilters = [...document.querySelectorAll('[data-specimen-filter]')];
if (specimenFilters.length) {
  const records = [...document.querySelectorAll('.dataset-record[data-specimen]')];
  const emptyState = document.querySelector('.dataset-empty');
  const summary = document.querySelector('.filter-summary');
  const results = document.querySelector('.dataset-results');
  specimenFilters.forEach((button) => button.addEventListener('click', () => {
    if (button.getAttribute('aria-pressed') === 'true') return;
    const previousHeight = results?.getBoundingClientRect().height;
    const specimen = button.dataset.specimenFilter;
    specimenFilters.forEach((filter) => filter.setAttribute('aria-pressed', String(filter === button)));
    let visible = 0;
    records.forEach((record) => {
      record.hidden = specimen !== 'all' && record.dataset.specimen !== specimen;
      if (!record.hidden) visible++;
    });
    if (emptyState) emptyState.hidden = visible !== 0;
    if (summary) summary.textContent = visible + ' published dataset' + (visible === 1 ? '' : 's');
    if (results) {
      results.classList.remove('motion-pending');
      results.dataset.motionState = 'visible';
      elementMotion.get(results)?.cancel();
      const nextHeight = results.getBoundingClientRect().height;
      if (previousHeight !== nextHeight) {
        animateElement(results, [{ height: previousHeight + 'px' }, { height: nextHeight + 'px' }], { duration: 420 });
      }
    }
    [...records, emptyState].filter((element) => element && !element.hidden).forEach((element) => {
      animateElement(element, [
        { opacity: 0, transform: 'translate3d(0, 9px, 0)' },
        { opacity: 1, transform: 'translate3d(0, 0, 0)' }
      ], { duration: 360 });
    });
  }));
}

// Content is visible by default. Only a working observer opts into reveal effects.
const motionTargets = [...document.querySelectorAll(
  '.hero-copy > *, .hero-image, .home-mission, .research-heading, .research-themes > article, ' +
  '.atlas-category, .sequencing-overview, .atlas-card, .resource-explainer > article, .home-more > a, .page-hero > *, .catalog-head, ' +
  '.definition-band > *, .sample-grid > article, .bio-layers > div, ' +
  '.evidence-note > *, .schema-grid > article, .dataset-results, .data-flow > *, ' +
  '.download-types > div, .publication-record, .paper-list > .paper-item, ' +
  '.paper-era-label, .preprint-section > *, .lab-section > .section-tag, ' +
  '.lab-overview-copy > p, .lab-overview-image, .lab-section > div > h2, .lab-section > div > p, ' +
  '.research-directions > article, .lab-section .empty-state'
)];
let revealObserver;

function revealElement(element, delay = 0) {
  if (!element.classList.contains('motion-pending')) return;
  element.classList.remove('motion-pending');
  element.dataset.motionState = 'visible';
  animateElement(element, [
    { opacity: 0, transform: 'translate3d(0, 18px, 0)' },
    { opacity: 1, transform: 'translate3d(0, 0, 0)' }
  ], { duration: 720, delay, fill: 'backwards' });
  revealObserver?.unobserve(element);
}

function initializeReveals() {
  revealObserver?.disconnect();
  activeMotion.forEach((animation) => animation.cancel());
  motionTargets.forEach((element) => {
    element.classList.remove('motion-pending');
    element.dataset.motionState = 'visible';
  });
  if (motionPreference.matches || !('IntersectionObserver' in window) || !Element.prototype.animate) return;
  revealObserver = new IntersectionObserver((entries) => {
    let order = 0;
    entries.forEach((entry) => {
      if (entry.isIntersecting) revealElement(entry.target, Math.min(order++ * 65, 180));
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -25px 0px' });
  let entranceOrder = 0;
  motionTargets.forEach((element) => {
    if (element.hidden || element.closest('[hidden]') || element.getBoundingClientRect().bottom <= 0) return;
    element.classList.add('motion-pending');
    element.dataset.motionState = 'pending';
    if (element.getBoundingClientRect().top < innerHeight - 25) {
      revealElement(element, Math.min(entranceOrder++ * 65, 260));
    } else {
      revealObserver.observe(element);
    }
  });
}

initializeReveals();
motionPreference.addEventListener('change', initializeReveals);
document.addEventListener('focusin', (event) => {
  const pending = event.target.closest('.motion-pending');
  if (pending) revealElement(pending);
});
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    motionTargets.forEach((element) => element.classList.remove('motion-pending'));
  }
});

const siteHeader = document.querySelector('.site-header');
let scrollFrame = 0;
function updateHeader() {
  siteHeader?.classList.toggle('is-scrolled', scrollY > 12);
  scrollFrame = 0;
}
window.addEventListener('scroll', () => {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(updateHeader);
}, { passive: true });
updateHeader();

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
