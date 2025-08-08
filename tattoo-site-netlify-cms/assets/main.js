
// mobile nav
document.getElementById('menuBtn').addEventListener('click', () => {
  const m = document.getElementById('mobileNav');
  m.classList.toggle('hidden');
});

// reveal on scroll
const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('show'); });
}, { threshold: 0.2 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// load settings + portfolio
async function loadContent() {
  const [settingsRes, portfolioRes] = await Promise.all([
    fetch('./assets/content/settings.json', { cache: 'no-store' }),
    fetch('./assets/content/portfolio.json', { cache: 'no-store' }),
  ]);
  const settings = await settingsRes.json();
  const portfolio = await portfolioRes.json();

  // brand info
  document.getElementById('brandName').textContent = settings.name;
  document.getElementById('studioName').textContent = settings.name;
  document.getElementById('footerName').textContent = settings.name;
  document.getElementById('phoneTxt').textContent = settings.phone;
  document.getElementById('emailTxt').textContent = settings.email;
  document.getElementById('addressTxt').textContent = settings.address;
  document.getElementById('igLink').href = settings.instagram;
  document.getElementById('igBox').href = settings.instagram;
  document.getElementById('year').textContent = new Date().getFullYear();

  // portfolio grid
  const grid = document.getElementById('grid');
  grid.innerHTML = '';
  portfolio.items.forEach((img) => {
    const card = document.createElement('div');
    card.className = "group relative rounded-2xl overflow-hidden bg-zinc-800 reveal";
    card.innerHTML = `
      <img src="${img.src}" alt="${img.title}" class="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"/>
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div class="absolute bottom-2 left-2 right-2 flex items-center justify-between">
        <div>
          <p class="text-sm font-medium">${img.title}</p>
          <p class="text-xs text-zinc-300">${(img.tags||[]).join(" • ")}</p>
        </div>
        <div class="text-xs opacity-80">+</div>
      </div>`;
    grid.appendChild(card);
  });
}
loadContent();

// booking mailto
document.getElementById('bookForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(e.target);
  const name = data.get('name');
  const email = data.get('email');
  const phone = data.get('phone');
  const size = data.get('size');
  const placement = data.get('placement');
  const desc = data.get('description');
  fetch('./assets/content/settings.json', { cache: 'no-store' }).then(r=>r.json()).then(settings => {
    const subject = encodeURIComponent(`Tattoo Booking Request from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nSize: ${size}\nPlacement: ${placement}\n\nIdea:\n${desc}`);
    window.location.href = `mailto:${settings.email}?subject=${subject}&body=${body}`;
  });
});
