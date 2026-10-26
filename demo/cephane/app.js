// CepHane İletişim - Esenyurt Resmi İşlem & WhatsApp Motoru
// Yetkili: Sedat | WhatsApp & Tel: 0530 354 34 65
const SEDAT_PHONE = '905303543465';

// Global Cihaz Donanım Test Skoru Saklayıcı
window.cephaneHardwareScore = null;

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
// DİNAMİK CİHAZ DEĞERLEME & PİYASA FİYAT MOTORU
// -------------------------------------------------------------
const BASELINE_PRICES = {
  // Apple iPhone Serisi
  'iphone 16 pro max': 76000,
  'iphone 16 pro': 69000,
  'iphone 16 plus': 53000,
  'iphone 16': 49000,
  'iphone 15 pro max': 61000,
  'iphone 15 pro': 53000,
  'iphone 15 plus': 42000,
  'iphone 15': 39500,
  'iphone 14 pro max': 47000,
  'iphone 14 pro': 42000,
  'iphone 14 plus': 33500,
  'iphone 14': 31500,
  'iphone 13 pro max': 36500,
  'iphone 13 pro': 32000,
  'iphone 13': 25500,
  'iphone 13 mini': 21000,
  'iphone 12 pro max': 27500,
  'iphone 12 pro': 23500,
  'iphone 12': 18500,
  'iphone 11 pro max': 18500,
  'iphone 11 pro': 15500,
  'iphone 11': 13000,
  'iphone xs max': 9500,
  'iphone xs': 8000,
  'iphone x': 7000,

  // Samsung Galaxy Serisi
  'samsung galaxy s24 ultra': 53000,
  'samsung galaxy s24+': 41000,
  'samsung galaxy s24': 34500,
  'samsung galaxy s23 ultra': 39000,
  'samsung galaxy s23': 26000,
  'samsung galaxy s22 ultra': 27000,
  'samsung galaxy s22': 19000,
  'samsung galaxy s21 ultra': 20000,
  'samsung galaxy s21': 14000,

  // Xiaomi & Redmi
  'xiaomi 14 ultra': 42000,
  'xiaomi 14': 32000,
  'xiaomi 13 pro': 26000,
  'xiaomi 13': 21000,
  'redmi note 13 pro': 11500,
  'redmi note 12 pro': 9000
};

