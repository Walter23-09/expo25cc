// ------------------- LISTA DE PONTOS TURÍSTICOS -------------------
const places = [
  {
    id: 'praia-futuro',
    title: 'Praia do Futuro',
    lat: -3.7465, lng: -38.4664,
    img: 'img/praia-futuro.jpg',
    story: 'Praia extensa e famosa por suas barracas e vida noturna.'
  },
  {
    id: 'dragao',
    title: 'Centro Dragão do Mar',
    lat: -3.7225, lng: -38.5255,
    img: 'img/dragao.jpg',
    story: 'Complexo cultural com museus, cinema, teatro e planetário.'
  },
  {
    id: 'theatro',
    title: 'Theatro José de Alencar',
    lat: -3.7304, lng: -38.5265,
    img: 'img/theatro.jpg',
    story: 'Inaugurado em 1910, patrimônio histórico do Ceará.'
  },
  {
    id: 'mercado',
    title: 'Mercado Central',
    lat: -3.7301, lng: -38.5306,
    img: 'img/mercado.jpg',
    story: 'Mercado tradicional com artesanato e comidas típicas.'
  },
  {
    id: 'catedral',
    title: 'Catedral Metropolitana',
    lat: -3.7307, lng: -38.5321,
    img: 'img/catedral.jpg',
    story: 'Catedral em estilo neogótico, iniciada em 1938.'
  },
  {
    id: 'forte',
    title: 'Forte de Nossa Senhora da Assunção',
    lat: -3.7172, lng: -38.5427,
    img: 'img/forte.jpg',
    story: 'Construído em 1649, deu origem à cidade de Fortaleza.'
  },
  {
    id: 'beira-mar',
    title: 'Avenida Beira-Mar',
    lat: -3.7260, lng: -38.4956,
    img: 'img/beira-mar.jpg',
    story: 'Orla turística com feirinha, restaurantes e vista para o mar.'
  },
  {
    id: 'mucuripe',
    title: 'Porto das Jangadas - Mucuripe',
    lat: -3.7302, lng: -38.4811,
    img: 'img/mucuripe.jpg',
    story: 'Tradicional ponto das jangadas e pescadores.'
  },
  {
    id: 'praia-iracema',
    title: 'Praia de Iracema',
    lat: -3.7184, lng: -38.5426,
    img: 'img/praia-iracema.jpg',
    story: 'Praia boêmia com bares, música e a Ponte dos Ingleses.'
  },
  {
    id: 'museu-ceara',
    title: 'Museu do Ceará',
    lat: -3.7306, lng: -38.5261,
    img: 'img/museu.jpg',
    story: 'Museu histórico e antropológico do Ceará.'
  },
  {
    id: 'jardim',
    title: 'Jardim Japonês',
    lat: -3.7222, lng: -38.4897,
    img: 'img/jardim.jpg',
    story: 'Espaço paisagístico e cultural na orla de Fortaleza.'
  }
];

// ------------------- MAPA -------------------
const map = L.map('map').setView([-3.7305, -38.5218], 13);

// Camada de mapa base
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// ------------------- MARCADORES + SIDEBAR -------------------
const markers = {};
const listContainer = document.getElementById("nearbyList");

places.forEach(p => {
  // Criar marcador
  const marker = L.marker([p.lat, p.lng]).addTo(map);
  marker.bindPopup(`
    <div style="max-width:220px">
      <strong>${p.title}</strong>
      <div>
        <img src="${p.img}" style="width:100%;height:120px;object-fit:cover;border-radius:8px;margin:6px 0">
      </div>
      <p>${p.story}</p>
    </div>
  `);
  markers[p.id] = marker;

  // Adicionar item à sidebar
  const item = document.createElement("div");
  item.className = "nearby-item";
  item.innerHTML = `
    <img src="${p.img}" alt="${p.title}">
    <div>
      <strong>${p.title}</strong>
      <p class="meta">${p.story}</p>
    </div>
  `;
  item.addEventListener("click", () => {
    map.setView([p.lat, p.lng], 16);
    marker.openPopup();
  });
  listContainer.appendChild(item);
});

// ------------------- LOCALIZAÇÃO EM TEMPO REAL -------------------
let userMarker;
let accuracyCircle;
let firstUpdate = true;

if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (pos) => {
      const { latitude, longitude, accuracy } = pos.coords;
      const userLatLng = [latitude, longitude];

      if (!userMarker) {
        userMarker = L.marker(userLatLng, {
          icon: L.icon({
            iconUrl: "https://cdn-icons-png.flaticon.com/512/64/64113.png",
            iconSize: [32, 32]
          })
        }).addTo(map).bindPopup("📍 Você está aqui!");

        accuracyCircle = L.circle(userLatLng, { radius: accuracy }).addTo(map);
      } else {
        userMarker.setLatLng(userLatLng);
        accuracyCircle.setLatLng(userLatLng).setRadius(accuracy);
      }

      // Atualiza info na tela
      document.getElementById("positionInfo").innerText =
        `Lat: ${latitude.toFixed(5)} | Lng: ${longitude.toFixed(5)} (±${Math.round(accuracy)}m)`;

      // Centraliza apenas no primeiro update
      if (firstUpdate) {
        map.setView(userLatLng, 15);
        firstUpdate = false;
      }
    },
    (err) => {
      console.error("Erro ao obter localização:", err);
      document.getElementById("positionInfo").innerText = "Não foi possível acessar sua localização.";
    },
    { enableHighAccuracy: true }
  );
} else {
  alert("Geolocalização não suportada no seu navegador.");
}

// ------------------- BOTÃO CENTRALIZAR -------------------
document.getElementById("btnCenter").addEventListener("click", () => {
  if (userMarker) {
    map.setView(userMarker.getLatLng(), 15);
    userMarker.openPopup();
  } else {
    alert("Localização do usuário ainda não disponível.");
  }
});
