// ================= LOGIN CHECK =================
if (window.location.pathname.includes("home.html")) {
  if (localStorage.getItem("login") !== "true") {
    window.location.href = "index.html";
  }
}

// ================= MAP =================
var map = L.map('map').setView([-7.6959, 111.9424], 17);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

// ================= DATA =================
var titik = [
  [-7.6956, 111.9419],
  [-7.6955, 111.9432],
  [-7.6964, 111.9433],
  [-7.6965, 111.9420]
];

var polygon = L.polygon(titik, {
  color: "#fff",
  fillColor: "#b71c1c",
  fillOpacity: 0.6
}).addTo(map);

map.fitBounds(polygon.getBounds());

// ================= HITUNG ULANG =================
function updateBidang() {
  polygon.setLatLngs(titik);

  // HITUNG LUAS (TURF)
  var turfKoordinat = titik.map(t => [t[1], t[0]]);
  turfKoordinat.push(turfKoordinat[0]);

  var luas = turf.area(turf.polygon([turfKoordinat]));
  document.getElementById("luas").innerText = luas.toFixed(2);

  // HITUNG PANJANG SISI
  document.getElementById("sisi").innerHTML = "";
  for (let i = 0; i < titik.length; i++) {
    let a = titik[i];
    let b = titik[(i + 1) % titik.length];
    let jarak = map.distance(a, b);

    let li = document.createElement("li");
    li.innerText = `Sisi ${i + 1}: ${jarak.toFixed(2)} meter`;
    document.getElementById("sisi").appendChild(li);
  }
}
updateBidang();

// ================= TAMBAH TITIK =================
var modeTambah = false;
function aktifGambar() {
  modeTambah = true;
  alert("Klik peta untuk menambah titik");
}

map.on("click", function (e) {
  if (modeTambah) {
    titik.push([e.latlng.lat, e.latlng.lng]);
    updateBidang();
  }
});

// ================= GPS =================
function ambilGPS() {
  navigator.geolocation.getCurrentPosition(pos => {
    var lat = pos.coords.latitude;
    var lng = pos.coords.longitude;

    map.setView([lat, lng], 18);
    L.marker([lat, lng]).addTo(map)
      .bindPopup("Lokasi Anda").openPopup();
  }, () => alert("GPS tidak tersedia"));
}

// ================= EXPORT PDF =================
function exportPDF() {
  const { jsPDF } = window.jspdf;
  let pdf = new jsPDF();

  pdf.text("DATA BIDANG TANAH", 20, 20);
  pdf.text(`Luas: ${document.getElementById("luas").innerText} m²`, 20, 30);

  let y = 40;
  document.querySelectorAll("#sisi li").forEach(li => {
    pdf.text(li.innerText, 20, y);
    y += 8;
  });

  pdf.save("bidang-tanah.pdf");
}

// ================= LOGOUT =================
function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}
