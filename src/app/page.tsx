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
    <div className="w-full">
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <BookOpen size={24} className="text-[#6CA18A] mr-2" />
          <h1 className="m-0">Intervention Tracking System</h1>
        </div>
        <Image 
          src="/logo.png" 
          alt="Logo" 
          width={48} 
          height={48}
          priority
          unoptimized
        />
      </header>

      <div className="flex items-center justify-between mb-8">
        <h2 className="m-0">Dashboard</h2>
        <button onClick={simulateNightlyUpdate} className="update-button">
          <RefreshCw size={16} />
          Simulate Nightly Update
        </button>
      </div>

      <section className="mb-8 w-full">
        <h2>Select Student</h2>
        <p className="note">Note: In a full implementation, student data would be managed by an administrator or fetched from a school database.</p>
        <StudentForm onSelectStudent={handleSelectStudent} students={students} />
      </section>

      <section className="mb-8 w-full">
        <h2>Assign Intervention</h2>
        <InterventionForm
          selectedStudent={selectedStudent}
          interventions={interventions}
          onAssignIntervention={handleAssignIntervention}
        />
      </section>

      <section className="mb-8 w-full">
        <h2>Add Progress Data</h2>
        <ProgressForm assignments={assignments} onAddProgress={handleAddProgress} />
      </section>

      <section className="mb-8 w-full">
        <h2>Progress Graph</h2>
        <div className="w-full aspect-[2/1] bg-gray-50 rounded-lg p-4">
          <ProgressGraph assignments={assignments} progressData={progressData} />
        </div>
      </section>

      <section className="w-full">
        <h2>Current Data</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3>Students</h3>
            <ul className="space-y-2">
              {students.map((student) => (
                <li key={student.id}>{student.name}</li>
              ))}
            </ul>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3>Assignments</h3>
            <ul className="space-y-2">
              {assignments.map((assignment) => (
                <li key={assignment.id}>
                  Student {assignment.studentId} - Intervention {assignment.interventionId}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3>Progress Data</h3>
            <ul className="space-y-2">
              {progressData.map((progress) => (
                <li key={progress.id}>
                  Assignment {progress.assignmentId} - Score: {progress.score}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
