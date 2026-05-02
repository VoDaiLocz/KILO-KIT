# Integration Hints - Skill chaining theo ClaudeKit style

## Chain chuẩn cho feature delivery

`claukit -> brainstorming -> writing-plans -> subagent-driven-development hoặc executing-plans -> code-review -> verification-before-completion`

Dùng khi:
- bắt đầu feature mới
- có nhiều bước phân tích, code, review
- cần workflow chặt và nhất quán

## Chain cho debugging

`claukit -> systematic-debugging -> root-cause-tracing hoặc defense-in-depth -> verification-before-completion`

Dùng khi:
- có bug khó
- test flake
- hành vi lệch nhưng chưa rõ nguyên nhân

## Chain cho UI/UX

`claukit -> frontend-design -> aesthetic -> ui-styling -> chrome-devtools`

Dùng khi:
- build landing page, dashboard, component library
- cần visual polish hoặc interaction quality
- cần kiểm tra giao diện bằng browser tooling

## Chain cho backend/platform

`claukit -> backend-development -> databases -> better-auth -> devops`

Dùng khi:
- thiết kế API/backend service
- thêm auth, data model, deployment concerns
- cần giữ consistency giữa domain logic và infra

## Chain cho research/docs

`claukit -> docs-seeker -> repomix -> mermaidjs-v11`

Dùng khi:
- cần đọc docs mới nhất
- cần phân tích repo bên ngoài
- cần biến findings thành sơ đồ hoặc tài liệu

## Mapping theo nhóm skill local

| Nhóm nhu cầu | Skill local nên ưu tiên |
| :--- | :--- |
| Orchestration | `brainstorming`, `writing-plans`, `subagent-driven-development`, `executing-plans` |
| Quality gates | `code-review`, `systematic-debugging`, `verification-before-completion` |
| Frontend | `frontend-design`, `aesthetic`, `ui-styling`, `web-frameworks` |
| Backend | `backend-development`, `databases`, `better-auth`, `devops` |
| Research & tooling | `docs-seeker`, `repomix`, `chrome-devtools`, `mcp-management` |
| Advanced reasoning | `sequential-thinking`, `problem-solving/*` |

## Gợi ý chọn skill

- Chọn chain ngắn nhất giải được task.
- Nếu task chỉ là debug, đừng kéo cả planning chain vào.
- Nếu task chỉ là design review, đừng gọi backend skill.
- Nếu task đã ở giữa một workflow superpowers, Claukit nên bổ trợ chứ không reset lại toàn bộ flow.

---
*Claukit hiệu quả nhất khi nó chọn đúng chain, không phải chain dài nhất.*
