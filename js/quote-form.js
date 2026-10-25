/* ==========================================================================
   VARDHAN WOODCRAFT - QUOTE REQUEST & ESTIMATE GENERATOR
   Form submission, validation, WhatsApp handoff, voucher generation
   ========================================================================== */

const QuoteManager = (() => {
  const CARPENTER_WHATSAPP = '919876543210'; // Professional carpenter hotline number

  function init() {
    bindForm();
    bindPhotoUpload();
  }

  function bindPhotoUpload() {
    const fileInput = document.getElementById('quote-file-input');
    const previewContainer = document.getElementById('upload-preview-container');

    if (!fileInput || !previewContainer) return;

    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        if (!file.type.startsWith('image/')) {
          alert('Please upload an image file (PNG, JPG, WEBP).');
          return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
          previewContainer.innerHTML = `
            <div style="position: relative; width: 80px; height: 80px; border-radius: var(--radius-sm); overflow: hidden; border: 1px solid var(--border-subtle); margin-top: 8px;">
              <img src="${event.target.result}" style="width: 100%; height: 100%; object-fit: cover;" />
              <button type="button" id="btn-remove-photo" style="position: absolute; top: 2px; right: 2px; background: rgba(0,0,0,0.6); color: #fff; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px;">✕</button>
            </div>
          `;
          document.getElementById('btn-remove-photo').addEventListener('click', () => {
            fileInput.value = '';
            previewContainer.innerHTML = '';
          });
        };
        reader.readAsDataURL(file);
      }
    });
  }

  function bindForm() {
    const form = document.getElementById('carpenter-quote-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('quote-name').value.trim();
      const phone = document.getElementById('quote-phone').value.trim();
      const email = document.getElementById('quote-email').value.trim();
      const service = document.getElementById('quote-service-select').value;
      const location = document.getElementById('quote-location').value.trim();
      const timeline = document.getElementById('quote-timeline-select').value;
      const siteVisit = document.getElementById('quote-site-visit').checked;
      const notes = document.getElementById('quote-notes').value.trim();

      // Basic validation
      if (!name) {
        alert('Please enter your full name.');
        return;
      }
      if (!phone || phone.length < 10) {
        alert('Please enter a valid 10-digit contact mobile number.');
        return;
      }

      // Generate Reference Code
      const quoteId = 'VW-' + new Date().getFullYear() + '-' + Math.floor(1000 + Math.random() * 9000);
      
      // Get current calculator estimate if available
      let calcEstimate = 'Custom Calculation on Measurement';
      if (window.WoodCalculator) {
        const est = window.WoodCalculator.calculate();
        calcEstimate = `₹${est.estMin.toLocaleString('en-IN')} - ₹${est.estMax.toLocaleString('en-IN')}`;
      }

      const quoteData = {
        quoteId,
        name,
        phone,
        email: email || 'Not provided',
        serviceName: getServiceTitle(service),
        location: location || 'Client Location',
        timeline,
        siteVisit: siteVisit ? 'Yes, requested free on-site measurement' : 'No, digital consultation first',
        notes: notes || 'Standard bespoke craftsmanship request',
        calcEstimate,
        date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      };

      // Show Voucher Modal
      displayVoucherModal(quoteData);

      // Reset form
      form.reset();
      const previewContainer = document.getElementById('upload-preview-container');
      if (previewContainer) previewContainer.innerHTML = '';

      if (window.App && window.App.showToast) {
        window.App.showToast('🎉 Quote request generated successfully!');
      }
    });
  }

  function getServiceTitle(val) {
    const map = {
      kitchen: 'Modular Kitchen Fabrication',
      wardrobe: 'Custom Wardrobes & Closets',
      furniture: 'Solid Wood Dining & Living Furniture',
      door: 'Architectural Main Doors & Frames',
      panelling: 'Wall Panelling & Acoustic Ceilings',
      fullhome: 'Full Home Woodwork Interior'
    };
    return map[val] || 'Carpentry Woodwork Project';
  }

  function displayVoucherModal(data) {
    const modal = document.getElementById('voucher-modal');
    const content = document.getElementById('voucher-modal-content');
    if (!modal || !content) return;

    // Build WhatsApp Message Link
    const waText = encodeURIComponent(
      `*New Carpentry Estimate Request*\n` +
      `🔖 *Ref ID:* ${data.quoteId}\n` +
      `👤 *Name:* ${data.name}\n` +
      `📞 *Phone:* ${data.phone}\n` +
      `📍 *Location:* ${data.location}\n` +
      `🔨 *Work:* ${data.serviceName}\n` +
      `💰 *Est. Budget Range:* ${data.calcEstimate}\n` +
      `⏱️ *Timeline:* ${data.timeline}\n` +
      `📐 *Site Visit:* ${data.siteVisit}\n` +
      `📝 *Notes:* ${data.notes.slice(0, 150)}...\n\n` +
      `_Please confirm receipt and schedule my consultation!_`
    );

    const waUrl = `https://wa.me/${CARPENTER_WHATSAPP}?text=${waText}`;

    content.innerHTML = `
      <div class="voucher-icon-circle">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      </div>
      <h2 style="font-size: 1.5rem; margin-bottom: 6px; color: var(--text-primary);">Quote Request Confirmed!</h2>
      <p style="font-size: 0.95rem; color: var(--text-secondary); margin-bottom: 18px;">
        Thank you <strong>${data.name}</strong>. Our Master Carpenter has received your project specifications.
      </p>

      <div class="voucher-id-pill">
        ESTIMATE REF: ${data.quoteId}
      </div>

      <div class="voucher-receipt-box">
        <div class="receipt-row">
          <span>Client Name:</span>
          <strong>${data.name}</strong>
        </div>
        <div class="receipt-row">
          <span>Contact Number:</span>
          <strong>${data.phone}</strong>
        </div>
        <div class="receipt-row">
          <span>Project Scope:</span>
          <strong>${data.serviceName}</strong>
        </div>
        <div class="receipt-row">
          <span>Estimated Range:</span>
          <strong>${data.calcEstimate}</strong>
        </div>
        <div class="receipt-row">
          <span>Site Visit Status:</span>
          <span>${data.siteVisit}</span>
        </div>
        <div class="receipt-row">
          <span>Date Submitted:</span>
          <span>${data.date}</span>
        </div>
      </div>

      <div class="voucher-actions">
        <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
          Send to Carpenter on WhatsApp
        </a>
        <button class="btn btn-secondary" onclick="window.print()">
          🖨️ Print / Save PDF
        </button>
        <button class="btn btn-dark" onclick="QuoteManager.closeVoucher()">
          Done
        </button>
      </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeVoucher() {
    const modal = document.getElementById('voucher-modal');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  return {
    init,
    closeVoucher
  };
})();

// Attach to window global scope
window.QuoteManager = QuoteManager;

// Auto-initialize if DOM is ready, or wait for DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => QuoteManager.init());
} else {
  QuoteManager.init();
}
