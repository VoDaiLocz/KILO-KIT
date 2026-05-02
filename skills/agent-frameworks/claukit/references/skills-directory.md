# Skills Directory - Danh mục rút gọn dùng với Claukit

Tài liệu này không cố liệt kê mọi skill trong hệ thống. Nó chỉ gom các skill local có giá trị nhất khi `claukit` cần điều phối workflow.

## Cách dùng

1. Xác định task thuộc nhóm nào.
2. Chọn 1 meta/process skill và 1-2 domain skill.
3. Đọc `SKILL.md` của các skill đó trước khi tiếp tục.
4. Chỉ mở references sâu hơn khi task cần.

## 1. Orchestration & delivery

| Skill | Khi nào dùng | Path |
| :--- | :--- | :--- |
| `claukit` | Điều phối workflow nhiều skill, bám theo ClaudeKit style | `claukit/SKILL.md` |
| `brainstorming` | Làm rõ yêu cầu, thiết kế trước khi code | `superpowers-core/brainstorming/SKILL.md` |
| `writing-plans` | Viết implementation plan chi tiết | `superpowers-core/writing-plans/SKILL.md` |
| `subagent-driven-development` | Thực thi plan bằng nhiều worker/review gate | `superpowers-core/subagent-driven-development/SKILL.md` |
| `executing-plans` | Chạy plan theo batch/checkpoint | `superpowers-core/executing-plans/SKILL.md` |
| `using-git-worktrees` | Tách môi trường làm việc an toàn | `superpowers-core/using-git-worktrees/SKILL.md` |

## 2. Quality & debugging

| Skill | Khi nào dùng | Path |
| :--- | :--- | :--- |
| `code-review` | Review kỹ thuật, nhận hoặc yêu cầu review | `code-review/SKILL.md` |
| `systematic-debugging` | Debug theo quy trình, không nhảy vào sửa ngay | `superpowers-core/systematic-debugging/SKILL.md` |
| `verification-before-completion` | Gate cuối trước khi claim hoàn tất | `superpowers-core/verification-before-completion/SKILL.md` |
| `root-cause-tracing` | Truy nguyên nhân gốc | `debugging/root-cause-tracing/SKILL.md` |
| `defense-in-depth` | Chặn bug ở nhiều lớp | `debugging/defense-in-depth/SKILL.md` |

## 3. Product & application skills

| Skill | Khi nào dùng | Path |
| :--- | :--- | :--- |
| `frontend-design` | UI/UX khác biệt, component/page production-grade | `frontend-design/SKILL.md` |
| `aesthetic` | Nâng quality thị giác và micro-interactions | `aesthetic/SKILL.md` |
| `ui-styling` | Tailwind, shadcn/ui, design system | `ui-styling/SKILL.md` |
| `web-frameworks` | Next.js, full-stack web app structure | `web-frameworks/SKILL.md` |
| `backend-development` | API, services, security, performance | `backend-development/SKILL.md` |
| `databases` | Schema/query/index/ops cho PostgreSQL và MongoDB | `databases/SKILL.md` |
| `better-auth` | Auth/authz flow | `better-auth/SKILL.md` |
| `devops` | Deploy, infra, containers, cloud | `devops/SKILL.md` |

## 4. Research, docs, and tooling

| Skill | Khi nào dùng | Path |
| :--- | :--- | :--- |
| `docs-seeker` | Tìm docs mới nhất và source chính thống | `docs-seeker/SKILL.md` |
| `repomix` | Đóng gói repo để phân tích | `repomix/SKILL.md` |
| `chrome-devtools` | Browser automation, perf, snapshots | `chrome-devtools/SKILL.md` |
| `mcp-management` | Tìm và dùng MCP tools/resources đúng cách | `mcp-management/SKILL.md` |
| `mermaidjs-v11` | Vẽ sơ đồ, flow, architecture docs | `mermaidjs-v11/SKILL.md` |

## 5. Advanced reasoning

| Skill | Khi nào dùng | Path |
| :--- | :--- | :--- |
| `sequential-thinking` | Bài toán nhiều bước, scope chưa rõ | `sequential-thinking/SKILL.md` |
| `problem-solving/*` | Cần đổi góc nhìn hoặc phá bế tắc | `problem-solving/ABOUT.md` |
| `context-engineering` | Tối ưu context và multi-agent flows | `context-engineering/SKILL.md` |

## Public source reference

- GitHub ecosystem reference: `https://github.com/mrgoonie/claudekit-skills`
- Local root: `C:\Users\Admin\.gemini\antigravity\skills\`

---
*Claukit nên chọn ít skill nhưng đúng skill. Đó là điểm khác biệt giữa orchestration và context spam.*
