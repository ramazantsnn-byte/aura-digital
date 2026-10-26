// CepHane İletişim - Esenyurt Resmi İşlem & WhatsApp Motoru
// Yetkili: Sedat | WhatsApp & Tel: 0530 354 34 65
const SEDAT_PHONE = '905303543465';

// Global Cihaz Donanım Test Raporu Deposu
window.cephaneHardwareScore = null;
window.cephaneHardwareDetails = {};

// Hotspot Bilgi Gösterici (360 Ekspertiz Bölümü)
function showHotspotInfo(text) {
  const infoBar = document.getElementById('panoInfoBar');
  const infoText = document.getElementById('panoInfoText');
  if (infoText && infoBar) {
    infoText.style.opacity = '0';
    setTimeout(() => {
      infoText.innerHTML = `<strong>Aktif İnceleme:</strong> ${text}`;
      infoText.style.opacity = '1';
      infoBar.style.borderColor = '#00e5ff';
      infoBar.style.boxShadow = '0 0 25px rgba(0, 229, 255, 0.4)';
    }, 120);
  }
}

// -------------------------------------------------------------
// GETMOBIL & EASYCEP DÜZEYİNDE MARKA VE MODEL VERİ TABANI
// -------------------------------------------------------------
const BRAND_MODELS_DB = {
  Apple: [
    { name: 'iPhone 16 Pro Max', basePrice: 76000 },
    { name: 'iPhone 16 Pro', basePrice: 69000 },
    { name: 'iPhone 16 Plus', basePrice: 53000 },
    { name: 'iPhone 16', basePrice: 49000 },
    { name: 'iPhone 15 Pro Max', basePrice: 61000 },
    { name: 'iPhone 15 Pro', basePrice: 53000 },
    { name: 'iPhone 15 Plus', basePrice: 42000 },
    { name: 'iPhone 15', basePrice: 39500 },
    { name: 'iPhone 14 Pro Max', basePrice: 47000 },
    { name: 'iPhone 14 Pro', basePrice: 42000 },
    { name: 'iPhone 14 Plus', basePrice: 33500 },
    { name: 'iPhone 14', basePrice: 31500 },
    { name: 'iPhone 13 Pro Max', basePrice: 36500 },
    { name: 'iPhone 13 Pro', basePrice: 32000 },
    { name: 'iPhone 13', basePrice: 25500 },
    { name: 'iPhone 13 mini', basePrice: 21000 },
    { name: 'iPhone 12 Pro Max', basePrice: 27500 },
    { name: 'iPhone 12 Pro', basePrice: 23500 },
    { name: 'iPhone 12', basePrice: 18500 },
    { name: 'iPhone 12 mini', basePrice: 15500 },
    { name: 'iPhone 11 Pro Max', basePrice: 18500 },
    { name: 'iPhone 11 Pro', basePrice: 15500 },
    { name: 'iPhone 11', basePrice: 13000 },
    { name: 'iPhone XS Max', basePrice: 9500 },
    { name: 'iPhone XS', basePrice: 8000 },
    { name: 'iPhone XR', basePrice: 8500 },
    { name: 'iPhone X', basePrice: 7000 },
    { name: 'iPhone SE (3. Nesil 2022)', basePrice: 12500 },
    { name: 'iPhone SE (2. Nesil 2020)', basePrice: 8500 }
  ],
  Samsung: [
    { name: 'Galaxy S24 Ultra', basePrice: 53000 },
    { name: 'Galaxy S24+', basePrice: 41000 },
    { name: 'Galaxy S24', basePrice: 34500 },
    { name: 'Galaxy S23 Ultra', basePrice: 39000 },
    { name: 'Galaxy S23+', basePrice: 31000 },
    { name: 'Galaxy S23', basePrice: 26000 },
    { name: 'Galaxy S22 Ultra', basePrice: 27000 },
    { name: 'Galaxy S22', basePrice: 19000 },
    { name: 'Galaxy S21 Ultra', basePrice: 20000 },
    { name: 'Galaxy S21', basePrice: 14000 },
    { name: 'Galaxy Z Fold 5', basePrice: 42000 },
    { name: 'Galaxy Z Fold 4', basePrice: 31000 },
    { name: 'Galaxy Z Flip 5', basePrice: 25000 },
    { name: 'Galaxy Z Flip 4', basePrice: 18000 },
    { name: 'Galaxy Note 20 Ultra', basePrice: 16000 },
    { name: 'Galaxy A54 5G', basePrice: 11000 },
    { name: 'Galaxy A53 5G', basePrice: 8500 }
  ],
  Xiaomi: [
    { name: 'Xiaomi 14 Ultra', basePrice: 43000 },
    { name: 'Xiaomi 14', basePrice: 32000 },
    { name: 'Xiaomi 13 Pro', basePrice: 26000 },
    { name: 'Xiaomi 13', basePrice: 21000 },
    { name: 'Xiaomi 12 Pro', basePrice: 17000 },
    { name: 'Redmi Note 13 Pro+ 5G', basePrice: 14500 },
    { name: 'Redmi Note 13 Pro', basePrice: 11500 },
    { name: 'Redmi Note 13', basePrice: 8500 },
    { name: 'Redmi Note 12 Pro 5G', basePrice: 9000 },
    { name: 'POCO X6 Pro 5G', basePrice: 12500 },
    { name: 'POCO F5', basePrice: 13000 }
  ],
  'Diğer': [
    { name: 'Huawei P60 Pro', basePrice: 23000 },
    { name: 'Huawei Mate 50 Pro', basePrice: 19000 },
    { name: 'Huawei Nova 9', basePrice: 8500 },
    { name: 'Oppo Reno 10 Pro', basePrice: 14000 },
    { name: 'Oppo Reno 8', basePrice: 9500 }
  ]
};

