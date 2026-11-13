/**
 * Curated list of places in Ghana for the location picker.
 *
 * Each region lists its main towns plus, for the big cities, popular business
 * neighbourhoods. `area` is the parent city/district for a neighbourhood;
 * standalone towns omit it.
 */

const p = (name, area) => (area ? { name, area } : { name });

export const GHANA_REGIONS = [
  {
    region: "Greater Accra",
    places: [
      p("Accra"),
      p("Osu", "Accra"),
      p("East Legon", "Accra"),
      p("Airport Residential", "Accra"),
      p("Cantonments", "Accra"),
      p("Labone", "Accra"),
      p("Ridge", "Accra"),
      p("Adabraka", "Accra"),
      p("Asylum Down", "Accra"),
      p("Kokomlemle", "Accra"),
      p("Makola", "Accra"),
      p("Tudu", "Accra"),
      p("James Town", "Accra"),
      p("Kaneshie", "Accra"),
      p("Dansoman", "Accra"),
      p("Mamprobi", "Accra"),
      p("Korle Bu", "Accra"),
      p("Lapaz", "Accra"),
      p("Abeka", "Accra"),
      p("Achimota", "Accra"),
      p("Dzorwulu", "Accra"),
      p("Roman Ridge", "Accra"),
      p("North Kaneshie", "Accra"),
      p("Kwashieman", "Accra"),
      p("Odorkor", "Accra"),
      p("Darkuman", "Accra"),
      p("Abelemkpe", "Accra"),
      p("Nima", "Accra"),
      p("Kotobabi", "Accra"),
      p("Alajo", "Accra"),
      p("Teshie", "Accra"),
      p("Nungua", "Accra"),
      p("La", "Accra"),
      p("Labadi", "Accra"),
      p("Burma Camp", "Accra"),
      p("Spintex", "Accra"),
      p("Baatsona", "Accra"),
      p("Sakumono", "Accra"),
      p("Lashibi", "Accra"),
      p("Madina", "Accra"),
      p("Adenta", "Accra"),
      p("Legon", "Accra"),
      p("Haatso", "Accra"),
      p("Dome", "Accra"),
      p("Kwabenya", "Accra"),
      p("Taifa", "Accra"),
      p("Ashongman", "Accra"),
      p("Ofankor", "Accra"),
      p("Pokuase", "Accra"),
      p("Amasaman", "Accra"),
      p("Weija", "Accra"),
      p("McCarthy Hill", "Accra"),
      p("Mallam", "Accra"),
      p("Gbawe", "Accra"),
      p("Tema"),
      p("Community 1", "Tema"),
      p("Community 2", "Tema"),
      p("Community 4", "Tema"),
      p("Community 5", "Tema"),
      p("Community 7", "Tema"),
      p("Community 9", "Tema"),
      p("Community 11", "Tema"),
      p("Community 25", "Tema"),
      p("Tema New Town", "Tema"),
      p("Ashaiman"),
      p("Kpone"),
      p("Oyarifa"),
      p("Dodowa"),
      p("Prampram"),
      p("Ada Foah"),
      p("Sege"),
    ],
  },
  {
    region: "Ashanti",
    places: [
      p("Kumasi"),
      p("Adum", "Kumasi"),
      p("Asokwa", "Kumasi"),
      p("Bantama", "Kumasi"),
      p("Kejetia", "Kumasi"),
      p("Suame", "Kumasi"),
      p("Tafo", "Kumasi"),
      p("Nhyiaeso", "Kumasi"),
      p("Ahodwo", "Kumasi"),
      p("Danyame", "Kumasi"),
      p("Asafo", "Kumasi"),
      p("Ayigya", "Kumasi"),
      p("Bomso", "Kumasi"),
      p("Ayeduase", "Kumasi"),
      p("Kentinkrono", "Kumasi"),
      p("Atonsu", "Kumasi"),
      p("Ahinsan", "Kumasi"),
      p("Santasi", "Kumasi"),
      p("Abuakwa", "Kumasi"),
      p("Sofoline", "Kumasi"),
      p("Manhyia", "Kumasi"),
      p("Krofrom", "Kumasi"),
      p("Aboabo", "Kumasi"),
      p("Ejisu"),
      p("Kwadaso", "Kumasi"),
      p("Atasomanso", "Kumasi"),
      p("Obuasi"),
      p("Mampong"),
      p("Konongo"),
      p("Bekwai"),
      p("Ejura"),
      p("Offinso"),
      p("Agona", "Ashanti"),
      p("Nkawie"),
      p("Juaso"),
      p("Effiduase"),
      p("Tepa"),
      p("Mankranso"),
    ],
  },
  {
    region: "Western",
    places: [
      p("Takoradi"),
      p("Sekondi"),
      p("Market Circle", "Takoradi"),
      p("Anaji", "Takoradi"),
      p("Effia", "Takoradi"),
      p("Kwesimintsim", "Takoradi"),
      p("Airport Ridge", "Takoradi"),
      p("Apremdo", "Takoradi"),
      p("Tarkwa"),
      p("Prestea"),
      p("Axim"),
      p("Agona Nkwanta"),
      p("Elubo"),
      p("Half Assini"),
      p("Shama"),
      p("Nsuaem"),
    ],
  },
  {
    region: "Western North",
    places: [
      p("Sefwi Wiawso"),
      p("Bibiani"),
      p("Juaboso"),
      p("Enchi"),
      p("Sefwi Bekwai"),
      p("Akontombra"),
      p("Essam"),
    ],
  },
  {
    region: "Central",
    places: [
      p("Cape Coast"),
      p("Abura", "Cape Coast"),
      p("Pedu", "Cape Coast"),
      p("Kotokuraba", "Cape Coast"),
      p("Kasoa"),
      p("Winneba"),
      p("Elmina"),
      p("Saltpond"),
      p("Mankessim"),
      p("Swedru"),
      p("Dunkwa-on-Offin"),
      p("Twifo Praso"),
      p("Assin Fosu"),
      p("Apam"),
      p("Anomabo"),
      p("Agona Nyakrom"),
      p("Breman Asikuma"),
      p("Awutu Breku"),
    ],
  },
  {
    region: "Eastern",
    places: [
      p("Koforidua"),
      p("Nkawkaw"),
      p("Nsawam"),
      p("Suhum"),
      p("Akim Oda"),
      p("Kibi"),
      p("Akosombo"),
      p("Somanya"),
      p("Odumase Krobo"),
      p("Aburi"),
      p("Mpraeso"),
      p("Begoro"),
      p("Asamankese"),
      p("Akropong"),
      p("Donkorkrom"),
      p("Kade"),
      p("Abetifi"),
    ],
  },
  {
    region: "Volta",
    places: [
      p("Ho"),
      p("Hohoe"),
      p("Aflao"),
      p("Keta"),
      p("Kpando"),
      p("Sogakope"),
      p("Akatsi"),
      p("Anloga"),
      p("Dzodze"),
      p("Denu"),
      p("Kpeve"),
      p("Adidome"),
      p("Juapong"),
    ],
  },
  {
    region: "Oti",
    places: [
      p("Dambai"),
      p("Nkwanta"),
      p("Jasikan"),
      p("Kadjebi"),
      p("Kete Krachi"),
      p("Chinderi"),
      p("Worawora"),
    ],
  },
  {
    region: "Northern",
    places: [
      p("Tamale"),
      p("Lamashegu", "Tamale"),
      p("Vittin", "Tamale"),
      p("Kalpohin", "Tamale"),
      p("Sakasaka", "Tamale"),
      p("Yendi"),
      p("Savelugu"),
      p("Tolon"),
      p("Bimbilla"),
      p("Gushegu"),
      p("Karaga"),
      p("Zabzugu"),
      p("Kumbungu"),
      p("Wulensi"),
    ],
  },
  {
    region: "Savannah",
    places: [
      p("Damongo"),
      p("Bole"),
      p("Salaga"),
      p("Buipe"),
      p("Sawla"),
      p("Daboya"),
      p("Larabanga"),
    ],
  },
  {
    region: "North East",
    places: [
      p("Nalerigu"),
      p("Gambaga"),
      p("Walewale"),
      p("Bunkpurugu"),
      p("Chereponi"),
      p("Yunyoo"),
    ],
  },
  {
    region: "Upper East",
    places: [
      p("Bolgatanga"),
      p("Navrongo"),
      p("Bawku"),
      p("Paga"),
      p("Zebilla"),
      p("Sandema"),
      p("Tongo"),
      p("Garu"),
    ],
  },
  {
    region: "Upper West",
    places: [
      p("Wa"),
      p("Tumu"),
      p("Lawra"),
      p("Jirapa"),
      p("Nandom"),
      p("Nadowli"),
      p("Funsi"),
    ],
  },
  {
    region: "Bono",
    places: [
      p("Sunyani"),
      p("Berekum"),
      p("Dormaa Ahenkro"),
      p("Wenchi"),
      p("Odumase", "Sunyani"),
      p("Drobo"),
      p("Sampa"),
      p("Nsoatre"),
    ],
  },
  {
    region: "Bono East",
    places: [
      p("Techiman"),
      p("Kintampo"),
      p("Atebubu"),
      p("Nkoranza"),
      p("Yeji"),
      p("Kwame Danso"),
      p("Tuobodom"),
    ],
  },
  {
    region: "Ahafo",
    places: [
      p("Goaso"),
      p("Bechem"),
      p("Duayaw Nkwanta"),
      p("Kenyasi"),
      p("Hwidiem"),
      p("Kukuom"),
      p("Mim"),
    ],
  },
];

