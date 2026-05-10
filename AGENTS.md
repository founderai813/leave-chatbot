# AGENTS.md

## Critical Workflow

- **index.html** (frontend): Push to `main` → Cloudflare Pages auto-deploys
- **worker.js** (API proxy): Must manually update via Cloudflare Dashboard → Workers → leave-chatbot-proxy → Edit code. GitHub changes do NOT auto-sync.

## Project Structure

```
├── index.html       # Frontend (single HTML file with embedded CSS/JS + System Prompt)
├── worker.js        # Cloudflare Worker API proxy (ES Module)
├── wrangler.toml    # Worker deployment config
└── skills/taiwan-leave-regulations/  # Domain knowledge skill for OpenCode
```

## Key Commands

- No build/test commands (pure static site)
- Test frontend: Open `index.html` directly in browser
- Deploy frontend: `git push origin main` (automatic via Cloudflare Pages)

## Domain Knowledge

Use the `taiwan-leave-regulations` skill when answering questions about:
- 公務人員請假規則
- 休假、病假、婚假、喪假、產假等假別天數
- 加班補休、家庭照顧假、育嬰留職停薪
- 銓敘部函釋、人事總處公告
- WebITR、差勤系統

## Important Notes

- System Prompt is in `index.html` (line ~40, variable `SYSTEM_PROMPT`)
- API Key (`GEMINI_API_KEY`) stored in Cloudflare Worker Secrets, not in code
- Worker endpoint: `leave-chatbot-proxy.founderai813.workers.dev`