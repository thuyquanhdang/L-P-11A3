import React, { useState, useEffect } from 'react';
import { 
  ActiveTab, 
  Student, 
  AttendanceRecord, 
  ViolationRecord, 
  RewardRecord, 
  ConductEvaluation, 
  ParentContact, 
  PolicyDocumentItem, 
  ClassInfo 
} from './types';

import { 
  getInitialAppState, 
  saveToStorage, 
  STORAGE_KEYS, 
  resetAllDataToDefault 
} from './utils/storage';

import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { StudentsView } from './components/StudentsView';
import { AttendanceView } from './components/AttendanceView';
import { ViolationsView } from './components/ViolationsView';
import { RewardsView } from './components/RewardsView';
import { ConductView } from './components/ConductView';
import { ParentsView } from './components/ParentsView';
import { PoliciesView } from './components/PoliciesView';
import { ReportsView } from './components/ReportsView';
import { AIAssistantView } from './components/AIAssistantView';
import { SettingsView } from './components/SettingsView';

export default function App() {
  // Navigation tab state
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<Student | null>(null);

  // App Domain State loaded from localStorage
  const [initialData] = useState(() => getInitialAppState());
  
  const [classInfo, setClassInfo] = useState<ClassInfo>(initialData.classInfo);
  const [students, setStudents] = useState<Student[]>(initialData.students);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(initialData.attendance);
  const [violations, setViolations] = useState<ViolationRecord[]>(initialData.violations);
  const [rewards, setRewards] = useState<RewardRecord[]>(initialData.rewards);
  const [conduct, setConduct] = useState<ConductEvaluation[]>(initialData.conduct);
  const [parents, setParents] = useState<ParentContact[]>(initialData.parents);
  const [policies, setPolicies] = useState<PolicyDocumentItem[]>(initialData.policies);

  // Auto-sync state to localStorage whenever it changes
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.CLASS_INFO, classInfo);
  }, [classInfo]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.STUDENTS, students);
  }, [students]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.ATTENDANCE, attendance);
  }, [attendance]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.VIOLATIONS, violations);
  }, [violations]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.REWARDS, rewards);
  }, [rewards]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.CONDUCT, conduct);
  }, [conduct]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PARENTS, parents);
  }, [parents]);

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.POLICIES, policies);
  }, [policies]);

  // Counts for sidebar badges
  const sidebarCounts = {
    students: students.length,
    violations: violations.filter(v => !v.resolved).length,
    rewards: rewards.length,
    attentionStudents: students.filter(s => s.needsAttention).length,
    pendingPolicies: policies.filter(p => !p.submitted).length
  };

  // Student Handlers
  const handleAddStudent = (newStudent: Student) => {
    setStudents(prev => [newStudent, ...prev]);
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents(prev => prev.map(s => s.id === updatedStudent.id ? updatedStudent : s));
  };

  const handleDeleteStudent = (studentId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa học sinh này khỏi danh sách lớp?')) {
      setStudents(prev => prev.filter(s => s.id !== studentId));
      setViolations(prev => prev.filter(v => v.studentId !== studentId));
      setRewards(prev => prev.filter(r => r.studentId !== studentId));
      setParents(prev => prev.filter(p => p.studentId !== studentId));
      setPolicies(prev => prev.filter(p => p.studentId !== studentId));
    }
  };

  // Attendance Handlers
  const handleSaveAttendance = (record: AttendanceRecord) => {
    setAttendance(prev => {
      const idx = prev.findIndex(a => a.date === record.date);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = record;
        return next;
      }
      return [record, ...prev];
    });
  };

  // Violations Handlers
  const handleAddViolation = (v: ViolationRecord) => {
    setViolations(prev => [v, ...prev]);
  };

  const handleUpdateViolation = (v: ViolationRecord) => {
    setViolations(prev => prev.map(item => item.id === v.id ? v : item));
  };

  const handleDeleteViolation = (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bản ghi vi phạm này?')) {
      setViolations(prev => prev.filter(item => item.id !== id));
    }
  };

  // Rewards Handlers
  const handleAddReward = (r: RewardRecord) => {
    setRewards(prev => [r, ...prev]);
  };

  const handleUpdateReward = (r: RewardRecord) => {
    setRewards(prev => prev.map(item => item.id === r.id ? r : item));
  };

  const handleDeleteReward = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa bản ghi khen thưởng này?')) {
      setRewards(prev => prev.filter(item => item.id !== id));
    }
  };

  // Conduct Handlers
  const handleUpdateConduct = (newConduct: ConductEvaluation[]) => {
    setConduct(newConduct);
  };

  // Parent Contacts Handlers
  const handleAddContact = (c: ParentContact) => {
    setParents(prev => [c, ...prev]);
  };

  const handleUpdateContact = (c: ParentContact) => {
    setParents(prev => prev.map(item => item.id === c.id ? c : item));
  };

  const handleDeleteContact = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa nhật ký trao đổi này?')) {
      setParents(prev => prev.filter(item => item.id !== id));
    }
  };

  // Policy Handlers
  const handleAddPolicy = (p: PolicyDocumentItem) => {
    setPolicies(prev => [p, ...prev]);
  };

  const handleUpdatePolicy = (p: PolicyDocumentItem) => {
    setPolicies(prev => prev.map(item => item.id === p.id ? p : item));
  };

  const handleDeletePolicy = (id: string) => {
    if (window.confirm('Bạn có chắc muốn xóa hồ sơ chế độ này?')) {
      setPolicies(prev => prev.filter(item => item.id !== id));
    }
  };

  // Backup and Restore
  const handleExportData = () => {
    const backup = {
      version: '1.0',
      exportDate: new Date().toISOString(),
      classInfo,
      students,
      attendance,
      violations,
      rewards,
      conduct,
      parents,
      policies
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `tro_ly_chu_nhiem_${classInfo.className}_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportData = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);
        if (parsed.students && Array.isArray(parsed.students)) {
          if (parsed.classInfo) setClassInfo(parsed.classInfo);
          if (parsed.students) setStudents(parsed.students);
          if (parsed.attendance) setAttendance(parsed.attendance);
          if (parsed.violations) setViolations(parsed.violations);
          if (parsed.rewards) setRewards(parsed.rewards);
          if (parsed.conduct) setConduct(parsed.conduct);
          if (parsed.parents) setParents(parsed.parents);
          if (parsed.policies) setPolicies(parsed.policies);
          alert('Khôi phục dữ liệu từ tệp thành công!');
        } else {
          alert('Tệp dữ liệu không hợp lệ!');
        }
      } catch (err) {
        alert('Lỗi đọc tệp JSON: ' + err);
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    const defaults = resetAllDataToDefault();
    setClassInfo(defaults.classInfo);
    setStudents(defaults.students);
    setAttendance(defaults.attendance);
    setViolations(defaults.violations);
    setRewards(defaults.rewards);
    setConduct(defaults.conduct);
    setParents(defaults.parents);
    setPolicies(defaults.policies);
  };

  const handleSaveAllChanges = () => {
    saveToStorage(STORAGE_KEYS.CLASS_INFO, classInfo);
    saveToStorage(STORAGE_KEYS.STUDENTS, students);
    saveToStorage(STORAGE_KEYS.ATTENDANCE, attendance);
    saveToStorage(STORAGE_KEYS.VIOLATIONS, violations);
    saveToStorage(STORAGE_KEYS.REWARDS, rewards);
    saveToStorage(STORAGE_KEYS.CONDUCT, conduct);
    saveToStorage(STORAGE_KEYS.PARENTS, parents);
    saveToStorage(STORAGE_KEYS.POLICIES, policies);
  };

  return (
    <div className="flex h-screen bg-slate-100/90 text-slate-800 antialiased overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        classInfo={classInfo}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        counts={sidebarCounts}
      />

      {/* Main App Canvas */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Sticky Header */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          classInfo={classInfo}
          onSaveAllChanges={handleSaveAllChanges}
        />

        {/* Dynamic Views Viewport */}
        <main className="flex-1 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView
              students={students}
              violations={violations}
              rewards={rewards}
              attendance={attendance}
              conduct={conduct}
              classInfo={classInfo}
              setActiveTab={setActiveTab}
              onSelectStudent={(st) => {
                setSelectedStudentForModal(st);
                setActiveTab('students');
              }}
            />
          )}

          {activeTab === 'students' && (
            <StudentsView
              students={students}
              classInfo={classInfo}
              violations={violations}
              rewards={rewards}
              attendance={attendance}
              conduct={conduct}
              parents={parents}
              policies={policies}
              onAddStudent={handleAddStudent}
              onUpdateStudent={handleUpdateStudent}
              onDeleteStudent={handleDeleteStudent}
              initialSelectedStudent={selectedStudentForModal}
              onClearInitialSelected={() => setSelectedStudentForModal(null)}
            />
          )}

          {activeTab === 'attendance' && (
            <AttendanceView
              students={students}
              attendance={attendance}
              classInfo={classInfo}
              onSaveAttendance={handleSaveAttendance}
            />
          )}

          {activeTab === 'violations' && (
            <ViolationsView
              students={students}
              violations={violations}
              onAddViolation={handleAddViolation}
              onUpdateViolation={handleUpdateViolation}
              onDeleteViolation={handleDeleteViolation}
            />
          )}

          {activeTab === 'rewards' && (
            <RewardsView
              students={students}
              rewards={rewards}
              onAddReward={handleAddReward}
              onUpdateReward={handleUpdateReward}
              onDeleteReward={handleDeleteReward}
            />
          )}

          {activeTab === 'conduct' && (
            <ConductView
              students={students}
              conduct={conduct}
              onUpdateConduct={handleUpdateConduct}
            />
          )}

          {activeTab === 'parents' && (
            <ParentsView
              students={students}
              parents={parents}
              onAddContact={handleAddContact}
              onUpdateContact={handleUpdateContact}
              onDeleteContact={handleDeleteContact}
            />
          )}

          {activeTab === 'policies' && (
            <PoliciesView
              students={students}
              policies={policies}
              onAddPolicy={handleAddPolicy}
              onUpdatePolicy={handleUpdatePolicy}
              onDeletePolicy={handleDeletePolicy}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              students={students}
              violations={violations}
              rewards={rewards}
              attendance={attendance}
              conduct={conduct}
              classInfo={classInfo}
            />
          )}

          {activeTab === 'ai-assistant' && (
            <AIAssistantView
              classInfo={classInfo}
              students={students}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              classInfo={classInfo}
              onUpdateClassInfo={setClassInfo}
              onResetData={handleResetData}
              onExportData={handleExportData}
              onImportData={handleImportData}
            />
          )}
        </main>
      </div>
    </div>
  );
}
