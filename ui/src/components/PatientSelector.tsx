interface PatientMeta {
  id: string
  name: string
  age: number
  education: string
}

const PATIENTS: PatientMeta[] = [
  { id: 'patient-1', name: 'Maria Silva',      age: 68, education: 'Fundamental · baixa literacia' },
  { id: 'patient-2', name: 'Carlos Oliveira',  age: 45, education: 'Médio · literacia moderada' },
  { id: 'patient-3', name: 'Ana Souza',        age: 30, education: 'Superior · alta literacia' },
]

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
            <div className="patient-avatar">{p.name[0]}</div>
            <div className="patient-info">
              <strong>{p.name}</strong>
              <span>{p.age} anos</span>
              <span className="patient-education">{p.education}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
