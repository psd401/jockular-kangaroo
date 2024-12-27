import React, { useState, useEffect } from 'react';
import { Intervention, Student } from '../types';

interface InterventionFormProps {
  selectedStudent: Student | null;
  interventions: Intervention[];
  onAssignIntervention: (assignment: { studentId: string; interventionId: string; startDate: string; endDate: string; frequency: string; goal: string; baseline: number }) => void;
}

const InterventionForm: React.FC<InterventionFormProps> = ({ selectedStudent, interventions, onAssignIntervention }) => {
  const [interventionId, setInterventionId] = useState('');
  const [customIntervention, setCustomIntervention] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [frequency, setFrequency] = useState('');
  const [goal, setGoal] = useState('');
  const [baseline, setBaseline] = useState('');

  useEffect(() => {
    if (startDate) {
      const start = new Date(startDate);
      const end = new Date(start.setDate(start.getDate() + 42)); // 6 weeks later
      setEndDate(end.toISOString().split('T')[0]);
    }
  }, [startDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStudent && (interventionId || customIntervention) && startDate && endDate && frequency && goal && baseline) {
      onAssignIntervention({
        studentId: selectedStudent.id,
        interventionId: interventionId === 'custom' ? customIntervention : interventionId,
        startDate,
        endDate,
        frequency,
        goal,
        baseline: Number(baseline)
      });
      setInterventionId('');
      setCustomIntervention('');
      setStartDate('');
      setEndDate('');
      setFrequency('');
      setGoal('');
      setBaseline('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {selectedStudent && (
        <div style={{ marginBottom: '8px' }}>
          Selected Student: {selectedStudent.name} (ID: {selectedStudent.id})
        </div>
      )}
      
      <div>
        <select
          value={interventionId}
          onChange={(e) => setInterventionId(e.target.value)}
          style={{ width: '100%', marginBottom: '8px' }}
        >
          <option value="">Select Intervention</option>
          {interventions.map((intervention) => (
            <option key={intervention.id} value={intervention.id}>
              {intervention.name}
            </option>
          ))}
          <option value="custom">Custom</option>
        </select>

        {interventionId === 'custom' && (
          <div style={{ marginBottom: '8px' }}>
            <input
              type="text"
              value={customIntervention}
              onChange={(e) => setCustomIntervention(e.target.value)}
              placeholder="Enter custom intervention"
              style={{ width: '100%' }}
            />
          </div>
        )}

        <div className="form-row">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="text"
            value={frequency}
            onChange={(e) => setFrequency(e.target.value)}
            placeholder="Frequency (e.g., 3 times"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            readOnly
          />
        </div>

        <div style={{ marginBottom: '8px' }}>
          <input
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Goal (e.g., Improve reading fluency by 20 words per minute)"
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ marginBottom: '8px' }}>
          <input
            type="number"
            value={baseline}
            onChange={(e) => setBaseline(e.target.value)}
            placeholder="Baseline score"
            style={{ width: '100%' }}
          />
        </div>

        <button type="submit" className="assign-intervention">
          Assign Intervention
        </button>
      </div>
    </form>
  );
};

export default InterventionForm;