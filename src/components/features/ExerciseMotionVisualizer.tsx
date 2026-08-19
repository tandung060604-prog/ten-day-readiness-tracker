type Props = {
  exerciseName: string
}

export function ExerciseMotionVisualizer({ exerciseName }: Props) {
  const nameLower = exerciseName.toLowerCase()

  // Match exercise type
  let type: 'squat' | 'bridge' | 'deadbug' | 'hip90' | 'catcow' | 'pigeon' | 'kegel' | 'general' = 'general'
  if (nameLower.includes('squat')) type = 'squat'
  else if (nameLower.includes('bridge') || nameLower.includes('glute')) type = 'bridge'
  else if (nameLower.includes('deadbug') || nameLower.includes('dead bug')) type = 'deadbug'
  else if (nameLower.includes('90/90') || nameLower.includes('hip')) type = 'hip90'
  else if (nameLower.includes('cat') || nameLower.includes('cow')) type = 'catcow'
  else if (nameLower.includes('pigeon')) type = 'pigeon'
  else if (nameLower.includes('kegel') || nameLower.includes('sàn chậu')) type = 'kegel'

  return (
    <div className="motion-visualizer-container">
      <div className={`motion-canvas-box motion-type-${type}`}>
        {type === 'squat' && (
          <svg viewBox="0 0 200 160" className="motion-svg">
            <g className="anim-squat">
              {/* Head */}
              <circle cx="100" cy="35" r="12" fill="var(--primary)" />
              {/* Torso */}
              <line x1="100" y1="47" x2="100" y2="85" stroke="var(--primary)" strokeWidth="6" strokeLinecap="round" />
              {/* Arms */}
              <line x1="100" y1="58" x2="135" y2="58" stroke="var(--blue)" strokeWidth="4" strokeLinecap="round" />
              {/* Legs */}
              <polyline points="100,85 85,115 80,145" stroke="var(--text)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
              <polyline points="100,85 115,115 120,145" stroke="var(--text)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            </g>
            {/* Ground */}
            <line x1="30" y1="148" x2="170" y2="148" stroke="var(--line)" strokeWidth="3" strokeLinecap="round" />
          </svg>
        )}

        {type === 'bridge' && (
          <svg viewBox="0 0 200 160" className="motion-svg">
            <g className="anim-bridge">
              {/* Ground & Mat */}
              <line x1="20" y1="125" x2="180" y2="125" stroke="var(--line)" strokeWidth="3" strokeLinecap="round" />
              {/* Head on floor */}
              <circle cx="50" cy="115" r="10" fill="var(--primary)" />
              {/* Shoulders to hips */}
              <line x1="60" y1="120" x2="105" y2="90" className="bridge-torso" stroke="var(--primary)" strokeWidth="6" strokeLinecap="round" />
              {/* Thigh & Shins */}
              <polyline points="105,90 135,90 145,125" className="bridge-legs" stroke="var(--text)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </svg>
        )}

        {type === 'deadbug' && (
          <svg viewBox="0 0 200 160" className="motion-svg">
            <g className="anim-deadbug">
              {/* Mat */}
              <line x1="30" y1="115" x2="170" y2="115" stroke="var(--line)" strokeWidth="3" strokeLinecap="round" />
              {/* Head on floor */}
              <circle cx="55" cy="105" r="10" fill="var(--primary)" />
              {/* Body */}
              <line x1="65" y1="110" x2="125" y2="110" stroke="var(--primary)" strokeWidth="6" strokeLinecap="round" />
              {/* Left Arm & Right Leg alternating */}
              <line x1="85" y1="110" x2="85" y2="65" className="deadbug-arm1" stroke="var(--blue)" strokeWidth="4" strokeLinecap="round" />
              <polyline points="125,110 125,75 155,75" className="deadbug-leg1" stroke="var(--text)" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          </svg>
        )}

        {type === 'catcow' && (
          <svg viewBox="0 0 200 160" className="motion-svg">
            <g className="anim-catcow">
              {/* Mat */}
              <line x1="20" y1="130" x2="180" y2="130" stroke="var(--line)" strokeWidth="3" strokeLinecap="round" />
              {/* Hands & Knees */}
              <line x1="65" y1="130" x2="65" y2="90" stroke="var(--text)" strokeWidth="5" strokeLinecap="round" />
              <line x1="135" y1="130" x2="135" y2="90" stroke="var(--text)" strokeWidth="5" strokeLinecap="round" />
              {/* Head */}
              <circle cx="50" cy="80" r="10" className="catcow-head" fill="var(--primary)" />
              {/* Spine Arching */}
              <path d="M 65 90 Q 100 65 135 90" className="catcow-spine" fill="none" stroke="var(--primary)" strokeWidth="6" strokeLinecap="round" />
            </g>
          </svg>
        )}

        {(type === 'hip90' || type === 'pigeon' || type === 'general' || type === 'kegel') && (
          <svg viewBox="0 0 200 160" className="motion-svg">
            <g className="anim-pulse-glow">
              <circle cx="100" cy="80" r="45" fill="none" stroke="var(--primary)" strokeWidth="2" strokeDasharray="6 6" />
              <circle cx="100" cy="80" r="32" fill="rgba(78, 225, 170, 0.15)" stroke="var(--primary)" strokeWidth="3" />
              <text x="100" y="85" textAnchor="middle" fill="var(--primary)" fontSize="13" fontWeight="bold">
                {type === 'kegel' ? 'CO · THẢ' : 'FORM CHUẨN'}
              </text>
            </g>
          </svg>
        )}
      </div>

      <div className="motion-caption">
        <span className="motion-live-tag">● Mô phỏng nhịp thở & biên độ</span>
        <small>Giữ thân trên ổn định · Kiểm soát tốc độ 2 giây xuống, 1 giây lên</small>
      </div>
    </div>
  )
}
