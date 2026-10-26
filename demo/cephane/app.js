// CepHane İletişim - Esenyurt Resmi İşlem & WhatsApp Motoru
// Yetkili Usta: Sedat | WhatsApp & Tel: 0530 354 34 65
const SEDAT_PHONE = '905303543465';

document.addEventListener('DOMContentLoaded', () => {

  // -----------------------------------------------------------
  // MOBİL DRAWER MENÜ
  // -----------------------------------------------------------
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

  // -----------------------------------------------------------
  // TEYİT VE ONAY MODALI (WHATSAPP DİREKT AÇICI)
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
  // 1. ANINDA DEĞERLEME & NAKİT FİYAT ALMA FORMU (TEK KARTLI)
  // -----------------------------------------------------------
  const valuationForm = document.getElementById('valuationForm');
  const valBrand = document.getElementById('valBrand');
  const valModel = document.getElementById('valModel');
  const valStorage = document.getElementById('valStorage');
  const valBattery = document.getElementById('valBattery');
  const valScreen = document.getElementById('valScreen');
  const valBody = document.getElementById('valBody');
  const valBoxInvoice = document.getElementById('valBoxInvoice');
  const valLivePrice = document.getElementById('valLivePrice');

  function computeLivePrice() {
    if (!valModel || !valLivePrice) return;
    const modelName = valModel.value.toLowerCase().trim();
    let base = 25500; // Varsayılan iPhone 13

    if (modelName.includes('16 pro max')) base = 76000;
    else if (modelName.includes('16 pro')) base = 69000;
    else if (modelName.includes('16 plus')) base = 53000;
    else if (modelName.includes('16')) base = 49000;
    else if (modelName.includes('15 pro max')) base = 61000;
    else if (modelName.includes('15 pro')) base = 53000;
    else if (modelName.includes('15 plus')) base = 42000;
    else if (modelName.includes('15')) base = 39500;
    else if (modelName.includes('14 pro max')) base = 47000;
    else if (modelName.includes('14 pro')) base = 42000;
    else if (modelName.includes('14 plus')) base = 33500;
    else if (modelName.includes('14')) base = 31500;
    else if (modelName.includes('13 pro max')) base = 36500;
    else if (modelName.includes('13 pro')) base = 32000;
    else if (modelName.includes('13')) base = 25500;
    else if (modelName.includes('12 pro max')) base = 27500;
    else if (modelName.includes('12 pro')) base = 23500;
    else if (modelName.includes('12')) base = 18500;
    else if (modelName.includes('11 pro max')) base = 18500;
    else if (modelName.includes('11 pro')) base = 15500;
    else if (modelName.includes('11')) base = 13000;
    else if (modelName.includes('s24 ultra')) base = 53000;
    else if (modelName.includes('s23 ultra')) base = 39000;
    else if (modelName.includes('s22')) base = 19000;

    let mult = 1.0;
    if (valStorage) {
      if (valStorage.value === '64 GB') mult *= 0.92;
      else if (valStorage.value === '256 GB') mult *= 1.08;
      else if (valStorage.value === '512 GB') mult *= 1.16;
      else if (valStorage.value === '1 TB') mult *= 1.25;
    }

    if (valScreen) {
      if (valScreen.value.includes('Kılcal')) mult *= 0.94;
      else if (valScreen.value.includes('Kırık')) mult *= 0.72;
      else if (valScreen.value.includes('Değişmiş')) mult *= 0.82;
    }

    if (valBattery) {
      if (valBattery.value.includes('Servis')) mult *= 0.86;
    }

    if (valBody) {
      if (valBody.value.includes('Ezik')) mult *= 0.92;
      else if (valBody.value.includes('Arka Cam')) mult *= 0.82;
    }

    const low = Math.round((base * mult * 0.95) / 250) * 250;
    const high = Math.round((base * mult * 1.06) / 250) * 250;
    valLivePrice.textContent = `${low.toLocaleString('tr-TR')} ₺ - ${high.toLocaleString('tr-TR')} ₺`;
    return `${low.toLocaleString('tr-TR')} ₺ - ${high.toLocaleString('tr-TR')} ₺`;
  }

  // Değişiklikleri dinle ve canlı fiyatı hesapla
  [valBrand, valModel, valStorage, valBattery, valScreen, valBody, valBoxInvoice].forEach(el => {
    if (el) {
      el.addEventListener('input', computeLivePrice);
      el.addEventListener('change', computeLivePrice);
    }
  });

  // Başlangıçta fiyatı hesapla
  computeLivePrice();

  if (valuationForm) {
    valuationForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const brand = valBrand ? valBrand.value : 'Apple';
      const model = valModel ? valModel.value.trim() : 'iPhone 13';
      const storage = valStorage ? valStorage.value : '128 GB';
      const battery = valBattery ? valBattery.value : '%90 - %100';
      const screen = valScreen ? valScreen.value : 'Orijinal & Çiziksiz';
      const body = valBody ? valBody.value : 'Sıfır Ayarında';
      const box = valBoxInvoice ? valBoxInvoice.value : 'Kutulu ve Faturalı';
      const name = document.getElementById('valCustomerName').value.trim();
      const phone = document.getElementById('valCustomerPhone').value.trim();
      const estimatedPrice = computeLivePrice();

      const msg = 
`📱 *CEPHANE İLETİŞİM - CİHAZ NAKİT SATIŞ VE FİYAT TALEBİ* 📱
----------------------------------------
👤 *Müşteri Adı:* ${name}
📞 *Telefon:* ${phone}

📱 *Cihaz Modeli:* ${brand} - ${model}
💾 *Hafıza Kapasitesi:* ${storage}
🔋 *Pil Sağlığı:* ${battery}
🖥️ *Ekran Durumu:* ${screen}
🛡️ *Kasa Kozmetiği:* ${body}
📦 *Kutu & Fatura:* ${box}

💰 *Sistem Tahmini Piyasa Değeri:* ${estimatedPrice}
📍 *İşlem Şubesi:* CepHane İletişim (Esenyurt / Sivas Kongre Cad.)
----------------------------------------
💬 _Sedat Bey selamlar, sitenizden cihazım için ekspertiz formu doldurdum. Cihazımı Esenyurt mağazanızda nakite çevirmek için net teklifinizi bekliyorum._`;

      const waUrl = `https://wa.me/${SEDAT_PHONE}?text=${encodeURIComponent(msg)}`;

      const summaryHtml = `
        <strong>Müşteri:</strong> ${name} (${phone})<br>
        <strong>Cihaz:</strong> ${brand} - ${model} (${storage})<br>
        <strong>Tahmini Değer:</strong> <span style="color:#00e5ff; font-weight:800;">${estimatedPrice}</span>
      `;

      openConfirmation(
        'Fiyat Teklifiniz Sedat Bey\'e İletildi! 🎉',
        summaryHtml,
        `Sayın <strong>${name}</strong>, cihaz bilgileriniz eksiksiz ekspertiz fişi olarak hazırlandı.<br><br>
        <strong>15-20 dakika içerisinde</strong> Sedat Bey WhatsApp üzerinden en yüksek nakit teklifini iletecektir.`,
        waUrl
      );
    });
  }

  // -----------------------------------------------------------
  // 2. İNTERAKTİF TAMİR KATALOĞU VE TEKNİK SERVİS FORMU
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

  // Teknik Servis Formu Submit
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

});
