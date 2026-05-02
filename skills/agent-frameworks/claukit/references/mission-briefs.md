# Mission Briefs - Chiến lược Vận hành Claukit

Tài liệu này cập nhật `claukit` local theo tinh thần của `mrgoonie/claudekit-skills`: dùng skill chuyên biệt, progressive disclosure và workflow kỷ luật thay vì dồn mọi thứ vào một prompt lớn.

## Mục tiêu cốt lõi

### 1. Skill-first orchestration
- Mỗi task phải đi qua skill phù hợp nhất, không giải quyết tất cả bằng meta-prompt.
- `claukit` chỉ điều phối và chọn workflow; implementation vẫn thuộc về domain skill.

### 2. Progressive disclosure
- Chỉ tải `SKILL.md`, references và scripts thực sự cần cho task.
- Tránh context bloat bằng cách không đọc cả catalog skill hoặc cả repo nếu chưa cần.

### 3. User intent first
- User instructions có độ ưu tiên cao nhất.
- Nếu workflow mặc định của Claukit mâu thuẫn với yêu cầu cụ thể của user, theo user.

### 4. Verification over claims
- Không claim đã xong, đã fix, đã pass nếu chưa có bằng chứng chạy thật.
- Khi có build/test/lint/CLI liên quan, verification là bắt buộc.

### 5. Cross-skill consistency
- Các skill được chain phải có cùng mục tiêu, cùng tiêu chuẩn naming, cùng quality bar.
- Khi handoff giữa skills hoặc subagents, cần giữ rõ assumptions, file ownership, verification criteria.

### 6. Local-first compatibility
- Ưu tiên dùng các skill đã được cài local cho Codex/Gemini thay vì sao chép nguyên văn hướng dẫn chỉ dành cho Claude Code.
- Dùng repo GitHub ClaudeKit làm nguồn tham chiếu công khai, nhưng ánh xạ vào toolchain local hiện tại.

## Hệ quả thực thi

- Task UI-heavy: ưu tiên chất lượng thị giác nhưng vẫn theo guardrails của dự án.
- Task backend/debugging: ưu tiên correctness, traceability và validation.
- Task lớn: phải tách thành workflow rõ ràng thay vì kích hoạt hàng loạt skill cùng lúc.

---
*Mission brief của Claukit là: đúng skill, đúng thứ tự, đúng bằng chứng.*
