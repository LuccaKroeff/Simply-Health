import { PATIENTS } from '../data/patients'

interface Props {
  value: string
  onChange: (id: string) => void
  disabled: boolean
}

export default function PatientSelector({ value, onChange, disabled }: Props) {
  return (
    <div>
      <p className="section-label">Paciente</p>
      <div className="patient-cards">
        {PATIENTS.map(p => (
          <button
            key={p.id}
            type="button"
            className={`patient-card${value === p.id ? ' selected' : ''}`}
            onClick={() => onChange(p.id)}
            disabled={disabled}
          >
            <div className="patient-avatar">
              <img src={p.avatar} alt={p.name} />
            </div>
            <div className="patient-info">
              <strong className="patient-name">{p.name}</strong>
              <span className="patient-age">{p.age} anos</span>
              <div className="patient-badges">
                <span className="patient-badge">{p.educationLabel}</span>
                <span className={`patient-badge literacy-${p.literacyLevel}`}>{p.literacyLabel}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
