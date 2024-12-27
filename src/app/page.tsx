'use client';

import React, { useState, useEffect } from 'react';
import StudentForm from '../components/StudentForm';
import InterventionForm from '../components/InterventionForm';
import ProgressForm from '../components/ProgressForm';
import ProgressGraph from '../components/ProgressGraph';
import { Student, Intervention, Assignment, ProgressData } from '../types';
import { BookOpen, RefreshCw } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [interventions, setInterventions] = useState<Intervention[]>([
    { id: '1', name: 'Phonics' },
    { id: '2', name: 'Fluency' },
    { id: '3', name: 'Comprehension' },
  ]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [progressData, setProgressData] = useState<ProgressData[]>([]);

  useEffect(() => {
    const storedStudents = localStorage.getItem('students');
    if (storedStudents) {
      setStudents(JSON.parse(storedStudents));
    } else {
      // Load demo students if no stored students
      fetch('/mockStudentData.json')
        .then(response => response.json())
        .then(data => {
          setStudents(data.students);
          localStorage.setItem('students', JSON.stringify(data.students));
        })
        .catch(error => console.error('Error loading demo students:', error));
    }
  }, []);

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
  };

  const handleAssignIntervention = (assignment: Omit<Assignment, 'id'>) => {
    const newAssignment: Assignment = { ...assignment, id: Date.now().toString() };
    setAssignments([...assignments, newAssignment]);
  };

  const handleAddProgress = (progress: Omit<ProgressData, 'id'>) => {
    const newProgress: ProgressData = { ...progress, id: Date.now().toString() };
    setProgressData([...progressData, newProgress]);
  };

  const simulateNightlyUpdate = async () => {
    try {
      const response = await fetch('/mockStudentData.json');
      const data = await response.json();
      setStudents(data.students);
      localStorage.setItem('students', JSON.stringify(data.students));
      alert('Student data updated successfully!');
    } catch (error) {
      console.error('Error updating student data:', error);
      alert('Failed to update student data. Please try again.');
    }
  };

  return (
    <div className="container">
      <div style={{ marginBottom: '20px' }}>
        <BookOpen size={24} style={{ display: 'inline-block', marginRight: '8px', color: '#6CA18A' }} />
        <h1 style={{ display: 'inline-block', margin: 0 }}>Intervention Tracking System</h1>
        <Image 
          src="/logo.png" 
          alt="Logo" 
          width={48} 
          height={48} 
          style={{ float: 'right' }} 
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ display: 'inline-block', margin: 0 }}>Dashboard</h2>
        <button onClick={simulateNightlyUpdate} className="update-button" style={{ float: 'right' }}>
          <RefreshCw size={16} />
          Simulate Nightly Update
        </button>
      </div>

      <div style={{ clear: 'both', marginBottom: '20px' }}>
        <h2>Select Student</h2>
        <StudentForm onSelectStudent={handleSelectStudent} students={students} />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Assign Intervention</h2>
        <InterventionForm
          selectedStudent={selectedStudent}
          interventions={interventions}
          onAssignIntervention={handleAssignIntervention}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Add Progress Data</h2>
        <ProgressForm assignments={assignments} onAddProgress={handleAddProgress} />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2>Progress Graph</h2>
        <ProgressGraph assignments={assignments} progressData={progressData} />
      </div>

      <div>
        <h2>Current Data</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
          <div>
            <h3>Students</h3>
            <ul>
              {students.map((student) => (
                <li key={student.id}>{student.name}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Assignments</h3>
            <ul>
              {assignments.map((assignment) => (
                <li key={assignment.id}>
                  Student {assignment.studentId} - Intervention {assignment.interventionId}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Progress Data</h3>
            <ul>
              {progressData.map((progress) => (
                <li key={progress.id}>
                  Assignment {progress.assignmentId} - Score: {progress.score}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
