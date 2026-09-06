# FitForge Studio｜健身教練網站樣板

電商易（EshopEasy）**網站樣板示範**：虛構品牌 FitForge Studio，展示香港獨立健身教練單頁結構（明碼套餐、營養加購、前後對比、WhatsApp 查詢）。**非真實營業、非已簽約客戶案例。**

## 本機預覽

在專案目錄執行：

```bash
cd fitness-coach-template
python3 -m http.server 8765
```

瀏覽器開啟：<http://127.0.0.1:8765/>

（亦可改用其他埠，例如 `python3 -m http.server 8000`。）

> 請用本機 HTTP 伺服器開啟，勿直接用 `file://`，否則 `fetch('data/site.json')` 可能被瀏覽器封鎖。

## 如何自訂

主要內容與主題色皆在 **`data/site.json`**：

| 欄位 | 說明 |
|------|------|
| `brand` / `meta` / `contact` | 品牌名、SEO、WhatsApp 號碼與預設訊息 |
| `theme` | 炭黑＋萊姆綠等 CSS 變數（`#b8f53a`） |
| `packages` | 私人教練、團體減肥、私人／團體拳擊泰拳等明碼 HKD 價格 |
| `nutrition` | 營養顧問「加購／可獨立報名」 |
| `coach` / `results` | 教練簡介、虛構示範案例與免責聲明 |
| `images` | Hero／套餐 Unsplash 圖（或改為自有圖路徑） |

修改 `site.json` 後重新整理頁面即可；多數區塊由 `js/content.js` 動態填入。樣式在 `css/site.css`，互動（選單、sticky WhatsApp）在 `js/site.js`。

## 部署至 GitHub Pages

1. 將本資料夾推上 GitHub repository（可放在 repo 根目錄，或 `docs/`／`gh-pages` 分支）。
2. 於 repo **Settings → Pages** 選擇來源（Deploy from a branch），分支選 `main`（或 `gh-pages`），資料夾選 `/`（或 `/docs`）。
3. 專案已附 **`.nojekyll`**，避免 GitHub Pages 的 Jekyll 略過底線檔案或靜態資源。
4. 數分鐘後即可用 `https://<user>.github.io/<repo>/` 開啟。

靜態站無需 build；確認 `index.html`、`css/`、`js/`、`data/`、`assets/` 一併上線即可。

## 目錄結構

```
fitness-coach-template/
├── index.html
├── privacy.html
├── .nojekyll
├── README.md
├── css/site.css
├── js/content.js
├── js/site.js
├── data/site.json
└── assets/logo.svg, favicon.svg
```

## 重要聲明

- 頁尾標示：**樣板示範／虛構品牌／電商易客戶案例樣板**
- 減肥前後對比標為「虛構示範案例」，並附免責：「以上為虛構示範案例，僅供網站樣板展示，不代表真實成效。」
- 電話與 WhatsApp 為 DEMO 佔位，請於 `site.json` 更換為真實資料後再作正式用途。
