import { useState } from 'react'
import { ChiikawaSVG } from '../common/ChiikawaSVG'
import { DEMO_COUPLE_PROFILE } from '../../domain/couple/demoProfile'
import type { CoupleProfile } from '../../domain/couple/types'

interface Props {
  isOpen: boolean
  onComplete: (profile: CoupleProfile) => void
  onSkipToDemo: () => void
}

export function CoupleSetupModal({ isOpen, onComplete, onSkipToDemo }: Props) {
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1)

  // Form states
  const [player1Name, setPlayer1Name] = useState('Haru')
  const [player2Name, setPlayer2Name] = useState('Mai Trang')
  const [player1Role, setPlayer1Role] = useState<'chiikawa' | 'usagi'>('chiikawa')
  const [relationshipStartDate, setRelationshipStartDate] = useState('2026-06-11')
  const [tripDate, setTripDate] = useState('2026-08-27')
  const [tripName, setTripName] = useState('Chuyến Bay Biển Nha Trang')

  if (!isOpen) return null

  const handleFinish = () => {
    const customProfile: CoupleProfile = {
      ...DEMO_COUPLE_PROFILE,
      id: `profile-${Date.now()}`,
      title: `Tổ Ấm Của ${player1Name} & ${player2Name}`,
      player1: {
        ...DEMO_COUPLE_PROFILE.player1,
        displayName: player1Name,
        nickname: player1Name,
        avatarCharacter: player1Role
      },
      player2: {
        ...DEMO_COUPLE_PROFILE.player2,
        displayName: player2Name,
        nickname: player2Name,
        avatarCharacter: player1Role === 'chiikawa' ? 'usagi' : 'chiikawa'
      },
      relationshipStartDate: relationshipStartDate || '2026-06-11',
      importantDates: [
        {
          id: 'anniversary',
          title: 'Ngày Kỷ Niệm Yêu Nhau',
          date: relationshipStartDate || '2026-06-11',
          category: 'anniversary',
          countdown: false,
          icon: '💖'
        },
        ...(tripDate
          ? [
              {
                id: 'upcoming-trip',
                title: tripName || 'Chuyến Đi Của Chúng Mình',
                date: tripDate,
                category: 'trip' as const,
                countdown: true,
                icon: '✈️'
              }
            ]
          : [])
      ],
      onboardingCompleted: true,
      updatedAt: new Date().toISOString()
    }
    onComplete(customProfile)
  }

  return (
    <div className="game-modal-backdrop animate-fade-in" style={{ zIndex: 10000 }}>
      <div className="onboarding-card card animate-scale-up" style={{
        maxWidth: '520px',
        width: '92%',
        padding: '28px',
        background: 'linear-gradient(135deg, #ffffff 0%, #fff7f9 100%)',
        borderRadius: '28px',
        border: '2px solid rgba(255, 141, 161, 0.4)',
        boxShadow: '0 24px 60px rgba(255, 141, 161, 0.35)',
        textAlign: 'center'
      }}>
        {/* Progress Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              style={{
                width: s === step ? '24px' : '8px',
                height: '8px',
                borderRadius: '4px',
                backgroundColor: s === step ? '#ff5e7e' : '#ffd6dc',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>

        {/* STEP 1: WELCOME */}
        {step === 1 && (
          <div>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🌸🏰✨</div>
            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#e63956', marginBottom: '8px' }}>
              Chào Mừng Đến Với Little Days!
            </h2>
            <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#6d4c51', marginBottom: '24px' }}>
              Đây là một thế giới thu nhỏ dành riêng cho hai bạn. Nơi lưu giữ kỷ niệm, theo dõi lộ trình sẵn sàng và rèn luyện thói quen tốt mỗi ngày bên nhau.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginBottom: '24px' }}>
              <div style={{ padding: '12px', background: 'rgba(255, 141, 161, 0.15)', borderRadius: '16px' }}>
                <ChiikawaSVG character="chiikawa" size={64} />
              </div>
              <div style={{ padding: '12px', background: 'rgba(255, 209, 102, 0.2)', borderRadius: '16px' }}>
                <ChiikawaSVG character="usagi" size={64} />
              </div>
            </div>
            <button
              type="button"
              className="primary-btn"
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '16px',
                fontWeight: 700,
                fontSize: '15px',
                background: 'linear-gradient(135deg, #ff8da1 0%, #ff5e7e 100%)',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 6px 16px rgba(255, 94, 126, 0.35)'
              }}
              onClick={() => setStep(2)}
            >
              Bắt Đầu Tạo Tổ Ấm ✨
            </button>
          </div>
        )}

        {/* STEP 2: WHO LIVES HERE? */}
        {step === 2 && (
          <div>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>💌</div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#e63956', marginBottom: '6px' }}>
              Ai Đang Sống Ở Đây?
            </h2>
            <p style={{ fontSize: '13px', color: '#8c6268', marginBottom: '20px' }}>
              Hãy đặt tên hoặc biệt danh đáng yêu của hai bạn nhé:
            </p>

            <div style={{ textAlign: 'left', marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 700, color: '#4a2828', display: 'block', marginBottom: '6px' }}>
                Tên / Biệt danh của Bạn:
              </label>
              <input
                type="text"
                value={player1Name}
                onChange={(e) => setPlayer1Name(e.target.value)}
                placeholder="Ví dụ: Haru, Dũng..."
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '14px',
                  border: '1.5px solid #ffccd5',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ textAlign: 'left', marginBottom: '24px' }}>
              <label style={{ fontSize: '13px', fontWeight: 700, color: '#4a2828', display: 'block', marginBottom: '6px' }}>
                Tên / Biệt danh của Người Ấy:
              </label>
              <input
                type="text"
                value={player2Name}
                onChange={(e) => setPlayer2Name(e.target.value)}
                placeholder="Ví dụ: Mai Trang, Bé Mèo..."
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '14px',
                  border: '1.5px solid #ffccd5',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                style={{ flex: 1, padding: '12px', borderRadius: '14px', border: '1px solid #e0d0d0', background: 'white', cursor: 'pointer' }}
                onClick={() => setStep(1)}
              >
                Quay lại
              </button>
              <button
                type="button"
                style={{
                  flex: 2,
                  padding: '12px',
                  borderRadius: '14px',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #ff8da1 0%, #ff5e7e 100%)',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onClick={() => setStep(3)}
              >
                Tiếp tục ➔
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: CHOOSE CHARACTER ASSIGNMENT */}
        {step === 3 && (
          <div>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>🎭</div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#e63956', marginBottom: '6px' }}>
              Linh Vật Đại Diện
            </h2>
            <p style={{ fontSize: '13px', color: '#8c6268', marginBottom: '20px' }}>
              Bạn ({player1Name}) muốn hóa thân thành bé nào?
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '24px' }}>
              {/* Option Chiikawa */}
              <div
                onClick={() => setPlayer1Role('chiikawa')}
                style={{
                  padding: '16px',
                  borderRadius: '20px',
                  border: player1Role === 'chiikawa' ? '2.5px solid #ff5e7e' : '1.5px solid #eee',
                  background: player1Role === 'chiikawa' ? 'rgba(255, 141, 161, 0.15)' : 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <ChiikawaSVG character="chiikawa" size={56} />
                <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#e63956', marginTop: '8px', marginBottom: '2px' }}>
                  Bé Chiikawa 🐹
                </h4>
                <span style={{ fontSize: '11px', color: '#7a5252' }}>Ấm áp, chu đáo</span>
              </div>

              {/* Option Usagi */}
              <div
                onClick={() => setPlayer1Role('usagi')}
                style={{
                  padding: '16px',
                  borderRadius: '20px',
                  border: player1Role === 'usagi' ? '2.5px solid #f59f00' : '1.5px solid #eee',
                  background: player1Role === 'usagi' ? 'rgba(255, 209, 102, 0.2)' : 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <ChiikawaSVG character="usagi" size={56} />
                <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#d97706', marginTop: '8px', marginBottom: '2px' }}>
                  Thỏ Usagi 🐰
                </h4>
                <span style={{ fontSize: '11px', color: '#7a5252' }}>Năng lượng siêu cấp</span>
              </div>
            </div>

            <p style={{ fontSize: '12px', color: '#8c6268', marginBottom: '20px' }}>
              👉 <strong>{player2Name}</strong> sẽ tự động nhận linh vật{' '}
              <strong>{player1Role === 'chiikawa' ? 'Thỏ Usagi 🐰' : 'Bé Chiikawa 🐹'}</strong>.
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                style={{ flex: 1, padding: '12px', borderRadius: '14px', border: '1px solid #e0d0d0', background: 'white', cursor: 'pointer' }}
                onClick={() => setStep(2)}
              >
                Quay lại
              </button>
              <button
                type="button"
                style={{
                  flex: 2,
                  padding: '12px',
                  borderRadius: '14px',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #ff8da1 0%, #ff5e7e 100%)',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onClick={() => setStep(4)}
              >
                Tiếp tục ➔
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: IMPORTANT DATES */}
        {step === 4 && (
          <div>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>🗓️</div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#e63956', marginBottom: '6px' }}>
              Cột Mốc Của Chúng Mình
            </h2>
            <p style={{ fontSize: '13px', color: '#8c6268', marginBottom: '18px' }}>
              (Tùy chọn) Nhập ngày kỷ niệm để ứng dụng đếm từng ngày yêu nhau:
            </p>

            <div style={{ textAlign: 'left', marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#4a2828', display: 'block', marginBottom: '4px' }}>
                💖 Ngày bắt đầu yêu nhau:
              </label>
              <input
                type="date"
                value={relationshipStartDate}
                onChange={(e) => setRelationshipStartDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid #ffccd5',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ textAlign: 'left', marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#4a2828', display: 'block', marginBottom: '4px' }}>
                ✈️ Ngày chuyến đi / mục tiêu sắp tới:
              </label>
              <input
                type="date"
                value={tripDate}
                onChange={(e) => setTripDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid #ffccd5',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ textAlign: 'left', marginBottom: '22px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#4a2828', display: 'block', marginBottom: '4px' }}>
                Tên chuyến đi:
              </label>
              <input
                type="text"
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                placeholder="Ví dụ: Chuyến bay biển Nha Trang"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid #ffccd5',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                style={{ flex: 1, padding: '12px', borderRadius: '14px', border: '1px solid #e0d0d0', background: 'white', cursor: 'pointer' }}
                onClick={() => setStep(3)}
              >
                Quay lại
              </button>
              <button
                type="button"
                style={{
                  flex: 2,
                  padding: '12px',
                  borderRadius: '14px',
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #ff8da1 0%, #ff5e7e 100%)',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onClick={() => setStep(5)}
              >
                Tiếp tục ➔
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: PRIVACY COMMITMENT */}
        {step === 5 && (
          <div>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>🛡️</div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#e63956', marginBottom: '6px' }}>
              Bảo Mật &amp; Riêng Tư 100%
            </h2>
            <p style={{ fontSize: '13px', color: '#6d4c51', lineHeight: 1.6, marginBottom: '20px' }}>
              Mọi dữ liệu tên gọi, ngày kỷ niệm, hình ảnh và ghi chép của bạn đều được <strong>lưu cục bộ trên trình duyệt (Local-first)</strong>. Không có bất kỳ dữ liệu nào được tải lên máy chủ ngoài.
            </p>

            <div style={{
              background: 'rgba(103, 183, 255, 0.15)',
              borderRadius: '16px',
              padding: '14px',
              textAlign: 'left',
              fontSize: '12px',
              color: '#1a5276',
              marginBottom: '24px',
              lineHeight: 1.5
            }}>
              <div>🔒 <strong>Khóa mã PIN:</strong> Bạn có thể bật tính năng khóa PIN hoặc sinh trắc học bất kỳ lúc nào trong phần Cài Đặt.</div>
              <div style={{ marginTop: '6px' }}>💾 <strong>Sao lưu:</strong> Dễ dàng xuất/nhập file JSON để chuyển đổi giữa các thiết bị.</div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                style={{ flex: 1, padding: '12px', borderRadius: '14px', border: '1px solid #e0d0d0', background: 'white', cursor: 'pointer' }}
                onClick={() => setStep(4)}
              >
                Quay lại
              </button>
              <button
                type="button"
                style={{
                  flex: 2,
                  padding: '12px',
                  borderRadius: '14px',
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #ff8da1 0%, #ff5e7e 100%)',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 6px 16px rgba(255, 94, 126, 0.35)'
                }}
                onClick={handleFinish}
              >
                Vào Thị Trấn Ngay! 🏡✨
              </button>
            </div>
          </div>
        )}

        {/* SKIP WITH DEMO BUTTON */}
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px dashed #ffd6dc' }}>
          <button
            type="button"
            onClick={onSkipToDemo}
            style={{
              background: 'none',
              border: 'none',
              color: '#a87c84',
              fontSize: '12px',
              fontWeight: 600,
              textDecoration: 'underline',
              cursor: 'pointer'
            }}
          >
            Bỏ qua &amp; Dùng Dữ Liệu Mẫu (Demo Mode)
          </button>
        </div>
      </div>
    </div>
  )
}
