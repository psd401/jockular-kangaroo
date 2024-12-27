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
    <form onSubmit={handleSubmit} className="mb-4">
      {selectedStudent && (
        <p className="mb-2 text-[#25424C]">Selected Student: {selectedStudent.name} (ID: {selectedStudent.id})</p>
      )}
      <select
        value={interventionId}
        onChange={(e) => setInterventionId(e.target.value)}
        className="border p-2 mr-2 mb-2 w-full bg-white text-[#25424C]"
      >
        <option value="">Select Intervention</option>
        {interventions.map((intervention) => (
          <option key={intervention.id} value={intervention.id}>{intervention.name}</option>
        ))}
        <option value="custom">Custom</option>
      </select>
      {interventionId === 'custom' && (
        <input
          type="text"
          value={customIntervention}
          onChange={(e) => setCustomIntervention(e.target.value)}
          placeholder="Enter custom intervention"
          className="border p-2 mr-2 mb-2 w-full bg-white text-[#25424C]"
        />
      )}
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className="border p-2 mr-2 mb-2 bg-white text-[#25424C]"
      />
      <input
        type="text"
        value={frequency}
        onChange={(e) => setFrequency(e.target.value)}
        placeholder="Frequency (e.g., 3 times per week)"
        className="border p-2 mr-2 mb-2 bg-white text-[#25424C]"
      />
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="border p-2 mr-2 mb-2 bg-white text-[#25424C]"
      />
      <input
        type="text"
        value={goal}
        onChange={(e) => setGoal(e.target.value)}
        placeholder="Goal (e.g., Improve reading fluency by 20 words per minute)"
        className="border p-2 mr-2 mb-2 w-full bg-white text-[#25424C]"
      />
      <input
        type="number"
        value={baseline}
        onChange={(e) => setBaseline(e.target.value)}
        placeholder="Baseline score"
        className="border p-2 mr-2 mb-2 w-full bg-white text-[#25424C]"
      />
      <button type="submit" className="bg-[#5D9068] text-white px-4 py-2 rounded hover:bg-[#466857] transition-colors">
        Assign Intervention
      </button>
    </form>
  );
};

export default InterventionForm;