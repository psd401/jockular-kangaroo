import React, { useState, useEffect } from 'react';
import { Student } from '@/app/types';

interface StudentFormProps {
  onSelectStudent: (student: Student) => void;
  students: Student[];
}

const StudentForm: React.FC<StudentFormProps> = ({ onSelectStudent, students }) => {
  const [search, setSearch] = useState('');
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);

  useEffect(() => {
    const filtered = students.filter(
      student => 
        student.name.toLowerCase().includes(search.toLowerCase()) ||
        student.id.includes(search)
    );
    setFilteredStudents(filtered);
  }, [search, students]);

  const handleSelect = (student: Student) => {
    onSelectStudent(student);
    setSearch('');
  };

  return (
    <div>
      <div style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>
        Note: In a full implementation, student data would be managed by an administrator or fetched from a school database.
      </div>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search student by name or ID"
        style={{ width: '100%' }}
      />
      {search && (
        <div style={{ 
          border: '1px solid #ccc',
          marginTop: '4px',
          background: 'white',
          maxHeight: '160px',
          overflowY: 'auto'
        }}>
          <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
            {filteredStudents.map((student) => (
              <li 
                key={student.id} 
                onClick={() => handleSelect(student)}
                style={{
                  padding: '4px 8px',
                  cursor: 'pointer',
                  borderBottom: '1px solid #eee'
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                {student.name} (ID: {student.id})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StudentForm;