'use client';

import React, { useState, useEffect } from 'react';
import StudentForm from '@/app/components/StudentForm';
import InterventionForm from '@/app/components/InterventionForm';
import ProgressForm from '@/app/components/ProgressForm';
import ProgressGraph from '@/app/components/ProgressGraph';
import { Student, Intervention, Assignment, ProgressData } from '@/app/types';
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
    const loadStudents = async () => {
      try {
        const storedStudents = localStorage.getItem('students');
        if (storedStudents) {
          const parsedStudents = JSON.parse(storedStudents);
          if (!Array.isArray(parsedStudents)) {
            throw new Error('Invalid stored data format');
          }
          setStudents(parsedStudents);
        } else {
          const response = await fetch('/mockStudentData.json');
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          if (!data.students || !Array.isArray(data.students)) {
            throw new Error('Invalid data format');
          }
          setStudents(data.students);
          localStorage.setItem('students', JSON.stringify(data.students));
        }
      } catch (error) {
        console.error('Error loading student data:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        console.error(`Failed to load student data: ${errorMessage}`);
        // Set some default students if everything fails
        const defaultStudents = [
          { id: '1', name: 'Sample Student 1' },
          { id: '2', name: 'Sample Student 2' },
        ];
        setStudents(defaultStudents);
      }
    };

    loadStudents();
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
      console.log('Fetching student data...');
      const response = await fetch(`${window.location.origin}/mockStudentData.json`);
      console.log('Response:', response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Received data:', data);
      if (!data.students || !Array.isArray(data.students)) {
        throw new Error('Invalid data format');
      }
      console.log('Setting students:', data.students);
      
      try {
        localStorage.setItem('students', JSON.stringify(data.students));
      } catch (storageError) {
        console.error('Failed to save to localStorage:', storageError);
        // Continue even if localStorage fails
      }
      
      setStudents(data.students);
      alert('Student data updated successfully!');
    } catch (error) {
      console.error('Error updating student data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      alert(`Failed to update student data: ${errorMessage}`);
    }
  };

  return (
    <div className="container">
      <div style={{ marginBottom: '20px', position: 'relative' }}>
        <BookOpen size={24} style={{ display: 'inline-block', marginRight: '8px', color: '#6CA18A' }} />
        <h1 style={{ display: 'inline-block', margin: 0 }}>Intervention Tracking System</h1>
        <div style={{ position: 'absolute', right: 0, top: 0 }}>
          <Image 
            src="/logo.png" 
            alt="Logo" 
            width={48} 
            height={48}
            priority
            unoptimized
          />
        </div>
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
      <footer style={{ 
        borderTop: '1px solid #eaeaea',
        padding: '20px',
        marginTop: '40px',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px'
      }}>
        <Image 
          src="/kangaroo.jpg" 
          alt="Jockular Kangaroo" 
          width={32} 
          height={32}
          unoptimized
        />
        <span style={{ color: '#666' }}>
          Jockular Kangaroo © {new Date().getFullYear()} Peninsula School District
        </span>
      </footer>
    </div>
  );
}
