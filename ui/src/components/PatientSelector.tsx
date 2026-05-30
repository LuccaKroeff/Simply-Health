import { PATIENTS } from '../data/patients'

interface Props {
  value: string[]
  onChange: (ids: string[]) => void
  disabled: boolean
}

export default function PatientSelector({ value, onChange, disabled }: Props) {
  function toggle(id: string) {
    onChange(value.includes(id) ? value.filter(v => v !== id) : [...value, id])
  }

  return (
    <div>
      <div className="patient-selector-header">
        <p className="section-label">Paciente</p>
        {value.length > 1 && (
          <span className="patient-selection-hint">{value.length} pacientes — versões serão comparadas</span>
        )}
      </div>
      <div className="patient-cards">
        {PATIENTS.map(p => {
          const selected = value.includes(p.id)
          return (
            <button
              key={p.id}
              type="button"
              className={`patient-card${selected ? ' selected' : ''}`}
              onClick={() => toggle(p.id)}
              disabled={disabled}
            >
              {selected && <span className="patient-check">✓</span>}
              <div className="patient-avatar">
                <img src={p.avatar} alt={p.name} />
              </div>
              <div className="patient-info">
                <strong className="patient-name">{p.name}</strong>
                <span className="patient-age">{p.age} anos</span>
                <div className="patient-chips">
                  <div className="patient-chip">
                    <span className="patient-chip-label">Escolaridade</span>
                    <span className="patient-chip-value">{p.educationLabel}</span>
                  </div>
                  {p.educationAreaLabel && (
                    <div className="patient-chip">
                      <span className="patient-chip-label">Área</span>
                      <span className="patient-chip-value">{p.educationAreaLabel}</span>
                    </div>
                  )}
                  {p.comorbiditiesLabels?.map(label => (
                    <div key={label} className="patient-chip">
                      <span className="patient-chip-label">Comorbidade</span>
                      <span className="patient-chip-value">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
