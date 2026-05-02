---
name: claukit
description: Advanced Agentic Coding framework providing mission briefs, guardrails, and integration hints for complex tasks. This skill ensures high-quality output through disciplined automation and systematic workflows.
---

# Claukit - Advanced Agentic Coding

Claukit là meta-skill điều phối được căn chỉnh theo hệ sinh thái ClaudeKit Skills. Trong cài đặt local này, `claukit` đóng vai trò wrapper/orchestrator cho các skill đang có sẵn, chứ không phải một upstream skill độc lập.

## Source

- Public source tham chiếu: `https://github.com/mrgoonie/claudekit-skills`
- Gốc ý tưởng: ClaudeKit Skills dùng mô hình `mission briefs + guardrails + integration hints` để điều phối các skill chuyên biệt.
- Vai trò local: nối triết lý đó với bộ skill hiện có trong `C:\Users\Admin\.gemini\antigravity\skills\` và các junction của Codex.

## 🎯 Khi nào sử dụng Skill này

Sử dụng khi:
- Người dùng nhắc đến `claukit`, `ClaudeKit`, hoặc muốn làm việc theo phong cách ClaudeKit.
- Tác vụ cần phối hợp nhiều skill thay vì chỉ một domain skill đơn lẻ.
- Dự án có nhiều pha: thiết kế, lập kế hoạch, thực thi, review, verification.
- Cần giữ cùng một bộ tiêu chuẩn xuyên suốt giữa nhiều subagents hoặc nhiều lần handoff.
- Cần giảm context bloat bằng cách chỉ tải đúng skill và references cần thiết.

## 🛠 Hướng dẫn thực hiện (Quy trình bắt buộc)

1. **Đọc Mission Briefs**: Mở `references/mission-briefs.md` để chốt nguyên tắc vận hành và ưu tiên tổng thể.
2. **Đọc Guardrails**: Mở `references/guardrails.md` để biết các ranh giới bắt buộc trước khi phân tích hay sửa code.
3. **Đọc Integration Hints**: Mở `references/integration-hints.md` để chọn đúng chain skill cho task hiện tại.
4. **Chọn skill tối thiểu cần thiết**: Dùng `references/skills-directory.md` để chọn 1-3 skill phù hợp nhất thay vì bật cả hệ thống.
5. **Bắt buộc đọc SKILL.md của skill được chọn**: Claukit không thay thế skill chuyên biệt. Nó chỉ điều phối.
6. **Giữ progressive disclosure**: Chỉ đọc thêm references hoặc scripts khi task thực sự cần.
7. **Re-check guardrails trước khi kết luận xong việc**: Đặc biệt trước khi claim “đã fix”, “đã pass”, hoặc “đã hoàn tất”.

## Operating Rules

- **User instructions thắng Claukit**: Nếu user yêu cầu khác với workflow mặc định, làm theo user.
- **Không bịa upstream**: Không nói repo công khai có skill `claukit` riêng nếu thực tế không có. Local `claukit` là wrapper dựa trên ClaudeKit ecosystem.
- **Không load catalog bừa bãi**: Chỉ chọn số skill nhỏ nhất giải được bài toán.
- **Không thay domain skill**: Task backend vẫn phải đọc `backend-development`; task debug vẫn phải đọc `systematic-debugging`; task UI vẫn phải đọc `frontend-design` hoặc `aesthetic`.
- **Không bỏ verification**: Khi đã có code/test/build liên quan, phải có bước xác minh thực tế trước khi báo xong.

## 📂 Danh mục Kỹ năng & Tài liệu

### Core references

- [**Mission Briefs**](references/mission-briefs.md): Triết lý vận hành Claukit/ClaudeKit trong local environment.
- [**Guardrails**](references/guardrails.md): Giới hạn bắt buộc về context, chất lượng, bảo mật và tính chính xác.
- [**Integration Hints**](references/integration-hints.md): Skill chains khuyến nghị cho UI, backend, debugging, research.
- [**Skills Directory**](references/skills-directory.md): Danh mục rút gọn các skill local nên phối hợp với Claukit.

### Typical chains

- `claukit -> brainstorming -> writing-plans -> subagent-driven-development -> code-review -> verification-before-completion`
- `claukit -> systematic-debugging -> root-cause-tracing/defense-in-depth -> verification-before-completion`
- `claukit -> frontend-design -> aesthetic -> ui-styling -> chrome-devtools`
- `claukit -> backend-development -> databases -> better-auth -> devops`
- `claukit -> docs-seeker -> repomix -> mermaidjs-v11`

---
*Lưu ý: Claukit là skill điều phối. Chất lượng đầu ra phụ thuộc vào việc chọn đúng skill chuyên biệt và tuân thủ guardrails.*
