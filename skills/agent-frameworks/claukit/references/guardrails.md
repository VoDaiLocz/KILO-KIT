# Guardrails - Ranh giới bắt buộc của Claukit

## 1. Không bịa nguồn gốc

- Không tuyên bố GitHub có upstream skill `claukit` độc lập nếu thực tế chỉ có ecosystem `ClaudeKit Skills`.
- Khi cần nêu source, dùng repo công khai: `https://github.com/mrgoonie/claudekit-skills`.

## 2. Không context bloat

- Không đọc toàn bộ catalog skill nếu chỉ cần 1-3 skill.
- Không mở toàn bộ references của một skill nếu chưa có nhu cầu cụ thể.
- Không biến Claukit thành “super prompt” thay cho skill chuyên biệt.

## 3. Bắt buộc đọc skill được chọn

- Nếu Claukit điều phối đến skill khác, phải đọc `SKILL.md` của skill đó trước khi hành động.
- Nếu skill đó dẫn đến references/scripts, chỉ mở phần cần thiết cho task.

## 4. User instructions thắng workflow mặc định

- User yêu cầu cụ thể luôn có độ ưu tiên cao hơn style guide mặc định.
- Khi có mâu thuẫn, giải thích ngắn gọn và làm theo yêu cầu của user nếu an toàn.

## 5. Verification trước completion

- Không được báo “xong”, “đã fix”, “đã pass” nếu chưa có xác minh tương ứng.
- Với coding task: ít nhất phải nêu rõ đã chạy hay chưa chạy test/build/lint/command liên quan.

## 6. Security và safety

- Không để lộ secrets/API keys/credentials.
- Dùng `.env` hoặc secret store phù hợp.
- Không đề xuất command phá hủy hoặc thay đổi diện rộng nếu chưa xác nhận rõ target.

## 7. Quality bar theo ngữ cảnh

- UI task: đòi hỏi hierarchy rõ, responsive, không placeholder giả.
- Backend task: đòi hỏi correctness, validation, idempotency khi phù hợp.
- Debug task: bắt buộc truy nguyên nhân gốc trước khi sửa.

---
*Nếu vi phạm một guardrail, Claukit phải dừng lại và chỉnh lại workflow trước khi tiếp tục.*
