import React, { useState } from 'react';
import { Assignment, ProgressData } from '@/types';

interface ProgressFormProps {
  assignments: Assignment[];
  onAddProgress: (progress: { assignmentId: string; date: string; score: number }) => void;
}

const ProgressForm: React.FC<ProgressFormProps> = ({ assignments, onAddProgress }) => {
  const [assignmentId, setAssignmentId] = useState('');
  const [date, setDate] = useState('');
  const [score, setScore] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (assignmentId && date && score) {
      onAddProgress({ assignmentId, date, score: Number(score) });
      setAssignmentId('');
      setDate('');
      setScore('');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
      <select
        value={assignmentId}
        onChange={(e) => setAssignmentId(e.target.value)}
        style={{ flex: 1 }}
      >
        <option value="">Select Assignment</option>
        {assignments.map((assignment) => (
          <option key={assignment.id} value={assignment.id}>
            {`Student ${assignment.studentId} - Intervention ${assignment.interventionId}`}
          </option>
        ))}
      </select>

      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        style={{ width: '140px' }}
      />

      <input
        type="text"
        value={score}
        onChange={(e) => setScore(e.target.value)}
        placeholder="Score"
        style={{ width: '100px' }}
      />

      <button type="submit" className="add-progress">
        Add Progress
      </button>
    </form>
  );
};

export default ProgressForm;