// Attach the region to every place so consumers can show/filter by it.
for (const r of GHANA_REGIONS) {
  r.places = r.places
    .filter(
      (pl, i, arr) =>
        arr.findIndex((o) => o.name === pl.name && o.area === pl.area) === i,
    )
    .map((pl) => ({ ...pl, region: r.region }));
}

const findPlace = (name) => {
  for (const r of GHANA_REGIONS) {
    const hit = r.places.find((pl) => pl.name === name);
    if (hit) return hit;
  }
  return { name };
};

export const POPULAR_PLACES = [
  "Accra",
  "Kumasi",
  "East Legon",
  "Osu",
  "Tema",
  "Spintex",
  "Madina",
  "Kasoa",
  "Takoradi",
  "Cape Coast",
  "Tamale",
  "Ho",
].map(findPlace);

/** Geocode-friendly query string, e.g. "Osu, Accra, Ghana" or "Tamale, Ghana". */
export function toQuery(place) {
  if (!place?.name) return "";
  const parts = [place.name];
  if (place.area && place.area !== place.name) parts.push(place.area);
  parts.push("Ghana");
  return parts.join(", ");
}

/** Display label, e.g. "Osu, Accra" or "Tamale". */
export function toLabel(place) {
  if (!place?.name) return "";
  return place.area && place.area !== place.name
    ? `${place.name}, ${place.area}`
    : place.name;
}