function calculateEstimatedPrice() {
  const modelInput = document.getElementById('valModel');
  const storageEl = document.getElementById('valStorage');
  const batteryEl = document.getElementById('valBattery');
  const screenEl = document.getElementById('valScreen');
  const bodyEl = document.getElementById('valBody');
  const boxInvoiceEl = document.getElementById('valBoxInvoice');
  const priceDisplay = document.getElementById('liveValPrice');
  const descDisplay = document.getElementById('liveValDesc');

  if (!priceDisplay) return;

  const rawModel = (modelInput ? modelInput.value : '').toLowerCase().trim();
  if (!rawModel) {
    priceDisplay.textContent = 'Model Yazın veya Seçin';
    if (descDisplay) descDisplay.textContent = 'Cihaz modelinizi girdiğinizde tahmini nakit piyasa değeri anında hesaplanır.';
    return;
  }

  // Baseline Fiyatını Bul
  let basePrice = null;
  for (const [key, price] of Object.entries(BASELINE_PRICES)) {
    if (rawModel.includes(key)) {
      basePrice = price;
      break;
    }
  }

  // Model bulunamazsa akıllı fallback (tahmini ortalama)
  if (!basePrice) {
    if (rawModel.includes('iphone')) basePrice = 22000;
    else if (rawModel.includes('samsung') || rawModel.includes('ultra')) basePrice = 18000;
    else if (rawModel.includes('xiaomi') || rawModel.includes('redmi')) basePrice = 12000;
    else basePrice = 15000;
  }

  // 1. Hafıza Çarpanı
  let storageMult = 1.0;
  const storageVal = storageEl ? storageEl.value : '128 GB';
  if (storageVal.includes('64 GB')) storageMult = 0.90;
  else if (storageVal.includes('128 GB')) storageMult = 1.0;
  else if (storageVal.includes('256 GB')) storageMult = 1.08;
  else if (storageVal.includes('512 GB')) storageMult = 1.16;
  else if (storageVal.includes('1 TB')) storageMult = 1.25;

  // 2. Pil Seviyesi Çarpanı
  let batteryMult = 1.0;
  const batteryVal = batteryEl ? batteryEl.value : '';
  if (batteryVal.includes('%95')) batteryMult = 1.04;
  else if (batteryVal.includes('%85')) batteryMult = 1.0;
  else if (batteryVal.includes('%80 - %84')) batteryMult = 0.94;
  else if (batteryVal.includes('%80 Altı')) batteryMult = 0.86;

  // 3. Ekran Durumu Çarpanı
  let screenMult = 1.0;
  const screenVal = screenEl ? screenEl.value : '';
  if (screenVal.includes('Kusursuz')) screenMult = 1.0;
  else if (screenVal.includes('Kılcal')) screenMult = 0.95;
  else if (screenVal.includes('Kırık')) screenMult = 0.72;
  else if (screenVal.includes('Değişmiş')) screenMult = 0.82;

  // 4. Kasa Durumu Çarpanı
  let bodyMult = 1.0;
  const bodyVal = bodyEl ? bodyEl.value : '';
  if (bodyVal.includes('Sıfır Ayarında')) bodyMult = 1.03;
  else if (bodyVal.includes('Temiz')) bodyMult = 1.0;
  else if (bodyVal.includes('Ezik')) bodyMult = 0.93;
  else if (bodyVal.includes('Arka Cam Kırık')) bodyMult = 0.82;

  // 5. Kutu & Fatura Çarpanı
  let boxMult = 1.0;
  const boxVal = boxInvoiceEl ? boxInvoiceEl.value : '';
  if (boxVal.includes('Kutulu ve Faturalı')) boxMult = 1.04;
  else if (boxVal.includes('Sadece Kutu')) boxMult = 1.0;
  else if (boxVal.includes('Yok')) boxMult = 0.96;

  // Genel Fiyat Hesapla
  const finalEstimate = basePrice * storageMult * batteryMult * screenMult * bodyMult * boxMult;
  
  // Alt ve üst limitleri 250 TL katlarına yuvarla
  const low = Math.round((finalEstimate * 0.94) / 250) * 250;
  const high = Math.round((finalEstimate * 1.05) / 250) * 250;

  const fmtLow = low.toLocaleString('tr-TR');
  const fmtHigh = high.toLocaleString('tr-TR');

  priceDisplay.textContent = `${fmtLow} ₺ - ${fmtHigh} ₺`;
  if (descDisplay) {
    descDisplay.innerHTML = `Seçtiğiniz kriterlere göre cihazınızın tahmini nakit alım değeri: <strong>${fmtLow} ₺ - ${fmtHigh} ₺</strong>. Sedat Bey WhatsApp'tan 15 dakikada net teklifi iletir.`;
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

  // Dinamik Değerleme Fiyatını Dinle
  const modelInput = document.getElementById('valModel');
  const storageEl = document.getElementById('valStorage');
  const batteryEl = document.getElementById('valBattery');
  const screenEl = document.getElementById('valScreen');
  const bodyEl = document.getElementById('valBody');
  const boxInvoiceEl = document.getElementById('valBoxInvoice');

  [modelInput, storageEl, batteryEl, screenEl, bodyEl, boxInvoiceEl].forEach(el => {
    if (el) {
      el.addEventListener('input', calculateEstimatedPrice);
      el.addEventListener('change', calculateEstimatedPrice);
    }
  });

  // İlk açılışta iPhone 13 için hesaplama yap
  if (modelInput && !modelInput.value) {
    modelInput.value = 'iPhone 13';
    calculateEstimatedPrice();
  }

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

    // WhatsApp'ı doğrudan açmayı dene (Popup engelleyicilere karşı hem hemen aç hem buton bırak)
    try {
      const win = window.open(waUrl, '_blank');
      if (!win) {
        // Pop-up engellendiyse kullanıcı modal üzerindeki butondan gidebilir
        console.log('Pop-up engellendi, kullanıcı butona tıklayabilir.');
      }
    } catch (err) {
      console.warn('Otomatik sekme açılamadı:', err);
    }
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
  // 1. FORM: CİHAZ DEĞERLEME & NAKİT SATIŞ FORMU
  // -----------------------------------------------------------
  const valuationForm = document.getElementById('valuationForm');
  if (valuationForm) {
    valuationForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const brand = document.getElementById('valBrand').value;
      const model = document.getElementById('valModel').value.trim();
      const storage = document.getElementById('valStorage').value;
      const battery = document.getElementById('valBattery').value;
      const screen = document.getElementById('valScreen').value;
      const body = document.getElementById('valBody').value;
      const boxInvoice = document.getElementById('valBoxInvoice').value;
      const name = document.getElementById('valCustomerName').value.trim();
      const phone = document.getElementById('valCustomerPhone').value.trim();
      const notes = document.getElementById('valCustomerNotes') ? document.getElementById('valCustomerNotes').value.trim() : '';
      const estimatedPriceText = document.getElementById('liveValPrice') ? document.getElementById('liveValPrice').textContent : 'Belirtilmedi';

      const hwScoreText = window.cephaneHardwareScore ? `\n⚙️ *Donanım Ekspertiz Skoru:* ${window.cephaneHardwareScore}` : '';
      const notesText = notes ? `\n📝 *Müşteri Notu:* ${notes}` : '';

      const msg = 
`📱 *CEPHANE İLETİŞİM - CİHAZ EKSPERTİZ & NAKİT FİYAT TALEBİ* 📱
----------------------------------------
👤 *Müşteri Adı:* ${name}
📞 *Telefon Numarası:* ${phone}

📱 *Cihaz:* ${brand} - ${model}
💾 *Hafıza Kapasitesi:* ${storage}
🔋 *Pil Sağlığı:* ${battery}
🖥️ *Ekran Durumu:* ${screen}
🛡️ *Kasa Kondisyonu:* ${body}
📦 *Kutu & Fatura:* ${boxInvoice}${hwScoreText}${notesText}

💰 *Sistem Tahmini Değeri:* ${estimatedPriceText}
📍 *Şube:* CepHane İletişim (Esenyurt / Sivas Kongre Cad.)
----------------------------------------
💬 _Sedat Bey selamlar, internet sitenizdeki ekspertiz formunu doldurdum. Bu cihazım için nakit alım teklifinizi bekliyorum._`;

      const waUrl = `https://wa.me/${SEDAT_PHONE}?text=${encodeURIComponent(msg)}`;

      const summaryHtml = `
        <strong>Müşteri:</strong> ${name} (${phone})<br>
        <strong>Cihaz:</strong> ${brand} ${model} (${storage})<br>
        <strong>Kondisyon:</strong> Pil ${battery} • Ekran: ${screen}<br>
        <strong>Tahmini Değer:</strong> <span style="color:#00e5ff; font-weight:800;">${estimatedPriceText}</span>
      `;

      openConfirmation(
        'Ekspertiz Fişiniz Sedat Bey\'e İletildi! 🎉',
        summaryHtml,
        `Sayın <strong>${name}</strong>, cihaz bilgileriniz eksiksiz ekspertiz raporu olarak hazırlandı.<br><br>
        <strong>15-20 dakika içerisinde</strong> Sedat Bey WhatsApp üzerinden size en yüksek nakit teklifimizi iletecektir.`,
        waUrl
      );
    });
  }

  // -----------------------------------------------------------
  // 2. FORM: TEKNİK SERVİS & HIZLI RANDEVU FORMU
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

      const msg = 
