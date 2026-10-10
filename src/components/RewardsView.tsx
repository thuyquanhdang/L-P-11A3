import React, { useState, useMemo } from 'react';
import { 
  Award, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  X, 
  Sparkles, 
  Trophy, 
  Star, 
  Heart, 
  Zap,
  PartyPopper
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Student, RewardRecord, RewardCategory } from '../types';

interface RewardsViewProps {
  students: Student[];
  rewards: RewardRecord[];
  onAddReward: (reward: RewardRecord) => void;
  onUpdateReward: (reward: RewardRecord) => void;
  onDeleteReward: (rewardId: string) => void;
}

const CATEGORY_COLORS: Record<RewardCategory, { bg: string; text: string; border: string }> = {
  'Học tập': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  'Phong trào': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  'Kỷ luật': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  'Việc tốt': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  'Thể thao - Văn nghệ': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
};

export const RewardsView: React.FC<RewardsViewProps> = ({
  students,
  rewards,
  onAddReward,
  onUpdateReward,
  onDeleteReward
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReward, setEditingReward] = useState<RewardRecord | null>(null);

  const [formData, setFormData] = useState<Partial<RewardRecord>>({
    studentId: students[0]?.id || '',
    studentName: students[0]?.fullName || '',
    date: new Date().toISOString().split('T')[0],
    achievement: '',
    content: '',
    category: 'Học tập',
    notes: ''
  });

  const filteredRewards = useMemo(() => {
    return rewards.filter(r => {
      const matchSearch = 
        r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.achievement.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.content.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchCat = filterCategory === 'all' || r.category === filterCategory;
      return matchSearch && matchCat;
    });
  }, [rewards, searchTerm, filterCategory]);

  const handleOpenAdd = () => {
    const firstStudent = students[0];
    setFormData({
      studentId: firstStudent?.id || '',
      studentName: firstStudent?.fullName || '',
      date: new Date().toISOString().split('T')[0],
      achievement: '',
      content: '',
      category: 'Học tập',
      notes: ''
    });
    setEditingReward(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (reward: RewardRecord) => {
    setFormData({ ...reward });
    setEditingReward(reward);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.studentId || !formData.achievement) {
      alert('Vui lòng chọn học sinh và nhập thành tích khen thưởng!');
      return;
    }

    const matchedStudent = students.find(s => s.id === formData.studentId);
    const studentName = matchedStudent ? matchedStudent.fullName : formData.studentName || '';

    if (editingReward) {
      onUpdateReward({
        ...editingReward,
        studentId: formData.studentId!,
        studentName,
        date: formData.date || new Date().toISOString().split('T')[0],
        achievement: formData.achievement || '',
        content: formData.content || '',
        category: (formData.category as RewardCategory) || 'Học tập',
        notes: formData.notes || ''
      });
    } else {
      const newReward: RewardRecord = {
        id: `kt-${Date.now()}`,
        studentId: formData.studentId!,
        studentName,
        date: formData.date || new Date().toISOString().split('T')[0],
        achievement: formData.achievement || '',
        content: formData.content || '',
        category: (formData.category as RewardCategory) || 'Học tập',
        notes: formData.notes || ''
      };
      onAddReward(newReward);

      // Celebrate with confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // ignore
      }
    }

    setIsModalOpen(false);
    setEditingReward(null);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            Bảng Vinh Danh & Khen Thưởng
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 flex items-center gap-1">
              <Trophy className="w-3 h-3 text-amber-500" />
              {rewards.length} thành tích
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Ghi nhận gương học tốt, phong trào thi đua, việc tốt và lan tỏa tinh thần tích cực
          </p>
        </div>

        <button
          id="add-reward-btn"
          onClick={handleOpenAdd}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold transition shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Ghi nhận khen thưởng</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo tên học sinh, giải thưởng, thành tích đạt được..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-hidden"
        >
          <option value="all">Tất cả lĩnh vực</option>
          <option value="Học tập">Học tập (HSG, Olimpic...)</option>
          <option value="Phong trào">Phong trào & Đoàn Đội</option>
          <option value="Việc tốt">Việc tốt (Người tốt việc tốt)</option>
          <option value="Thể thao - Văn nghệ">Thể thao - Văn nghệ</option>
          <option value="Kỷ luật">Nề nếp & Kỷ luật</option>
        </select>
      </div>

      {/* Rewards Grid View & Table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRewards.length === 0 ? (
          <div className="col-span-2 bg-white rounded-2xl p-12 text-center text-slate-400 border border-slate-200">
            Chưa có thành tích khen thưởng nào phù hợp với tìm kiếm.
          </div>
        ) : (
          filteredRewards.map(r => {
            const catStyle = CATEGORY_COLORS[r.category] || CATEGORY_COLORS['Học tập'];
            return (
              <div 
                key={r.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition relative group overflow-hidden"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-3 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold shrink-0 shadow-xs">
                      <Trophy className="w-5 h-5 text-amber-600" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-900 text-sm truncate">
                        {r.achievement}
                      </h3>
                      <p className="text-xs text-slate-600 font-semibold mt-0.5">
                        Học sinh: <span className="text-blue-600 font-bold">{r.studentName}</span>
                      </p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${catStyle.bg} ${catStyle.text} border ${catStyle.border} shrink-0`}>
                    {r.category}
                  </span>
                </div>

                <p className="mt-3 text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {r.content}
                </p>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Ngày tuyên dương: {r.date}
                  </span>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleOpenEdit(r)}
                      className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition"
                      title="Sửa"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteReward(r.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="Xóa"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal Add / Edit Reward */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <PartyPopper className="w-5 h-5 text-emerald-600" />
                {editingReward ? 'Sửa thông tin khen thưởng' : 'Ghi nhận thành tích khen thưởng'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Chọn học sinh tuyên dương <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.studentId}
                  onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-500/20"
                >
                  {students.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ngày khen thưởng</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Lĩnh vực khen thưởng</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as RewardCategory })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="Học tập">Học tập</option>
                    <option value="Phong trào">Phong trào</option>
                    <option value="Việc tốt">Việc tốt</option>
                    <option value="Thể thao - Văn nghệ">Thể thao - Văn nghệ</option>
                    <option value="Kỷ luật">Nề nếp & Kỷ luật</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tên giải thưởng / Danh hiệu <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Giải Nhất HSG Cấp Tỉnh, Nhặt được của rơi trả người đánh mất..."
                  value={formData.achievement}
                  onChange={(e) => setFormData({ ...formData, achievement: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nội dung chi tiết & Hình thức tuyên dương
                </label>
                <textarea
                  rows={3}
                  placeholder="VD: Tuyên dương trước cờ, trao giấy khen và thưởng nóng 200.000đ từ quỹ lớp..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs"
                >
                  {editingReward ? 'Lưu cập nhật' : 'Tuyên dương & Lưu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
