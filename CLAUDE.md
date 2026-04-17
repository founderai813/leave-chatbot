# CLAUDE.md

## 專案概述

**差勤小幫手** 是一個台灣公務人員差勤法規 AI 諮詢聊天機器人。使用者可透過網頁介面即時查詢公務人員請假規則、休假天數、加班補休、函釋等差勤相關法規。

- **產品網址**：https://leave-chatbot.futurestarai.com
- **GitHub Repo**：https://github.com/founderai813/leave-chatbot
- **AI 模型**：Google Gemini 2.5 Flash（透過 Cloudflare Worker 代理）

---

## 品牌

- **主品牌**：futurestarai.com
- **子網域格式**：`<project>.futurestarai.com`
- **本專案網域**：`leave-chatbot.futurestarai.com`
- **Cloudflare 帳號 ID**：`1565eb27caa47720fcf3e95544dfeb1e`

---

## 架構

```
使用者瀏覽器
    │
    │  HTTPS
    ▼
┌─────────────────────────────────┐
│  Cloudflare Pages               │
│  (leave-chatbot-web)            │
│  靜態前端：index.html            │
│  網域：leave-chatbot.futurestarai.com │
└───────────────┬─────────────────┘
                │  POST (JSON)
                ▼
┌─────────────────────────────────┐
│  Cloudflare Worker              │
│  (leave-chatbot-proxy)          │
│  API 代理：worker.js            │
│  網域：leave-chatbot-proxy.founderai813.workers.dev │
│  Secret：GEMINI_API_KEY         │
└───────────────┬─────────────────┘
                │  POST (JSON + API Key)
                ▼
┌─────────────────────────────────┐
│  Google Gemini API              │
│  模型：gemini-2.5-flash         │
│  端點：generativelanguage.googleapis.com │
└─────────────────────────────────┘
```

### 前端（Cloudflare Pages）
- **檔案**：`index.html`（單一 HTML 檔案，含 CSS + JS）
- **Pages 專案名稱**：`leave-chatbot-web`
- **Production branch**：`main`
- **Build command**：無（純靜態）
- **功能**：
  - 聊天氣泡介面（使用者右側 / 機器人左側）
  - 六個常見問題快速按鈕（永遠顯示）
  - 三點動態 loading 效果
  - 多輪對話歷史（完整傳給 API）
  - Enter 送出、RWD 響應式
  - 頁首顯示線上狀態、頁尾免責聲明
  - System Prompt 包含完整差勤法規、函釋、政府公告

### 後端（Cloudflare Worker）
- **檔案**：`worker.js`
- **Worker 名稱**：`leave-chatbot-proxy`
- **功能**：
  - 接收前端 POST 請求，轉發到 Gemini API
  - 從環境變數 `GEMINI_API_KEY` 讀取 API Key（不暴露給前端）
  - CORS 支援（`Access-Control-Allow-Origin: *`）
  - 錯誤處理（400/405/500/502）

### 設定檔
- **`wrangler.toml`**：Worker 部署設定（名稱、入口、相容日期）

---

## 檔案結構

```
leave-chatbot/
├── CLAUDE.md        # 本檔案 — 專案文件
├── README.md        # GitHub 說明
├── index.html       # 前端聊天介面（含 CSS/JS/System Prompt）
├── worker.js        # Cloudflare Worker API 代理
└── wrangler.toml    # Worker 部署設定
```

---

## 部署資訊

### Cloudflare Pages（前端）
- **專案**：`leave-chatbot-web`
- **自動部署**：每次 push 到 `main` 分支，Pages 會自動重新部署
- **自訂網域**：`leave-chatbot.futurestarai.com`
- **預設網域**：`leave-chatbot-web.pages.dev`

### Cloudflare Worker（後端 API 代理）
- **專案**：`leave-chatbot-proxy`
- **部署方式**：手動透過 Cloudflare Dashboard > Edit code
- **⚠️ 注意**：修改 `worker.js` 後需手動到 Dashboard 更新 Worker 程式碼，GitHub 的變更不會自動同步到 Worker
- **環境變數**：
  - `GEMINI_API_KEY`（Secret 類型）— Google AI Studio API Key
- **Worker 網域**：`leave-chatbot-proxy.founderai813.workers.dev`

### API 金鑰管理
- Gemini API Key 儲存在 Cloudflare Worker Secret，不寫死在程式碼中
- 取得 API Key：https://aistudio.google.com/app/apikey
- 更新 Key：Cloudflare Dashboard > Workers > leave-chatbot-proxy > Settings > Variables and Secrets

---

## 工作流程

### 修改前端（index.html）
1. 編輯 `index.html`（在 GitHub 網頁或本地）
2. Commit 到 `main` 分支
3. Cloudflare Pages **自動部署**（約 30 秒）
4. 完成 ✅

### 修改後端（worker.js）
1. 編輯 `worker.js`
2. Commit 到 `main` 分支（保持 repo 同步）
3. **另外**到 Cloudflare Dashboard > Workers > leave-chatbot-proxy > Edit code
4. 貼上新的程式碼 > Save and deploy
5. 完成 ✅

### 修改 System Prompt（差勤法規內容）
- System Prompt 在 `index.html` 的 `<script>` 區塊裡的 `SYSTEM_PROMPT` 變數
- 修改後只需 push 到 GitHub，Pages 會自動部署
- 不需動 Worker

### 更換 AI 模型
1. 修改 `worker.js` 第一行的 `GEMINI_URL`（改模型名稱）
2. Push 到 GitHub + 到 Cloudflare Dashboard 更新 Worker 程式碼

### 更換 API Key
1. Cloudflare Dashboard > Workers > leave-chatbot-proxy > Settings > Variables and Secrets
2. 編輯 `GEMINI_API_KEY` > 貼上新 Key > Encrypt > Deploy

---

## 技術規格

- **前端**：純 HTML + CSS + JavaScript（無框架、無 npm）
- **後端**：Cloudflare Worker（ES Module 格式）
- **AI**：Google Gemini 2.5 Flash（`generativelanguage.googleapis.com/v1beta`）
- **部署**：Cloudflare Pages + Cloudflare Workers
- **DNS**：Cloudflare DNS（futurestarai.com）
- **SSL**：Cloudflare 自動簽發

---

## 注意事項

- `worker.js` 在 GitHub 和 Cloudflare Worker 是**分開管理**的，修改 GitHub 不會自動同步到 Worker
- System Prompt 很大（約 3000 字），包含完整假別規定、函釋與政府公告，修改時注意 JavaScript 字串跳脫
- Gemini API 有每分鐘請求限制，免費方案約 15 RPM
- 前端快速問題按鈕設計為永遠顯示，不會在送出後消失