`⚙️ *CEPHANE İLETİŞİM - TEKNİK SERVİS RANDEVUSU* ⚙️
----------------------------------------
👤 *Müşteri Adı:* ${name}
📞 *Telefon:* ${phone}

📱 *Cihaz Modeli:* ${model}
🔧 *İşlem / Arıza:* ${issue}
📅 *Randevu Günü:* ${day}
⏰ *Saat Aralığı:* ${time}
⏱️ *Tahmini Süre:* ~30 Dakika (Gözünüzün Önünde)
📍 *Servis:* CepHane İletişim (Esenyurt / Sivas Kongre Cad.)
----------------------------------------
💬 _Sedat Bey merhaba, internet sitenizden teknik servis randevusu aldım. Müsaitlik durumunu teyit etmenizi rica ederim._`;

      const waUrl = `https://wa.me/${SEDAT_PHONE}?text=${encodeURIComponent(msg)}`;

      const summaryHtml = `
        <strong>Müşteri:</strong> ${name} (${phone})<br>
        <strong>Cihaz & İşlem:</strong> ${model} • ${issue}<br>
        <strong>Randevu Zamanı:</strong> ${day} günü, saat ${time} aralığında
      `;

      openConfirmation(
        'Randevu Talebiniz Sedat Bey\'e İletildi! 🛠️',
        summaryHtml,
        `Sayın <strong>${name}</strong>, <strong>${model}</strong> cihazınız için randevu talebiniz alındı.<br><br>
        <strong>15 dakika içerisinde</strong> Sedat Bey WhatsApp üzerinden randevu saatinizi teyit edecektir. Cihazınız ortalama <strong>30 dakikada</strong> gözünüzün önünde teslim edilir.`,
        waUrl
      );
    });
  }

  // -----------------------------------------------------------
  // 3. CANLI DONANIM EKSPERTİZ TESTİ (EKRAN & SES TESTİ)
  // -----------------------------------------------------------
  const btnOpenSelfTest = document.getElementById('btnOpenSelfTest');
  const hardwareTestModal = document.getElementById('hardwareTestModal');
  const closeHwModalBtn = document.getElementById('closeHwModalBtn');
  const touchCells = document.querySelectorAll('.touch-cell');
  const touchStatus = document.getElementById('touchStatus');
  const btnPlaySound = document.getElementById('btnPlaySound');
  const btnAudioPassed = document.getElementById('btnAudioPassed');
  const audioStatus = document.getElementById('audioStatus');
  const hwScoreCard = document.getElementById('hwScoreCard');
  const btnApplyTestToValuation = document.getElementById('btnApplyTestToValuation');

  let touchedCount = 0;
  let audioVerified = false;

  if (btnOpenSelfTest && hardwareTestModal) {
    btnOpenSelfTest.addEventListener('click', () => {
      hardwareTestModal.classList.add('active');
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

  // Dokunmatik Hücre Testi
  touchCells.forEach(cell => {
    const handleTouch = () => {
      if (!cell.classList.contains('touched')) {
        cell.classList.add('touched');
        touchedCount++;
        if (touchStatus) touchStatus.textContent = `${touchedCount}/12 Dokunuldu`;

        // Titreşim (destekleyen mobil tarayıcılarda)
        if (navigator.vibrate) {
          try { navigator.vibrate(30); } catch (_) {}
        }

        if (touchedCount >= 12) {
          if (touchStatus) {
            touchStatus.textContent = '✅ %100 Dokunmatik Sağlam';
            touchStatus.classList.add('completed');
          }
          checkTestCompletion();
        }
      }
    };

    cell.addEventListener('click', handleTouch);
    cell.addEventListener('touchstart', handleTouch, { passive: true });
    cell.addEventListener('touchmove', handleTouch, { passive: true });
  });

  // Web Audio API ile 1000 Hz Saf Test Sesi Çalma
  let audioCtx = null;
  if (btnPlaySound) {
    btnPlaySound.addEventListener('click', () => {
      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (!AudioContextClass) return;

        if (!audioCtx) audioCtx = new AudioContextClass();
        if (audioCtx.state === 'suspended') audioCtx.resume();

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1000, audioCtx.currentTime); // 1 kHz saf kristal ses

        gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.3, audioCtx.currentTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + 0.65);

        if (btnAudioPassed) {
          btnAudioPassed.disabled = false;
          btnAudioPassed.style.opacity = '1';
        }
        if (audioStatus) audioStatus.textContent = 'Ses Çalındı - Lütfen Onaylayın';
      } catch (err) {
        console.warn('Audio test hatası:', err);
        if (btnAudioPassed) btnAudioPassed.disabled = false;
      }
    });
  }

  if (btnAudioPassed) {
    btnAudioPassed.addEventListener('click', () => {
      audioVerified = true;
      if (audioStatus) {
        audioStatus.textContent = '✅ Hoparlör & Ahize Kusursuz';
        audioStatus.classList.add('completed');
      }
      btnAudioPassed.disabled = true;
      checkTestCompletion();
    });
  }

  function checkTestCompletion() {
    if (touchedCount >= 12 && audioVerified) {
      window.cephaneHardwareScore = '%100 Kusursuz (Ekran Dokunmatik & Hoparlör Test Edildi)';
      if (hwScoreCard) hwScoreCard.style.display = 'block';

      // Canlı forma otomatik aktar
      const notesField = document.getElementById('valCustomerNotes');
      if (notesField && !notesField.value.includes('Donanım Testi')) {
        notesField.value = `${notesField.value ? notesField.value + ' | ' : ''}Ekran ve Hoparlör Testi Yapıldı (%100 Sağlam)`;
      }
    }
  }

  if (btnApplyTestToValuation && hardwareTestModal) {
    btnApplyTestToValuation.addEventListener('click', () => {
      hardwareTestModal.classList.remove('active');
      const degerlemeSection = document.getElementById('degerleme');
      if (degerlemeSection) {
        degerlemeSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

});