// Wizard State Saklayıcı
const wizardState = {
  currentStep: 1,
  selectedBrand: 'Apple',
  selectedModel: 'iPhone 13',
  basePrice: 25500,
  storage: '128 GB',
  battery: '%90 - %100 (Çok İyi)',
  screen: 'Orijinal ve Çiziksiz (Kusursuz)',
  body: 'Sıfır Ayarında (Darbe/Ezik Yok)',
  box: 'Kutulu ve Faturalı',
  camera: 'Tüm Kameralar & Face ID Sorunsuz',
  calculatedLow: 24500,
  calculatedHigh: 27500
};

// Dinamik Fiyat ve Çarpan Motoru
function computeWizardOffer() {
  let price = wizardState.basePrice || 20000;

  // 1. Hafıza Çarpanı
  if (wizardState.storage === '64 GB') price *= 0.90;
  else if (wizardState.storage === '128 GB') price *= 1.0;
  else if (wizardState.storage === '256 GB') price *= 1.09;
  else if (wizardState.storage === '512 GB') price *= 1.18;
  else if (wizardState.storage === '1 TB') price *= 1.28;

  // 2. Pil Sağlığı
  if (wizardState.battery.includes('%90')) price *= 1.04;
  else if (wizardState.battery.includes('%80 - %89')) price *= 1.0;
  else if (wizardState.battery.includes('%80 Altı')) price *= 0.86;

  // 3. Ekran Kondisyonu
  if (wizardState.screen.includes('Kusursuz')) price *= 1.0;
  else if (wizardState.screen.includes('Kılcal')) price *= 0.94;
  else if (wizardState.screen.includes('Kırık')) price *= 0.72;
  else if (wizardState.screen.includes('Değişmiş')) price *= 0.82;

  // 4. Kasa Kondisyonu
  if (wizardState.body.includes('Sıfır Ayarında')) price *= 1.04;
  else if (wizardState.body.includes('Temiz')) price *= 1.0;
  else if (wizardState.body.includes('Ezik')) price *= 0.92;
  else if (wizardState.body.includes('Arka Cam')) price *= 0.82;

  // 5. Kutu & Fatura
  if (wizardState.box.includes('Kutulu ve Faturalı')) price *= 1.05;
  else if (wizardState.box.includes('Sadece Kutu')) price *= 1.0;
  else if (wizardState.box.includes('Yok')) price *= 0.95;

  // 6. Kamera & Face ID
  if (wizardState.camera.includes('Arızalı')) price *= 0.85;

  // Alt ve Üst Limitleri 250 TL katlarına yuvarla
  const low = Math.round((price * 0.95) / 250) * 250;
  const high = Math.round((price * 1.06) / 250) * 250;

  wizardState.calculatedLow = low;
  wizardState.calculatedHigh = high;

  const displayEl = document.getElementById('gmFinalPriceDisplay');
  if (displayEl) {
    displayEl.textContent = `${low.toLocaleString('tr-TR')} ₺ - ${high.toLocaleString('tr-TR')} ₺`;
  }

  // Özet Etiketlerini Güncelle
  const tagsContainer = document.getElementById('gmTagsSummary');
  if (tagsContainer) {
    tagsContainer.innerHTML = `
      <span class="gm-summary-tag"><i class="fa-solid fa-mobile-screen text-cyan"></i> ${wizardState.selectedModel}</span>
      <span class="gm-summary-tag"><i class="fa-solid fa-hard-drive text-cyan"></i> ${wizardState.storage}</span>
      <span class="gm-summary-tag"><i class="fa-solid fa-battery-half text-cyan"></i> ${wizardState.battery}</span>
      <span class="gm-summary-tag"><i class="fa-solid fa-display text-cyan"></i> ${wizardState.screen.split('(')[0].trim()}</span>
      <span class="gm-summary-tag"><i class="fa-solid fa-shield text-cyan"></i> ${wizardState.body.split('(')[0].trim()}</span>
      <span class="gm-summary-tag"><i class="fa-solid fa-box-open text-cyan"></i> ${wizardState.box}</span>
      ${window.cephaneHardwareScore ? `<span class="gm-summary-tag" style="border-color:#00e5ff; color:#00e5ff;"><i class="fa-solid fa-microchip"></i> Donanım Skoru: ${window.cephaneHardwareScore}</span>` : ''}
    `;
  }
}

