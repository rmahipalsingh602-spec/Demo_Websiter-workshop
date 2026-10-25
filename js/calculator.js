/* ==========================================================================
   VARDHAN WOODCRAFT - INTERACTIVE COST ESTIMATOR
   Calculates realistic woodwork estimates based on craft specifications
   ========================================================================== */

const WoodCalculator = (() => {
  // Base configuration
  const CONFIG = {
    workTypes: {
      kitchen: { name: 'Modular Kitchen', baseRate: 1550, unit: 'sq.ft', defaultSize: 90, minSize: 45, maxSize: 300, timePer100: 14 },
      wardrobe: { name: 'Full Height Wardrobe', baseRate: 1350, unit: 'sq.ft', defaultSize: 75, minSize: 35, maxSize: 300, timePer100: 10 },
      furniture: { name: 'Custom Furniture / Dining', baseRate: 1850, unit: 'sq.ft', defaultSize: 40, minSize: 15, maxSize: 150, timePer100: 8 },
      door: { name: 'Main Door & Frames', baseRate: 2100, unit: 'sq.ft', defaultSize: 32, minSize: 21, maxSize: 90, timePer100: 7 },
      panelling: { name: 'Fluted Wall Panels', baseRate: 580, unit: 'sq.ft', defaultSize: 120, minSize: 40, maxSize: 500, timePer100: 9 },
      fullhome: { name: 'Full Home Woodwork', baseRate: 1280, unit: 'sq.ft', defaultSize: 350, minSize: 150, maxSize: 1200, timePer100: 28 }
    },
    materials: {
      marine_ply: { name: 'BWP Marine Ply (IS:710) + Merino 1mm Laminate', mult: 1.0, quality: 'High Moisture Proof' },
      acrylic: { name: 'BWR Calibrated Ply + 2mm Anti-Scratch Acrylic', mult: 1.25, quality: 'Mirror Gloss Modern' },
      teak: { name: '100% Solid CP Teak (Sagwan) Hardwood', mult: 1.85, quality: 'Heirloom Grade Solid Timber' },
      sheesham: { name: 'Pure Indian Sheesham (Rosewood)', mult: 1.65, quality: 'Rich Natural Grain' },
      oak_veneer: { name: 'Natural Oak / Walnut Veneer + Polish', mult: 1.45, quality: 'Architectural Luxury' }
    },
    hardware: {
      standard: { name: 'Heavy Duty Soft-Close (Ebco / Godrej)', mult: 1.0 },
      blum_hafele: { name: 'German Blum / Häfele Hydraulic Fittings', mult: 1.22 },
      brass_luxury: { name: 'Artisanal Hand-Forged Brass Hardware', mult: 1.30 }
    },
    finishes: {
      matte_oil: { name: 'Natural Matt Hardwax Wood Oil', mult: 1.0 },
      melamine: { name: 'Melamine Satin Scratch-Resist Polish', mult: 1.08 },
      pu_gloss: { name: 'Italian PU Polish (Polyurethane High Gloss)', mult: 1.25 },
      french_polish: { name: 'Traditional Hand Spirit French Polish', mult: 1.15 }
    }
  };

  // State
  let state = {
    workType: 'kitchen',
    material: 'marine_ply',
    size: 90,
    hardware: 'standard',
    finish: 'matte_oil'
  };

  function init() {
    bindEvents();
    updateUI();
  }

  function bindEvents() {
    // Work type chips
    document.querySelectorAll('[data-calc-work]').forEach(chip => {
      chip.addEventListener('click', (e) => {
        const val = chip.getAttribute('data-calc-work');
        setWorkType(val);
      });
    });

    // Material chips
    document.querySelectorAll('[data-calc-material]').forEach(chip => {
      chip.addEventListener('click', () => {
        const val = chip.getAttribute('data-calc-material');
        setMaterial(val);
      });
    });

    // Hardware chips
    document.querySelectorAll('[data-calc-hardware]').forEach(chip => {
      chip.addEventListener('click', () => {
        const val = chip.getAttribute('data-calc-hardware');
        setHardware(val);
      });
    });

    // Finish chips
    document.querySelectorAll('[data-calc-finish]').forEach(chip => {
      chip.addEventListener('click', () => {
        const val = chip.getAttribute('data-calc-finish');
        setFinish(val);
      });
    });

    // Size Slider
    const sizeSlider = document.getElementById('calc-size-slider');
    if (sizeSlider) {
      sizeSlider.addEventListener('input', (e) => {
        state.size = parseInt(e.target.value, 10);
        updateUI();
      });
    }

    // "Copy to Quote Form" CTA button
    const copyBtn = document.getElementById('btn-copy-to-quote');
    if (copyBtn) {
      copyBtn.addEventListener('click', syncToQuoteForm);
    }
  }

  function setWorkType(type) {
    if (!CONFIG.workTypes[type]) return;
    state.workType = type;
    
    // adjust slider range
    const workData = CONFIG.workTypes[type];
    const slider = document.getElementById('calc-size-slider');
    if (slider) {
      slider.min = workData.minSize;
      slider.max = workData.maxSize;
      slider.value = workData.defaultSize;
      state.size = workData.defaultSize;
    }

    document.querySelectorAll('[data-calc-work]').forEach(el => {
      el.classList.toggle('active', el.getAttribute('data-calc-work') === type);
    });

    updateUI();
  }

  function setMaterial(mat) {
    if (!CONFIG.materials[mat]) return;
    state.material = mat;
    document.querySelectorAll('[data-calc-material]').forEach(el => {
      el.classList.toggle('active', el.getAttribute('data-calc-material') === mat);
    });
    updateUI();
  }

  function setHardware(hw) {
    if (!CONFIG.hardware[hw]) return;
    state.hardware = hw;
    document.querySelectorAll('[data-calc-hardware]').forEach(el => {
      el.classList.toggle('active', el.getAttribute('data-calc-hardware') === hw);
    });
    updateUI();
  }

  function setFinish(fin) {
    if (!CONFIG.finishes[fin]) return;
    state.finish = fin;
    document.querySelectorAll('[data-calc-finish]').forEach(el => {
      el.classList.toggle('active', el.getAttribute('data-calc-finish') === fin);
    });
    updateUI();
  }

  function calculate() {
    const work = CONFIG.workTypes[state.workType];
    const mat = CONFIG.materials[state.material];
    const hw = CONFIG.hardware[state.hardware];
    const fin = CONFIG.finishes[state.finish];

    const baseCost = work.baseRate * state.size;
    const combinedMultiplier = mat.mult * hw.mult * fin.mult;
    
    const estMid = Math.round(baseCost * combinedMultiplier);
    const estMin = Math.round(estMid * 0.94);
    const estMax = Math.round(estMid * 1.08);

    // Days calculation
    const days = Math.max(5, Math.round((state.size / 100) * work.timePer100));

    return {
      estMin,
      estMax,
      estMid,
      days,
      workName: work.name,
      matName: mat.name,
      hwName: hw.name,
      finName: fin.name,
      size: state.size,
      unit: work.unit
    };
  }

  function formatRupees(amount) {
    return '₹' + amount.toLocaleString('en-IN');
  }

  function updateUI() {
    const res = calculate();

    // Update Slider text
    const sliderValDisplay = document.getElementById('calc-slider-display');
    if (sliderValDisplay) {
      sliderValDisplay.textContent = `${res.size} ${res.unit}`;
    }

    // Update live estimate range
    const estDisplay = document.getElementById('live-calc-amount');
    if (estDisplay) {
      estDisplay.textContent = `${formatRupees(res.estMin)} - ${formatRupees(res.estMax)}`;
    }

    // Update summary labels
    const specWork = document.getElementById('spec-work-type');
    const specMat = document.getElementById('spec-material');
    const specDays = document.getElementById('spec-timeline');
    const specHw = document.getElementById('spec-hardware');

    if (specWork) specWork.textContent = res.workName;
    if (specMat) specMat.textContent = res.matName.split('+')[0];
    if (specDays) specDays.textContent = `~${res.days} to ${res.days + 4} Days`;
    if (specHw) specHw.textContent = res.hwName.split('(')[0];
  }

  function syncToQuoteForm() {
    const res = calculate();
    const serviceSelect = document.getElementById('quote-service-select');
    const notesInput = document.getElementById('quote-notes');

    if (serviceSelect) {
      serviceSelect.value = state.workType;
    }

    if (notesInput) {
      const summaryText = `[Calculated Estimate: ${formatRupees(res.estMin)} - ${formatRupees(res.estMax)}]\n` +
                          `Project: ${res.workName} (~${res.size} ${res.unit})\n` +
                          `Material: ${res.matName}\n` +
                          `Fittings: ${res.hwName}\n` +
                          `Polish/Finish: ${res.finName}\n` +
                          `Estimated Timeline: ${res.days} days.\n` +
                          `Please schedule a free site measurement!`;
      notesInput.value = summaryText;
    }

    // Scroll smoothly to quote form
    const quoteFormSection = document.getElementById('quote-form-section');
    if (quoteFormSection) {
      quoteFormSection.scrollIntoView({ behavior: 'smooth' });
    }

    if (window.App && window.App.showToast) {
      window.App.showToast('✅ Estimate applied to Quote Form below!');
    }
  }

  return {
    init,
    calculate,
    setWorkType,
    getState: () => ({ ...state })
  };
})();

// Attach to window global scope
window.WoodCalculator = WoodCalculator;

// Auto-initialize if DOM is ready, or wait for DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => WoodCalculator.init());
} else {
  WoodCalculator.init();
}
