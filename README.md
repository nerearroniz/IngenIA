# 🌿 Local Food Systems Research Toolkit
### Gipuzkoa, Spain · 2026

A single-page, browser-based research instrument for investigating regional food logistics and short supply chains in the Basque Country. Built without a server, framework, or database — everything runs locally in your browser and saves to a folder on your computer.

Visit the [website](https://nerearroniz.github.io/IngenIA/).
---

## What it is

This toolkit was built to support field research on **regional food logistics in Gipuzkoa** at a moment when no centralised dataset exists. Rather than waiting for data, the tool helps build one from the ground up — collecting observations in the field, simulating supply chain routes through that data, and translating findings into a consumer-facing local food guide.

The project is structured around three questions:

1. **Where is food coming from, and where are the problems?** → Section 1: Field Data Collection
2. **What happens when we connect those observations into a supply chain?** → Section 2: Supply Chain Simulation
3. **What does this mean for someone trying to eat locally?** → Section 3: Consumer View

---

## Sections

### 01 · Field Data Collection

Pin two types of observations to an interactive map:

**🌱 Food Sources** — farms, cooperatives, markets, distribution hubs, and small producers. Each entry captures:
- Source type and supply stage
- Transport mode used
- Origin radius (local / regional / national / imported)
- Main products handled
- Description and optional photograph

**⚠️ Freight Issues** — documented friction points in the logistics network:
- Traffic congestion zones
- Loading zone problems
- Accidents and incidents
- Double parking hotspots
- Time restriction conflicts

Both entry types feed directly into Section 2. A heatmap toggle and category filter help explore patterns as the dataset grows.

---

### 02 · Supply Chain Simulation

Your collected food sources appear as clickable nodes on a second map. Freight issue markers show known friction points.

**Building a chain:**
1. Make sure you are in **Select nodes** mode
2. Click any green source node to add it to the chain
3. Click again to remove it
4. Nodes can be added in any order and reordered via the chain display

**Adding a hypothetical hub:**
1. Switch to **Add hub** mode
2. Click anywhere on the map to place a purple hub node
3. Click the hub to add it to the chain
4. Use *Remove hubs* to clear all hypothetical nodes

**Live metrics update as you build:**

| Metric | How it is calculated |
|---|---|
| Total km | Sum of straight-line distances between consecutive nodes |
| CO₂ / tonne | Total km × 0.16 kg CO₂e (truck emission factor, IPCC/EEA) |
| Friction points | Documented issues within 500 m of any route segment |
| Shortness score | 100 − (15 × intermediaries) − (km × 0.04) − (10 × friction points) |

**Score thresholds:**

| Score | Label |
|---|---|
| 75 – 100 | 🌟 Ultra-short chain |
| 50 – 74 | ✅ Short supply chain |
| 25 – 49 | ⚠️ Semi-conventional |
| 0 – 24 | ❌ Conventional chain |

The analysis panel explains the result in plain language and flags whether documented freight issues lie along the route.

---

### 03 · Consumer View

Translates field research into a practical local food guide.

**In season right now** — products available this month in the Basque Country, automatically calculated from today's date.

**Find food near you:**
- Click 📡 GPS to use your device location
- Or click anywhere on the map to drop your position manually
- Adjust the radius (2 – 50 km) to control the search area
- The orange dashed circle shows your selected radius
- Sources inside the radius appear as bright markers; outside are faded
- The food finder cards sort automatically by distance (nearest first)
- Each card shows the exact distance to the source

**Food finder** filters your collected sources by type and presents them as a shopper-facing directory rather than a research dataset.

**Seasonal production calendar** — full 12-month grid for the Basque Country covering vegetables, fruits, legumes, and Bay of Biscay fish. The current month is highlighted. Filterable by category.

---

## Data Storage

### Recommended: File System API (Chrome / Edge / Safari 15.2+)

Click **📁 Open project folder** and select any folder on your computer. The app creates the following structure automatically:

    /your-folder/
        data.json
        images/
            1715xxx_farm-name.jpg
            1715xxx_market-visit.png

The JSON stores only filenames, not image content. Images remain as real files you can use in reports, papers, or GIS tools. JSON auto-saves every time you add an entry. Opening the same folder in a future session restores everything.

### Fallback: Manual JSON (Firefox and older browsers)

A warning appears automatically if your browser does not support the File System API. In this mode:
- Use **📁 Load JSON** to import a previous session
- Images are embedded as base64 text inside the JSON file
- Use **⬇️ Download JSON** to save your progress manually

---

## File Structure

    /local-food-toolkit/
        index.html
        images/
        data.json

No build step. No dependencies to install. No server required. Open `index.html` directly in your browser.

---

## Browser Compatibility

| Browser | Experience |
|---|---|
| ✅ Chrome 86+ | Full — images saved as real files |
| ✅ Edge 86+ | Full — images saved as real files |
| ✅ Safari 15.2+ | Full — images saved as real files |
| ⚠️ Firefox | Fallback — JSON export/import, images as base64 |

---

## Libraries Used

| Library | Version | Purpose |
|---|---|---|
| [Leaflet](https://leafletjs.com/) | latest | Interactive maps (Sections 1, 2, 3) |
| [Leaflet.heat](https://github.com/Leaflet/Leaflet.heat) | latest | Heatmap layer in Section 1 |
| [OpenStreetMap](https://www.openstreetmap.org/) | — | Map tiles (© OSM contributors) |

All loaded from CDN. No npm, no bundler.

---

## Data Model

Each entry saved to `data.json` follows this structure:

    {
      "id": 1715000000000,
      "mode": "source",
      "title": "Tolosa Farmers Market",
      "desc": "Weekly Saturday market, ~30 local producers",
      "lat": 43.1312,
      "lng": -2.0785,
      "image": "1715000000000_tolosa-farmers-market.jpg",
      "created_at": "2026-05-10T09:30:00.000Z",
      "sourceType": "market",
      "supplyStage": "retail",
      "transportMode": "van",
      "origin": "local",
      "products": "vegetables, cheese, cider, bread"
    }

For freight issue entries, `mode` is `"issue"` and the source-specific fields are replaced by `issueType`. The `_imageUrl` field is a runtime-only object URL used for display and is stripped before saving to disk.

---

## Emission Factors

Transport CO₂ estimates use standard benchmarks:

| Mode | Factor |
|---|---|
| Truck (refrigerated) | 0.16 kg CO₂e / tonne-km |
| Van | 0.25 kg CO₂e / tonne-km |
| Cargo ship | 0.012 kg CO₂e / tonne-km |
| Ship + truck (blended) | 0.035 kg CO₂e / tonne-km |

Source: IPCC / EEA transport emission benchmarks. Figures cover **transport only** — production, packaging, and refrigeration emissions are not included.

---

## Limitations

- **Distance calculation** uses straight-line (Haversine) distances, not road distances. Actual routes will be longer.
- **Friction detection** uses a 500 m buffer around route segments. This is a spatial approximation, not a routing analysis.
- **Shortness score** is an illustrative model, not a validated index. Weights are indicative and should be calibrated for local conditions.
- **Seasonal calendar** reflects typical Basque Country growing seasons. Actual availability varies by year, altitude, and microclimate.

---

## Research Context

This toolkit was developed as part of a research project on **spatial-temporal evolution of Freight Trip Generation** in Gipuzkoa. The field collection approach was adopted because no unified dataset for local food logistics in Gipuzkoa currently exists. The tool is designed to make the absence of data a starting point for research, not an obstacle to it.

---

## How to Run

1. Download or clone this repository
2. Open `index.html` in Chrome or Edge
3. Click **Open project folder** to begin

No installation needed.