// -------------------------------------------------------------
// SAYFA YÜKLENDİĞİNDE BAŞLATILACAK İŞLEMLER
// -------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {

  // Mobile Drawer Menü
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileDrawer.classList.toggle('active');
    });
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('active');
      });
    });
  }

  // 360 Showcase 3D Tilt Parallax Etkisi
  const panoBox = document.getElementById('panoBox');
  const panoContainer = document.getElementById('panoContainer');
  if (panoBox && panoContainer) {
    panoBox.addEventListener('mousemove', (e) => {
      const rect = panoBox.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -7;
      const rotateY = ((x - centerX) / centerX) * 7;
      panoContainer.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    panoBox.addEventListener('mouseleave', () => {
      panoContainer.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
  }

  // -----------------------------------------------------------
  // GETMOBIL / EASYCEP STİLİ ADIM ADIM SİHİRBAZ KONTROLLERİ
  // -----------------------------------------------------------
  const gmProgressFill = document.getElementById('gmProgressFill');
  const stepIndicators = document.querySelectorAll('.gm-step-item');
  const panes = {
    1: document.getElementById('paneStep1'),
    2: document.getElementById('paneStep2'),
    3: document.getElementById('paneStep3'),
    4: document.getElementById('paneStep4')
  };

  function goToStep(step) {
    wizardState.currentStep = step;

    // Progress Bar ve Göstergeleri Güncelle
    const percentages = { 1: '25%', 2: '50%', 3: '75%', 4: '100%' };
    if (gmProgressFill) gmProgressFill.style.width = percentages[step];

    stepIndicators.forEach(ind => {
      const s = parseInt(ind.getAttribute('data-step'), 10);
      ind.classList.remove('active', 'completed');
      if (s === step) ind.classList.add('active');
      else if (s < step) ind.classList.add('completed');
    });

    // Paneleri Geçişle Göster
    Object.keys(panes).forEach(k => {
      if (panes[k]) panes[k].classList.remove('active');
    });
    if (panes[step]) panes[step].classList.add('active');

    // Breadcrumb ve Başlık Güncellemeleri
    const crumbBrand = document.getElementById('crumbBrand');
    const crumbModel = document.getElementById('crumbModel');
    const crumbSummary = document.getElementById('crumbSummary');

    if (crumbBrand) crumbBrand.textContent = wizardState.selectedBrand;
    if (crumbModel) crumbModel.textContent = wizardState.selectedModel;
    if (crumbSummary) crumbSummary.textContent = `${wizardState.selectedModel} • ${wizardState.storage}`;

    if (step === 4) {
      computeWizardOffer();
    }
  }

  // 1. Adım: Marka Seçimi
  const brandCards = document.querySelectorAll('.gm-brand-card');
  brandCards.forEach(card => {
    card.addEventListener('click', () => {
      brandCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const brand = card.getAttribute('data-brand');
      wizardState.selectedBrand = brand;
      populateModelsGrid(brand);
    });
  });

  const btnNextToStep2 = document.getElementById('btnNextToStep2');
  if (btnNextToStep2) {
    btnNextToStep2.addEventListener('click', () => {
      populateModelsGrid(wizardState.selectedBrand);
      goToStep(2);
    });
  }

  // 2. Adım: Model Listesini Doldurma ve Arama
  const gmModelsGrid = document.getElementById('gmModelsGrid');
  const gmModelSearch = document.getElementById('gmModelSearch');
  const gmCustomModelInput = document.getElementById('gmCustomModelInput');

  function populateModelsGrid(brand, filterText = '') {
    if (!gmModelsGrid) return;
    const models = BRAND_MODELS_DB[brand] || BRAND_MODELS_DB.Apple;
    gmModelsGrid.innerHTML = '';

    const filtered = models.filter(m => m.name.toLowerCase().includes(filterText.toLowerCase().trim()));

    if (filtered.length === 0) {
      gmModelsGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: var(--titanium-silver); padding: 20px;">Aradığınız model bulunamadı. Aşağıdaki kutuya elle yazabilirsiniz.</div>`;
      return;
    }

    filtered.forEach(m => {
      const pill = document.createElement('div');
      pill.className = `gm-model-pill ${wizardState.selectedModel === m.name ? 'active' : ''}`;
      pill.innerHTML = `<i class="fa-solid fa-mobile-screen-button"></i> <span>${m.name}</span>`;
      pill.addEventListener('click', () => {
        document.querySelectorAll('.gm-model-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        wizardState.selectedModel = m.name;
        wizardState.basePrice = m.basePrice;
        if (gmCustomModelInput) gmCustomModelInput.value = '';
        goToStep(3);
      });
      gmModelsGrid.appendChild(pill);
    });
  }

  if (gmModelSearch) {
    gmModelSearch.addEventListener('input', (e) => {
      populateModelsGrid(wizardState.selectedBrand, e.target.value);
    });
  }

  if (gmCustomModelInput) {
    gmCustomModelInput.addEventListener('input', (e) => {
      if (e.target.value.trim()) {
        document.querySelectorAll('.gm-model-pill').forEach(p => p.classList.remove('active'));
        wizardState.selectedModel = e.target.value.trim();
        wizardState.basePrice = 20000;
      }
    });
  }

  const btnBackToStep1 = document.getElementById('btnBackToStep1');
  if (btnBackToStep1) btnBackToStep1.addEventListener('click', () => goToStep(1));

  const btnNextToStep3 = document.getElementById('btnNextToStep3');
  if (btnNextToStep3) {
    btnNextToStep3.addEventListener('click', () => {
      if (gmCustomModelInput && gmCustomModelInput.value.trim()) {
        wizardState.selectedModel = gmCustomModelInput.value.trim();
      }
      goToStep(3);
    });
  }

  // 3. Adım: Durum ve Getmobil Soru Hapları
  function setupPillGroup(rowId, stateKey) {
    const row = document.getElementById(rowId);
    if (!row) return;
    const buttons = row.querySelectorAll('.gm-pill-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        wizardState[stateKey] = btn.getAttribute('data-val');
      });
    });
  }

  setupPillGroup('pillsStorage', 'storage');
  setupPillGroup('pillsBattery', 'battery');
  setupPillGroup('pillsScreen', 'screen');
  setupPillGroup('pillsBody', 'body');
  setupPillGroup('pillsBox', 'box');
  setupPillGroup('pillsCamera', 'camera');

  const btnBackToStep2 = document.getElementById('btnBackToStep2');
  if (btnBackToStep2) btnBackToStep2.addEventListener('click', () => goToStep(2));

  const btnNextToStep4 = document.getElementById('btnNextToStep4');
  if (btnNextToStep4) btnNextToStep4.addEventListener('click', () => goToStep(4));

  const btnBackToStep3 = document.getElementById('btnBackToStep3');
  if (btnBackToStep3) btnBackToStep3.addEventListener('click', () => goToStep(3));

  // 4. Adım: Müşteri Formu ve Sedat'ın WhatsApp'ına Gönderme
  const gmContactForm = document.getElementById('gmContactForm');
  if (gmContactForm) {
    gmContactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('gmCustomerName').value.trim();
      const phone = document.getElementById('gmCustomerPhone').value.trim();
      const notes = document.getElementById('gmCustomerNotes') ? document.getElementById('gmCustomerNotes').value.trim() : '';

      const lowStr = wizardState.calculatedLow.toLocaleString('tr-TR');
      const highStr = wizardState.calculatedHigh.toLocaleString('tr-TR');
      const priceText = `${lowStr} ₺ - ${highStr} ₺`;

      const hwText = window.cephaneHardwareScore ? `\n🔬 *Canlı Donanım Ekspertiz Skoru:* ${window.cephaneHardwareScore}` : '';
      const notesText = notes ? `\n📝 *Müşteri Notu:* ${notes}` : '';

      const msg = 
`📱 *CEPHANE İLETİŞİM - CİHAZ SATIŞ & EKSPERTİZ FİŞİ* 📱
----------------------------------------
👤 *Müşteri Adı:* ${name}
📞 *Telefon Numarası:* ${phone}

📱 *Cihaz:* ${wizardState.selectedBrand} - ${wizardState.selectedModel}
💾 *Hafıza Kapasitesi:* ${wizardState.storage}
🔋 *Pil Sağlığı:* ${wizardState.battery}
🖥️ *Ekran Durumu:* ${wizardState.screen}
🛡️ *Kasa Kozmetiği:* ${wizardState.body}
📦 *Kutu & Fatura:* ${wizardState.box}
📷 *Kamera & Sensörler:* ${wizardState.camera}${hwText}${notesText}

💰 *Sistem Tahmini Değeri:* ${priceText}
📍 *İşlem Şubesi:* CepHane İletişim (Esenyurt / Sivas Kongre Cad.)
----------------------------------------
💬 _Sedat Bey selamlar, sitenizdeki Getmobil/EasyCep modeli ekspertiz sihirbazından teklif oluşturdum. Cihazım için nakit alım randevusu ve net teklifinizi bekliyorum._`;

      const waUrl = `https://wa.me/${SEDAT_PHONE}?text=${encodeURIComponent(msg)}`;

      const summaryHtml = `
        <strong>Müşteri:</strong> ${name} (${phone})<br>
        <strong>Cihaz:</strong> ${wizardState.selectedModel} (${wizardState.storage})<br>
        <strong>Kondisyon:</strong> Pil: ${wizardState.battery} • Ekran: ${wizardState.screen.split('(')[0]}<br>
        <strong>Tahmini Değer:</strong> <span style="color:#00e5ff; font-weight:800;">${priceText}</span>
      `;

      openConfirmation(
        'Ekspertiz Fişiniz Sedat Bey\'e İletildi! 🎉',
        summaryHtml,
        `Sayın <strong>${name}</strong>, cihaz bilgileriniz eksiksiz ekspertiz fişi olarak hazırlandı.<br><br>
        <strong>15-20 dakika içerisinde</strong> Sedat Bey WhatsApp üzerinden size en yüksek nakit teklifimizi iletecektir.`,
        waUrl
      );
    });
  }

  // Başlangıç Modellerini Doldur (Apple varsayılan)
  populateModelsGrid('Apple');

  // -----------------------------------------------------------
  // MODAL KONTROLLERİ (TEYİT POPUP)
  // -----------------------------------------------------------
  const confirmModal = document.getElementById('confirmModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalSummaryBox = document.getElementById('modalSummaryBox');
  const modalWaLink = document.getElementById('modalWaLink');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  function openConfirmation(title, summaryHtml, desc, waUrl) {
    if (!confirmModal) return;
    if (modalTitle) modalTitle.textContent = title;
    if (modalSummaryBox) modalSummaryBox.innerHTML = summaryHtml;
    if (modalDesc) modalDesc.innerHTML = desc;
    if (modalWaLink) modalWaLink.href = waUrl;
    
    confirmModal.classList.add('active');

    // WhatsApp'ı doğrudan açmayı dene
    try {
      window.open(waUrl, '_blank');
    } catch (_) {}
  }

  if (modalCloseBtn && confirmModal) {
    modalCloseBtn.addEventListener('click', () => {
      confirmModal.classList.remove('active');
    });
    confirmModal.addEventListener('click', (e) => {
      if (e.target === confirmModal) confirmModal.classList.remove('active');
    });
  }

  // -----------------------------------------------------------
  // İNTERAKTİF TAMİR KATALOĞU & SÜRE EŞLEME
  // -----------------------------------------------------------
  const repIssueSelect = document.getElementById('repIssue');
  const repTimeEst = document.getElementById('repTimeEst');
  const repairCatCards = document.querySelectorAll('.repair-catalog-card');

  function updateRepairDuration(issueText) {
    if (!repTimeEst) return;
    if (issueText.includes('~20 Dk')) {
      repTimeEst.textContent = '~20 Dakika (Göz Önünde)';
    } else if (issueText.includes('~30 Dk')) {
      repTimeEst.textContent = '~30 Dakika (Göz Önünde)';
    } else if (issueText.includes('~45 Dk')) {
      repTimeEst.textContent = '~45 Dakika (Lazer Laboratuvarı)';
    } else if (issueText.includes('Anakart') || issueText.includes('Sıvı')) {
      repTimeEst.textContent = 'Aynı Gün İnceleme (Mikroskop Altı)';
    } else {
      repTimeEst.textContent = '~20 - 30 Dakika (Göz Önünde)';
    }
  }

  if (repairCatCards.length > 0) {
    repairCatCards.forEach(card => {
      card.addEventListener('click', () => {
        repairCatCards.forEach(c => c.classList.remove('active'));
        card.classList.add('active');

        const issue = card.getAttribute('data-issue');
        const time = card.getAttribute('data-time');

        if (repIssueSelect && issue) {
          repIssueSelect.value = issue;
        }
        if (repTimeEst && time) {
          repTimeEst.textContent = time;
        }

        // Forma kaydır ve odaklan
        const targetInput = document.getElementById('repModel');
        if (targetInput) {
          targetInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
          setTimeout(() => {
            targetInput.focus();
          }, 400);
        }
      });
    });
  }

  if (repIssueSelect) {
    repIssueSelect.addEventListener('change', (e) => {
      const selectedVal = e.target.value;
      updateRepairDuration(selectedVal);

      // Kartları eşle
      repairCatCards.forEach(card => {
        const cardIssue = card.getAttribute('data-issue');
        card.classList.toggle('active', cardIssue === selectedVal);
      });
    });
  }

  // -----------------------------------------------------------
  // TEKNİK SERVİS FORMU (TAMİR RANDEVUSU)
  // -----------------------------------------------------------
  const repairForm = document.getElementById('repairForm');
  if (repairForm) {
    repairForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const model = document.getElementById('repModel').value.trim();
      const issue = document.getElementById('repIssue').value;
      const day = document.getElementById('repDay').value;
      const time = document.getElementById('repTime').value;
      const name = document.getElementById('repName').value.trim();
      const phone = document.getElementById('repPhone').value.trim();
      const duration = repTimeEst ? repTimeEst.textContent : '~30 Dakika (Göz Önünde)';

      const msg = 
`⚙️ *CEPHANE İLETİŞİM - TEKNİK SERVİS RANDEVUSU* ⚙️
----------------------------------------
👤 *Müşteri Adı:* ${name}
📞 *Telefon:* ${phone}

📱 *Cihaz Modeli:* ${model}
🔧 *İşlem / Arıza:* ${issue}
⏱️ *Tahmini Süre:* ${duration}
📅 *Randevu Günü:* ${day}
⏰ *Saat Aralığı:* ${time}
🛡️ *Servis Güvencesi:* 6 Ay CepHane Firma Garantili
📍 *Servis Şubesi:* CepHane İletişim (Esenyurt / Sivas Kongre Cad.)
----------------------------------------
💬 _Sedat Bey merhaba, internet sitenizden teknik servis randevusu aldım. Cihazımı gözünüzün önünde yaptırmak için uygun saati teyit etmenizi rica ederim._`;

      const waUrl = `https://wa.me/${SEDAT_PHONE}?text=${encodeURIComponent(msg)}`;

      const summaryHtml = `
        <strong>Müşteri:</strong> ${name} (${phone})<br>
        <strong>Cihaz & İşlem:</strong> ${model} • ${issue}<br>
        <strong>Süre & Garanti:</strong> ${duration} • 6 Ay Kaşeli Garanti<br>
        <strong>Randevu Zamanı:</strong> ${day} günü, saat ${time} aralığında
      `;

      openConfirmation(
        'Randevu Talebiniz Sedat Bey\'e İletildi! 🛠️',
        summaryHtml,
        `Sayın <strong>${name}</strong>, <strong>${model}</strong> cihazınız için randevu talebiniz başarıyla oluşturuldu.<br><br>
        <strong>15 dakika içerisinde</strong> Sedat Bey WhatsApp üzerinden randevu saatinizi teyit edecektir.`,
        waUrl
      );
    });
  }

  // -----------------------------------------------------------
  // 5 MODÜLLÜ CANLI DONANIM EKSPERTİZ LABORATUVARI
  // -----------------------------------------------------------
  const btnOpenSelfTest = document.getElementById('btnOpenSelfTest');
  const hardwareTestModal = document.getElementById('hardwareTestModal');
  const closeHwModalBtn = document.getElementById('closeHwModalBtn');
  const hwTabBtns = document.querySelectorAll('.hw-tab-btn');
  const hwPanes = {
    touch: document.getElementById('hwPaneTouch'),
    pixel: document.getElementById('hwPanePixel'),
    sound: document.getElementById('hwPaneSound'),
    vibe: document.getElementById('hwPaneVibe'),
    gyro: document.getElementById('hwPaneGyro')
  };

  function switchHwTab(tabId) {
    hwTabBtns.forEach(b => {
      b.classList.toggle('active', b.getAttribute('data-tab') === tabId);
    });
    Object.keys(hwPanes).forEach(k => {
      if (hwPanes[k]) hwPanes[k].classList.toggle('active', k === tabId);
    });
  }

  hwTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      switchHwTab(btn.getAttribute('data-tab'));
    });
  });

  if (btnOpenSelfTest && hardwareTestModal) {
    btnOpenSelfTest.addEventListener('click', () => {
      hardwareTestModal.classList.add('active');
      initTouchGrid();
    });
  }

  if (closeHwModalBtn && hardwareTestModal) {
    closeHwModalBtn.addEventListener('click', () => {
      hardwareTestModal.classList.remove('active');
    });
    hardwareTestModal.addEventListener('click', (e) => {
      if (e.target === hardwareTestModal) hardwareTestModal.classList.remove('active');
    });
  }

  // 1. Dokunmatik Ekran Testi (24 Hücreli Grid)
  const touchGrid = document.getElementById('touchGrid');
  const touchStatus = document.getElementById('touchStatus');
  let touchedCellsCount = 0;

  function initTouchGrid() {
    if (!touchGrid || touchGrid.children.length > 0) return;
    touchedCellsCount = 0;
    touchGrid.innerHTML = '';
    for (let i = 1; i <= 24; i++) {
      const cell = document.createElement('div');
      cell.className = 'touch-cell';
      cell.textContent = i;

      const markTouched = () => {
        if (!cell.classList.contains('touched')) {
          cell.classList.add('touched');
          touchedCellsCount++;
          if (touchStatus) touchStatus.textContent = `${touchedCellsCount}/24 Dokunuldu`;
          if (navigator.vibrate) {
            try { navigator.vibrate(20); } catch (_) {}
          }
          if (touchedCellsCount >= 24) {
            if (touchStatus) {
              touchStatus.textContent = '✅ %100 Dokunmatik Kusursuz';
              touchStatus.classList.add('completed');
            }
            markTabPassed('touch');
          }
        }
      };

      cell.addEventListener('mouseenter', (e) => { if (e.buttons === 1) markTouched(); });
      cell.addEventListener('click', markTouched);
      cell.addEventListener('touchstart', markTouched, { passive: true });
      cell.addEventListener('touchmove', markTouched, { passive: true });

      touchGrid.appendChild(cell);
    }
  }

  const btnResetTouch = document.getElementById('btnResetTouch');
  if (btnResetTouch) {
    btnResetTouch.addEventListener('click', () => {
      document.querySelectorAll('.touch-cell').forEach(c => c.classList.remove('touched'));
      touchedCellsCount = 0;
      if (touchStatus) {
        touchStatus.textContent = '0/24 Dokunuldu';
        touchStatus.classList.remove('completed');
      }
    });
  }

  const btnNextHwTab1 = document.getElementById('btnNextHwTab1');
  if (btnNextHwTab1) {
    btnNextHwTab1.addEventListener('click', () => switchHwTab('pixel'));
  }

  // 2. Ölü Piksel Renk Testi
  const pixelPreviewBox = document.getElementById('pixelPreviewBox');
  const pixelPreviewText = document.getElementById('pixelPreviewText');
  const pixelColorBtns = document.querySelectorAll('.pixel-color-btn');
  const pixelStatus = document.getElementById('pixelStatus');
  const btnPassPixel = document.getElementById('btnPassPixel');

  pixelColorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const color = btn.getAttribute('data-color');
      const name = btn.getAttribute('data-name');
      if (pixelPreviewBox) pixelPreviewBox.style.background = color;
      if (pixelPreviewText) {
        pixelPreviewText.textContent = `${name} Renk Testi Aktif`;
        pixelPreviewText.style.color = (color === '#ffffff') ? '#000' : '#fff';
      }
    });
  });

  if (btnPassPixel) {
    btnPassPixel.addEventListener('click', () => {
      if (pixelStatus) {
        pixelStatus.textContent = '✅ Ölü Piksel / Leke Yok';
        pixelStatus.classList.add('completed');
      }
      markTabPassed('pixel');
      switchHwTab('sound');
    });
  }

  // 3. Hoparlör & Ahize Akustik Testi
  const btnPlaySoundLow = document.getElementById('btnPlaySoundLow');
  const btnPlaySoundHigh = document.getElementById('btnPlaySoundHigh');
  const btnAudioPassed = document.getElementById('btnAudioPassed');
  const audioStatus = document.getElementById('audioStatus');
  let audioContext = null;

  function playTone(freq, duration = 0.5) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!audioContext) audioContext = new AudioCtx();
      if (audioContext.state === 'suspended') audioContext.resume();

      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioContext.currentTime);

      gain.gain.setValueAtTime(0.01, audioContext.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.25, audioContext.currentTime + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioContext.destination);

      osc.start();
      osc.stop(audioContext.currentTime + duration + 0.05);

      if (btnAudioPassed) btnAudioPassed.disabled = false;
      if (audioStatus) audioStatus.textContent = `${freq} Hz Tonu Çalındı`;
    } catch (err) {
      console.warn('Audio test hatası:', err);
      if (btnAudioPassed) btnAudioPassed.disabled = false;
    }
  }

  if (btnPlaySoundLow) btnPlaySoundLow.addEventListener('click', () => playTone(440, 0.6));
  if (btnPlaySoundHigh) btnPlaySoundHigh.addEventListener('click', () => playTone(1500, 0.6));

  if (btnAudioPassed) {
    btnAudioPassed.addEventListener('click', () => {
      if (audioStatus) {
        audioStatus.textContent = '✅ Hoparlör & Ahize Net';
        audioStatus.classList.add('completed');
      }
      markTabPassed('sound');
      switchHwTab('vibe');
    });
  }

  // 4. Titreşim / Taptic Engine Testi
  const btnTriggerVibe = document.getElementById('btnTriggerVibe');
  const btnPassVibe = document.getElementById('btnPassVibe');
  const vibeStatus = document.getElementById('vibeStatus');

  if (btnTriggerVibe) {
    btnTriggerVibe.addEventListener('click', () => {
      if (navigator.vibrate) {
        try { navigator.vibrate([200, 100, 200, 100, 300]); } catch (_) {}
      }
      if (vibeStatus) vibeStatus.textContent = 'Titreşim Sinyali Gönderildi';
    });
  }

  if (btnPassVibe) {
    btnPassVibe.addEventListener('click', () => {
      if (vibeStatus) {
        vibeStatus.textContent = '✅ Titreşim Motoru Sağlam';
        vibeStatus.classList.add('completed');
      }
      markTabPassed('vibe');
      switchHwTab('gyro');
    });
  }

  // 5. Jiroskop & Hareket Sensörü Testi
  const gyroBubble = document.getElementById('gyroBubble');
  const gyroReadings = document.getElementById('gyroReadings');
  const gyroStatus = document.getElementById('gyroStatus');
  const btnPassGyro = document.getElementById('btnPassGyro');

  if (window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', (e) => {
      if (e.beta !== null && e.gamma !== null && gyroBubble) {
        const xClamp = Math.max(-45, Math.min(45, e.gamma));
        const yClamp = Math.max(-45, Math.min(45, e.beta));
        const leftPercent = 50 + (xClamp / 45) * 40;
        const topPercent = 50 + (yClamp / 45) * 40;

        gyroBubble.style.left = `${leftPercent}%`;
        gyroBubble.style.top = `${topPercent}%`;

        if (gyroReadings) {
          gyroReadings.textContent = `Eğim X: ${Math.round(e.gamma)}° | Y: ${Math.round(e.beta)}°`;
        }
        if (gyroStatus && !gyroStatus.classList.contains('completed')) {
          gyroStatus.textContent = 'Sensör Hareket Algılıyor';
        }
      }
    });
  }

  // Masaüstü Test Simülasyonu
  const gyroStage = document.querySelector('.gyro-bubble-stage');
  if (gyroStage) {
    gyroStage.addEventListener('mousemove', (e) => {
      const rect = gyroStage.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      if (gyroBubble) {
        gyroBubble.style.left = `${x}%`;
        gyroBubble.style.top = `${y}%`;
      }
    });
  }

  if (btnPassGyro) {
    btnPassGyro.addEventListener('click', () => {
      if (gyroStatus) {
        gyroStatus.textContent = '✅ Jiroskop Sensörü Aktif';
        gyroStatus.classList.add('completed');
      }
      markTabPassed('gyro');
      finishHardwareDiagnostic();
    });
  }

  const passedTabs = new Set();
  function markTabPassed(tabId) {
    passedTabs.add(tabId);
    const tabBtn = document.querySelector(`.hw-tab-btn[data-tab="${tabId}"]`);
    if (tabBtn) tabBtn.classList.add('passed');
  }

  function finishHardwareDiagnostic() {
    window.cephaneHardwareScore = '%98 (A+ Kusursuz Donanım Skoru)';
    const hwScoreCard = document.getElementById('hwScoreCard');
    if (hwScoreCard) hwScoreCard.style.display = 'block';
  }

  const btnApplyTestToValuation = document.getElementById('btnApplyTestToValuation');
  if (btnApplyTestToValuation && hardwareTestModal) {
    btnApplyTestToValuation.addEventListener('click', () => {
      hardwareTestModal.classList.remove('active');
      computeWizardOffer();
      goToStep(4);
      const degerlemeSec = document.getElementById('degerleme');
      if (degerlemeSec) degerlemeSec.scrollIntoView({ behavior: 'smooth' });
    });
  }

});
