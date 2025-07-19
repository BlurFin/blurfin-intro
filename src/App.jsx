import { useState } from 'react'
import './App.css'

function App() {
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const maxLength = 1000

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // 서버리스 함수로 이메일 전송
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message // 줄바꿈 자동 보존됨
        })
      })

      const result = await response.json()

      if (response.ok && result.success) {
        alert('피드백이 성공적으로 전송되었습니다! 감사합니다 🐠')
        setMessage('')
      } else {
        throw new Error(result.message || '전송 실패')
      }
    } catch (error) {
      console.error('이메일 전송 실패:', error)
      alert('전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="app">
      <div className="content">
        <img src="/BlurFin_Logo.png" alt="로고" className="logo" />
        
        <h1 className="service-description">
          물생활하는 사람들이 모여서<br />
          홈 브리딩한 관상어도 사고팔고, 용품도 나누고,<br />
          이야기도 함께 나누는 공간이에요.
        </h1>
        
        <form className="contact-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <div className="char-counter">
              {message.length}/{maxLength}
            </div>
            <textarea
              placeholder="원하는 기능이나 기존 서비스의 불편했던 점을 알려주세요."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="message-input"
              rows="5"
              maxLength={maxLength}
            />
          </div>
          
          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? '전송 중...' : 'BlurFin에게 보내기'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default App
