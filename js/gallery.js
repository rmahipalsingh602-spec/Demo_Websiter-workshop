/* ==========================================================================
   VARDHAN WOODCRAFT - PROJECTS GALLERY & LIGHTBOX
   Filterable portfolio with project specifications modal
   ========================================================================== */

const ProjectGallery = (() => {
  const PROJECTS = [
    {
      id: 'proj-1',
      title: 'Minimalist Walnut & Quartz Modular Kitchen',
      category: 'kitchen',
      categoryLabel: 'Modular Kitchen',
      image: 'assets/images/kitchen-luxury.jpg',
      wood: 'American Walnut Veneer & 710 Marine Ply',
      location: 'Bandra West, Mumbai',
      duration: '14 Working Days',
      size: '120 Sq.Ft L-Shape',
      hardware: 'Blum Tandembox Hydraulic Soft-Close',
      finish: 'Polyurethane (PU) Matte Clear Coat',
      description: 'Custom fabricated ergonomic modular kitchen with seamless quartz countertop, integrated concealed under-cabinet warm LED lighting, and cutlery organizers. Built using 100% boiling water-proof ply with termite-proof treatment.',
      clientQuote: '“Vardhan’s team delivered on-time perfection. The soft-close finish and grain matching across cabinet doors is flawless!” — Rahul & Sneha M.'
    },
    {
      id: 'proj-2',
      title: 'Bespoke Master Walk-in Wardrobe with Smoked Glass',
      category: 'wardrobe',
      categoryLabel: 'Luxury Wardrobe',
      image: 'assets/images/wardrobe-luxury.jpg',
      wood: 'Rich Smoked Oak & Calibrated BWR Ply',
      location: 'Worli Sea Face, Mumbai',
      duration: '12 Working Days',
      size: '95 Sq.Ft Floor-to-Ceiling',
      hardware: 'Häfele Sliding Track & Italian Concealed Hinges',
      finish: 'Matte Melamine with Edge Banding',
      description: 'Luxury floor-to-ceiling walk-in closet with custom watch winders, tie pull-outs, concealed safe vault, and motion-activated vertical LED profile lighting with aluminum framed smoked glass shutters.',
      clientQuote: '“The attention to millimeter detail is like five-star hotel craftsmanship. Extraordinary storage optimization.” — Dr. Ananya S.'
    },
    {
      id: 'proj-3',
      title: 'Handcrafted Live-Edge Solid Teak Dining Suite',
      category: 'furniture',
      categoryLabel: 'Custom Furniture',
      image: 'assets/images/dining-table.jpg',
      wood: '100% Solid Seasoned CP Teak (Sagwan)',
      location: 'Juhu Villa, Mumbai',
      duration: '8 Working Days',
      size: '8-Seater (8ft x 3.5ft Table)',
      hardware: 'Traditional Mortise & Tenon Wood Joinery',
      finish: 'Natural Organic Hardwax Hand-Rubbed Oil',
      description: 'Hand-shaped from a single single-slab solid teak timber trunk. Features exposed butterfly dovetail joints and smooth live natural edge contours, paired with 8 ergonomic cushioned dining chairs.',
      clientQuote: '“An heirloom piece our family will cherish for generations. No nails visible, pure artisan woodworking.” — Vikram Oberoi'
    },
    {
      id: 'proj-4',
      title: 'Architectural Fluted Solid Teak Entry Door',
      category: 'doors',
      categoryLabel: 'Doors & Millwork',
      image: 'assets/images/door-craft.jpg',
      wood: 'Burmese Teak Hardwood (Grade A)',
      location: 'South Bombay Residence',
      duration: '7 Working Days',
      size: '8.5ft x 4.5ft Grand Pivot Door',
      hardware: 'Heavy Duty 250kg Pivot Hinge & Brushed Brass Pull',
      finish: 'Weatherproof UV-Resistant Polyurethane',
      description: 'Statement grand pivot entry door with precision CNC fluting and handcrafted vertical timber ribs. Complete with weather-stripping, smart biometric lock integration, and 48-inch bespoke solid brass handle.',
      clientQuote: '“Every visitor remarks on this door before stepping inside. It feels massive yet opens effortlessly with one finger.” — K. Singhania'
    },
    {
      id: 'proj-5',
      title: 'Master Woodcraft Workshop & Custom Joinery',
      category: 'furniture',
      categoryLabel: 'Custom Furniture',
      image: 'assets/images/hero-workshop.jpg',
      wood: 'Seasoned Sheesham & Reclaimed Teak',
      location: 'TimberCraft In-House Atelier',
      duration: 'Bespoke Order',
      size: 'Custom Dimensions',
      hardware: 'Solid Brass Dowels & Japanese Chisel Joinery',
      finish: 'French Spirit Hand Polish',
      description: 'Behind the scenes at our dedicated carpentry atelier where every timber plank is moisture-tested (below 12%), kiln-dried, hand-planed, and precision-joined using timeless woodworking techniques.',
      clientQuote: '“Witnessing our dining table being crafted in their workshop was an unforgettable experience.” — Design Collective'
    },
    {
      id: 'proj-6',
      title: 'Vertical Fluted Oak Wall Panelling & Media Unit',
      category: 'panelling',
      categoryLabel: 'Wall Panelling',
      image: 'assets/images/kitchen-luxury.jpg',
      wood: 'Natural White Oak Veneer & Acoustic MDF Backing',
      location: 'Powai High-rise, Mumbai',
      duration: '6 Working Days',
      size: '14ft x 10ft Feature Wall',
      hardware: 'Concealed Heavy-Load French Cleats',
      finish: 'Zero-VOC Matte Wood Polish',
      description: 'Acoustic-damped living room accent wall with geometric fluted vertical slats, floating TV console with wire concealment channels, and soft 3000K warm ambient mood lighting.',
      clientQuote: '“Turned our living room into a high-end designer lounge. Zero exposed wires and the wood aroma is wonderful.” — Tanmay & Priya R.'
    }
  ];

  let currentCategory = 'all';

  function init() {
    renderProjects();
    bindFilterButtons();
    bindModal();
  }

  function bindFilterButtons() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.getAttribute('data-filter') || 'all';
        renderProjects();
      });
    });
  }

  function renderProjects() {
    const galleryGrid = document.getElementById('gallery-grid');
    if (!galleryGrid) return;

    const filtered = currentCategory === 'all' 
      ? PROJECTS 
      : PROJECTS.filter(p => p.category === currentCategory);

    galleryGrid.innerHTML = filtered.map(proj => `
      <article class="project-card" data-project-id="${proj.id}">
        <div class="project-image-box">
          <img src="${proj.image}" alt="${proj.title}" loading="lazy" />
          <span class="project-category-tag">${proj.categoryLabel}</span>
          <div class="project-spec-pills">
            <span class="spec-pill">📍 ${proj.location.split(',')[0]}</span>
            <span class="spec-pill">⏱️ ${proj.duration}</span>
          </div>
        </div>
        <div class="project-body">
          <h3 class="project-title">${proj.title}</h3>
          <div class="project-location-meta">
            <span>🌲 ${proj.wood.split('&')[0]}</span>
          </div>
          <p class="project-desc">${proj.description.slice(0, 115)}...</p>
          <div class="project-card-footer">
            <span class="wood-tag">✨ ${proj.size}</span>
            <button class="btn-view-project" onclick="ProjectGallery.openModal('${proj.id}')">
              View Specs 
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>
      </article>
    `).join('');
  }

  function openModal(projectId) {
    const proj = PROJECTS.find(p => p.id === projectId);
    if (!proj) return;

    const modalOverlay = document.getElementById('project-modal');
    const modalContent = document.getElementById('project-modal-body');
    if (!modalOverlay || !modalContent) return;

    modalContent.innerHTML = `
      <div style="position: relative; aspect-ratio: 16/9; max-height: 420px; overflow: hidden; border-radius: var(--radius-lg) var(--radius-lg) 0 0;">
        <img src="${proj.image}" alt="${proj.title}" style="width: 100%; height: 100%; object-fit: cover;" />
        <span class="project-category-tag" style="top: 20px; left: 20px;">${proj.categoryLabel}</span>
      </div>
      <div style="padding: 32px;">
        <h2 style="font-size: 1.6rem; margin-bottom: 8px; color: var(--text-primary);">${proj.title}</h2>
        <p style="color: var(--text-muted); font-size: 0.95rem; margin-bottom: 24px;">📍 ${proj.location} • Completed in ${proj.duration}</p>
        
        <p style="font-size: 1.05rem; line-height: 1.7; color: var(--text-secondary); margin-bottom: 28px;">
          ${proj.description}
        </p>

        <h4 style="font-size: 1rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-amber-500); margin-bottom: 14px;">Technical Specifications</h4>
        <div style="background: var(--bg-secondary); border-radius: var(--radius-md); padding: 18px; margin-bottom: 24px; border: 1px solid var(--border-subtle); display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
          <div><strong style="color: var(--text-primary); font-size: 0.85rem;">Wood Species:</strong><p style="color: var(--text-secondary); font-size: 0.9rem;">${proj.wood}</p></div>
          <div><strong style="color: var(--text-primary); font-size: 0.85rem;">Hardware & Fittings:</strong><p style="color: var(--text-secondary); font-size: 0.9rem;">${proj.hardware}</p></div>
          <div><strong style="color: var(--text-primary); font-size: 0.85rem;">Polish & Coating:</strong><p style="color: var(--text-secondary); font-size: 0.9rem;">${proj.finish}</p></div>
          <div><strong style="color: var(--text-primary); font-size: 0.85rem;">Dimensions / Scale:</strong><p style="color: var(--text-secondary); font-size: 0.9rem;">${proj.size}</p></div>
        </div>

        <blockquote style="border-left: 3px solid var(--color-amber-400); padding-left: 16px; margin-bottom: 28px; font-style: italic; color: var(--text-secondary);">
          ${proj.clientQuote}
        </blockquote>

        <div style="display: flex; gap: 14px; flex-wrap: wrap;">
          <button class="btn btn-primary" onclick="ProjectGallery.requestSimilar('${proj.category}', '${proj.title}')">
            🔨 Request Similar Project Quote
          </button>
          <button class="btn btn-secondary" onclick="ProjectGallery.closeModal()">
            Close
          </button>
        </div>
      </div>
    `;

    modalOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    const modalOverlay = document.getElementById('project-modal');
    if (modalOverlay) {
      modalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  function bindModal() {
    const modalOverlay = document.getElementById('project-modal');
    if (modalOverlay) {
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
      });
    }

    const closeBtn = document.getElementById('close-project-modal');
    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  }

  function requestSimilar(category, projectTitle) {
    closeModal();
    if (window.WoodCalculator) {
      window.WoodCalculator.setWorkType(category);
    }
    const notes = document.getElementById('quote-notes');
    if (notes) {
      notes.value = `I am interested in getting work done similar to your featured project: "${projectTitle}". Please contact me with details and measurement schedule.`;
    }
    const quoteSec = document.getElementById('quote-form-section');
    if (quoteSec) {
      quoteSec.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return {
    init,
    openModal,
    closeModal,
    requestSimilar,
    getProjects: () => [...PROJECTS]
  };
})();

// Attach to window global scope
window.ProjectGallery = ProjectGallery;

// Auto-initialize if DOM is ready, or wait for DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => ProjectGallery.init());
} else {
  ProjectGallery.init();
}
