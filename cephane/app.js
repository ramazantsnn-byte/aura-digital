document.addEventListener('DOMContentLoaded', () => {

  const SEDAT_PHONE = '905303543465';

  // Mobile Drawer
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

  // Modal Controls
  const confirmModal = document.getElementById('confirmModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalWaLink = document.getElementById('modalWaLink');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  function openConfirmation(title, desc, waUrl) {
    if (!confirmModal) return;
    modalTitle.textContent = title;
    modalDesc.innerHTML = desc;
    modalWaLink.href = waUrl;
    confirmModal.classList.add('active');

    // Automatically trigger WhatsApp in a new tab after showing modal
    setTimeout(() => {
      window.open(waUrl, '_blank');
    }, 600);
  }

  if (modalCloseBtn && confirmModal) {
    modalCloseBtn.addEventListener('click', () => {
      confirmModal.classList.remove('active');
    });
    confirmModal.addEventListener('click', (e) => {
      if (e.target === confirmModal) confirmModal.classList.remove('active');
    });
  }

  // 1. DEĞERLEME / TELEFON SATIŞ FORMU
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

      const msg = 
`📱 *CEPHANE İLETİŞİM - CİHAZ NAKİT SATIŞ TALEBİ* 📱
----------------------------------------
👤 *Müşteri:* ${name}
📞 *Telefon:* ${phone}

📱 *Cihaz:* ${brand} - ${model} (${storage})
🔋 *Pil Sağlığı:* ${battery}
🖥️ *Ekran Durumu:* ${screen}
🛡️ *Kasa Durumu:* ${body}
📦 *Kutu & Fatura:* ${boxInvoice}
----------------------------------------
_CepHane İletişim'den 15-20 dakika içinde nakit teklif bekleniyor._`;

      const waUrl = `https://wa.me/${SEDAT_PHONE}?text=${encodeURIComponent(msg)}`;

      openConfirmation(
        'Talebiniz Sedat Bey\'e İletildi! 🎉',
        `Sayın <strong>${name}</strong>, cihaz bilgileriniz eksiksiz ekspertiz raporu olarak hazırlandı.<br><br>
        <strong>15-20 dakika içerisinde</strong> CepHane ekibi tarafından WhatsApp üzerinden size en yüksek nakit teklifimiz iletilecektir.`,
        waUrl
      );
    });
  }

  // 2. TEKNİK SERVİS & RANDEVU FORMU
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
👤 *Müşteri:* ${name}
📞 *Telefon:* ${phone}

📱 *Cihaz Modeli:* ${model}
🔧 *İşlem / Arıza:* ${issue}
📅 *Randevu Günü:* ${day}
⏰ *Saat Aralığı:* ${time}
⏱️ *Tahmini Süre:* ~30 Dakika (Gözünüzün Önünde)
----------------------------------------
_CepHane ekibinden 15 dakika içinde randevu teyidi bekleniyor._`;

      const waUrl = `https://wa.me/${SEDAT_PHONE}?text=${encodeURIComponent(msg)}`;

      openConfirmation(
        'Randevunuz Oluşturuldu! 🛠️',
        `Sayın <strong>${name}</strong>, <strong>${model}</strong> cihazınız için randevu talebiniz alındı.<br><br>
        <strong>15 dakika içerisinde</strong> CepHane ekibi WhatsApp üzerinden randevu saatinizi teyit edecektir. Cihazınız ortalama <strong>30 dakikada</strong> teslim edilir.`,
        waUrl
      );
    });
  }

});
