import React, { useState, useEffect } from 'react';
import StudentForm from './components/StudentForm';
import InterventionForm from './components/InterventionForm';
import ProgressForm from './components/ProgressForm';
import ProgressGraph from './components/ProgressGraph';
import { Student, Intervention, Assignment, ProgressData } from './types';
import { BookOpen, RefreshCw } from 'lucide-react';
import logoImage from './assets/logo.png';

const App: React.FC = () => {
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
      fetch('/src/mockStudentData.json')
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
      const response = await fetch('/src/mockStudentData.json');
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
    <div className="min-h-screen bg-[#D7CDBE] p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <BookOpen className="text-[#6CA18A] mr-2" size={32} />
            <h1 className="text-3xl font-bold text-[#25424C]">Intervention Tracking System</h1>
          </div>
          <img src={logoImage} alt="Logo" className="w-16 h-16" />
        </header>

        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-[#25424C]">Dashboard</h2>
          <button
            onClick={simulateNightlyUpdate}
            className="flex items-center bg-[#346780] text-white px-4 py-2 rounded hover:bg-[#7396A9] transition-colors"
          >
            <RefreshCw className="mr-2" size={20} />
            Simulate Nightly Update
          </button>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#25424C]">Select Student</h2>
          <StudentForm onSelectStudent={handleSelectStudent} students={students} />
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#25424C]">Assign Intervention</h2>
          <InterventionForm
            selectedStudent={selectedStudent}
            interventions={interventions}
            onAssignIntervention={handleAssignIntervention}
          />
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#25424C]">Add Progress Data</h2>
          <ProgressForm assignments={assignments} onAddProgress={handleAddProgress} />
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-[#25424C]">Progress Graph</h2>
          <ProgressGraph assignments={assignments} progressData={progressData} />
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4 text-[#25424C]">Current Data</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <h3 className="text-lg font-medium mb-2 text-[#25424C]">Students</h3>
              <ul className="list-disc pl-5">
                {students.map((student) => (
                  <li key={student.id} className="text-[#25424C]">{student.name}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2 text-[#25424C]">Assignments</h3>
              <ul className="list-disc pl-5">
                {assignments.map((assignment) => (
                  <li key={assignment.id} className="text-[#25424C]">
                    Student {assignment.studentId} - Intervention {assignment.interventionId}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2 text-[#25424C]">Progress Data</h3>
              <ul className="list-disc pl-5">
                {progressData.map((progress) => (
                  <li key={progress.id} className="text-[#25424C]">
                    Assignment {progress.assignmentId} - Score: {progress.score}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default App;