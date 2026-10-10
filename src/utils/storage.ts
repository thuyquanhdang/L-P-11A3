import { 
  Student, 
  AttendanceRecord, 
  ViolationRecord, 
  RewardRecord, 
  ConductEvaluation, 
  ParentContact, 
  PolicyDocumentItem, 
  ClassInfo,
  ChatMessage
} from '../types';

import { 
  INITIAL_CLASS_INFO, 
  INITIAL_STUDENTS, 
  INITIAL_ATTENDANCE, 
  INITIAL_VIOLATIONS, 
  INITIAL_REWARDS, 
  INITIAL_CONDUCT_EVALUATIONS, 
  INITIAL_PARENT_CONTACTS, 
  INITIAL_POLICY_DOCUMENTS 
} from '../mockData';

const STORAGE_KEYS = {
  CLASS_INFO: 'tro_ly_cn_11a3_class_info',
  STUDENTS: 'tro_ly_cn_11a3_students',
  ATTENDANCE: 'tro_ly_cn_11a3_attendance',
  VIOLATIONS: 'tro_ly_cn_11a3_violations',
  REWARDS: 'tro_ly_cn_11a3_rewards',
  CONDUCT: 'tro_ly_cn_11a3_conduct',
  PARENTS: 'tro_ly_cn_11a3_parents',
  POLICIES: 'tro_ly_cn_11a3_policies',
  AI_CHAT: 'tro_ly_cn_11a3_ai_chat',
};

export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error(`Error loading ${key} from storage:`, e);
  }
  return defaultValue;
};

export const saveToStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
};

export const getInitialAppState = () => {
  const loadedClass = loadFromStorage<ClassInfo>(STORAGE_KEYS.CLASS_INFO, INITIAL_CLASS_INFO);
  const loadedStudents = loadFromStorage<Student[]>(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);

  // If previous cached data does not have 38 students or missing fields, reset to new rich 11A3 dataset
  if (!loadedClass || loadedClass.className !== '11A3' || !loadedStudents || loadedStudents.length !== 38 || !loadedStudents[0]?.dob || !loadedStudents[0]?.subjectScores) {
    return {
      classInfo: INITIAL_CLASS_INFO,
      students: INITIAL_STUDENTS,
      attendance: INITIAL_ATTENDANCE,
      violations: INITIAL_VIOLATIONS,
      rewards: INITIAL_REWARDS,
      conduct: INITIAL_CONDUCT_EVALUATIONS,
      parents: INITIAL_PARENT_CONTACTS,
      policies: INITIAL_POLICY_DOCUMENTS,
      chatMessages: [],
    };
  }

  return {
    classInfo: loadedClass,
    students: loadedStudents,
    attendance: loadFromStorage<AttendanceRecord[]>(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE),
    violations: loadFromStorage<ViolationRecord[]>(STORAGE_KEYS.VIOLATIONS, INITIAL_VIOLATIONS),
    rewards: loadFromStorage<RewardRecord[]>(STORAGE_KEYS.REWARDS, INITIAL_REWARDS),
    conduct: loadFromStorage<ConductEvaluation[]>(STORAGE_KEYS.CONDUCT, INITIAL_CONDUCT_EVALUATIONS),
    parents: loadFromStorage<ParentContact[]>(STORAGE_KEYS.PARENTS, INITIAL_PARENT_CONTACTS),
    policies: loadFromStorage<PolicyDocumentItem[]>(STORAGE_KEYS.POLICIES, INITIAL_POLICY_DOCUMENTS),
    chatMessages: loadFromStorage<ChatMessage[]>(STORAGE_KEYS.AI_CHAT, []),
  };
};

export const resetAllDataToDefault = () => {
  localStorage.removeItem(STORAGE_KEYS.CLASS_INFO);
  localStorage.removeItem(STORAGE_KEYS.STUDENTS);
  localStorage.removeItem(STORAGE_KEYS.ATTENDANCE);
  localStorage.removeItem(STORAGE_KEYS.VIOLATIONS);
  localStorage.removeItem(STORAGE_KEYS.REWARDS);
  localStorage.removeItem(STORAGE_KEYS.CONDUCT);
  localStorage.removeItem(STORAGE_KEYS.PARENTS);
  localStorage.removeItem(STORAGE_KEYS.POLICIES);
  localStorage.removeItem(STORAGE_KEYS.AI_CHAT);
  
  return {
    classInfo: INITIAL_CLASS_INFO,
    students: INITIAL_STUDENTS,
    attendance: INITIAL_ATTENDANCE,
    violations: INITIAL_VIOLATIONS,
    rewards: INITIAL_REWARDS,
    conduct: INITIAL_CONDUCT_EVALUATIONS,
    parents: INITIAL_PARENT_CONTACTS,
    policies: INITIAL_POLICY_DOCUMENTS,
    chatMessages: [],
  };
};

export { STORAGE_KEYS };
