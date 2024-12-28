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
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search student by name or ID"
        className="w-full"
      />
      {search && (
        <div className="border border-gray-200 mt-2 bg-white max-h-[160px] overflow-y-auto rounded-md">
          <ul className="m-0 p-0 list-none">
            {filteredStudents.map((student) => (
              <li 
                key={student.id} 
                onClick={() => handleSelect(student)}
                className="px-4 py-2 cursor-pointer border-b border-gray-100 hover:bg-gray-50 transition-colors"
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