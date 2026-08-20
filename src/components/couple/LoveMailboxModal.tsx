import { useState, useEffect } from 'react'
import { Modal } from '../common/Modal'
import { ChiikawaSVG } from '../common/ChiikawaSVG'
import { coupleStorage } from '../../domain/couple/coupleStorage'
import { audioSystem } from '../../game/systems/GameAudioSystem'
import { triggerConfetti } from '../../utils/confetti'
import type { LoveLetter } from '../../domain/couple/coupleFeatures'

interface LoveMailboxModalProps {
  isOpen: boolean
  onClose: () => void
  onLetterSent?: () => void
}

export function LoveMailboxModal({ isOpen, onClose, onLetterSent }: LoveMailboxModalProps) {
  const [activeTab, setActiveTab] = useState<'inbox' | 'compose'>('inbox')
  const [letters, setLetters] = useState<LoveLetter[]>([])
  const [selectedLetter, setSelectedLetter] = useState<LoveLetter | null>(null)

  // Compose State
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')

  useEffect(() => {
    if (isOpen) {
      const saved = coupleStorage.loadLoveLetters()
      setLetters(saved)
      if (saved.length === 0) {
        // Seed first welcoming letter
        const welcomeLetter: LoveLetter = {
          id: 'letter_welcome',
          sender: 'Bé Chiikawa & Usagi',
          recipient: 'Hai Bạn',
          title: 'Chào mừng đến với Hòm Thư Tình! 💌',
          content: 'Đây là góc nhỏ thiêng liêng để hai bạn gửi gắm những bức thư ngọt ngào, những lời cảm ơn chân thành và những lời hẹn ước tương lai.',
          writtenAt: new Date().toISOString(),
          isOpened: false,
          isFavorite: true
        }
        coupleStorage.saveLoveLetter(welcomeLetter)
        setLetters([welcomeLetter])
      }
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSendLetter = () => {
    if (!title.trim() || !content.trim()) return
    audioSystem.playClick('pop')
    triggerConfetti()

    const newLetter: LoveLetter = {
      id: `letter_${Date.now()}`,
      sender: 'Người Thương',
      recipient: 'Bạn Đời',
      title: title.trim(),
      content: content.trim(),
      writtenAt: new Date().toISOString(),
      isOpened: false,
      isFavorite: false
    }

    coupleStorage.saveLoveLetter(newLetter)
    setLetters(coupleStorage.loadLoveLetters())
    setTitle('')
    setContent('')
    setActiveTab('inbox')
    onLetterSent?.()
  }

  const handleOpenLetter = (letter: LoveLetter) => {
    audioSystem.playClick('pop')
    if (!letter.isOpened) {
      const updated = { ...letter, isOpened: true }
      coupleStorage.saveLoveLetter(updated)
      setLetters(coupleStorage.loadLoveLetters())
      setSelectedLetter(updated)
    } else {
      setSelectedLetter(letter)
    }
  }

  return (
    <Modal title="Hòm Thư Tình (Love Mailbox)" onClose={onClose}>
      <div className="love-mailbox-container">
        {/* Tabs */}
        <div className="mailbox-tabs-row">
          <button
            className={`mail-tab-btn ${activeTab === 'inbox' ? 'active' : ''}`}
            onClick={() => { audioSystem.playClick('soft'); setActiveTab('inbox'); setSelectedLetter(null); }}
          >
            📬 Hộp Thư Đến ({letters.length})
          </button>
          <button
            className={`mail-tab-btn ${activeTab === 'compose' ? 'active' : ''}`}
            onClick={() => { audioSystem.playClick('soft'); setActiveTab('compose'); }}
          >
            ✍️ Viết Thư Mới
          </button>
        </div>

        {activeTab === 'inbox' ? (
          selectedLetter ? (
            /* Letter Detail View */
            <div className="letter-detail-card animate-fade-in">
              <div className="letter-header">
                <ChiikawaSVG character="chiikawa" size={36} />
                <div>
                  <h4>{selectedLetter.title}</h4>
                  <span className="letter-meta">Gửi bởi: {selectedLetter.sender} • {new Date(selectedLetter.writtenAt).toLocaleDateString('vi-VN')}</span>
                </div>
              </div>
              <div className="letter-body-paper">
                <p>{selectedLetter.content}</p>
              </div>
              <button className="back-inbox-btn" onClick={() => setSelectedLetter(null)}>
                ⬅️ Quay Lại Danh Sách Thư
              </button>
            </div>
          ) : (
            /* Letters List */
            <div className="letters-list">
              {letters.map(letter => (
                <div
                  key={letter.id}
                  className={`letter-item-card ${letter.isOpened ? 'opened' : 'unread'}`}
                  onClick={() => handleOpenLetter(letter)}
                >
                  <div className="letter-envelope-icon">
                    {letter.isOpened ? '📜' : '💌'}
                  </div>
                  <div className="letter-info-col">
                    <h4>{letter.title}</h4>
                    <p className="letter-snippet">{letter.content.slice(0, 45)}...</p>
                  </div>
                  <span className="open-tag">{letter.isOpened ? 'Đã đọc' : 'Mới ✨'}</span>
                </div>
              ))}
            </div>
          )
        ) : (
          /* Compose Form */
          <div className="compose-letter-form animate-fade-in">
            <div className="form-group">
              <label>Tiêu đề thư:</label>
              <input
                type="text"
                placeholder="Gửi người thương yêu dấu..."
                value={title}
                onChange={e => setTitle(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label>Nội dung thư tình:</label>
              <textarea
                rows={5}
                placeholder="Viết những lời yêu thương chân thành nhất gửi đến người ấy..."
                value={content}
                onChange={e => setContent(e.target.value)}
              />
            </div>
            <button
              className={`send-letter-btn ${title.trim() && content.trim() ? 'ready animate-bounce-gentle' : 'disabled'}`}
              onClick={handleSendLetter}
              disabled={!title.trim() || !content.trim()}
            >
              💌 Niêm Phong & Gửi Thư
            </button>
          </div>
        )}
      </div>
    </Modal>
  )
}
