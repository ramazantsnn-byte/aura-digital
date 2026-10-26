// CepHane İletişim - Ana Etkileşim ve Form Motoru
const SEDAT_PHONE = '905303543465';

// Global Hotspot Gösterici
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
    }, 150);
  }
}

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

  // Modal Kontrolleri (15-20 Dk Geri Dönüş Teyidi)
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

    // Otomatik WhatsApp yeni sekmede açılır
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

  // 1. DEĞERLEME / TELEFON NAKİT SATIŞ FORMU
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
_CepHane İletişim uzman ekibinden 15-20 dakika içinde nakit teklif bekleniyor._`;

      const waUrl = `https://wa.me/${SEDAT_PHONE}?text=${encodeURIComponent(msg)}`;

      openConfirmation(
        'Talebiniz CepHane İletişim Ekibine İletildi! 🎉',
        `Sayın <strong>${name}</strong>, cihaz bilgileriniz eksiksiz ekspertiz raporu olarak hazırlandı.<br><br>
        <strong>15-20 dakika içerisinde</strong> CepHane uzman ekibi tarafından WhatsApp üzerinden size en yüksek nakit teklifimiz iletilecektir.`,
        waUrl
      );
    });
  }

  // 2. TEKNİK SERVİS & HIZLI RANDEVU FORMU
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
_CepHane İletişim teknik servis ekibinden 15 dakika içinde randevu teyidi bekleniyor._`;

      const waUrl = `https://wa.me/${SEDAT_PHONE}?text=${encodeURIComponent(msg)}`;

      openConfirmation(
        'Randevunuz Oluşturuldu! 🛠️',
        `Sayın <strong>${name}</strong>, <strong>${model}</strong> cihazınız için randevu talebiniz alındı.<br><br>
        <strong>15 dakika içerisinde</strong> CepHane İletişim teknik ekibi WhatsApp üzerinden randevu saatinizi teyit edecektir. Cihazınız ortalama <strong>30 dakikada</strong> gözünüzün önünde teslim edilir.`,
        waUrl
      );
    });
  }

});
