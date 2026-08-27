import React, { useState } from 'react';
import { X, LogIn, LogOut, CheckCircle2, ShieldCheck, UserCheck, AlertCircle, Edit3, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { user, student, loading, authError, signInWithGoogle, signOutUser, updateProfileData, clearAuthError } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    rollNo: student.rollNo,
    program: student.program,
    department: student.department,
    hostelRoom: student.hostelRoom || '',
    hostelBlock: student.hostelBlock || '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateProfileData(formData);
    setIsSaving(false);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 animate-fade-in">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 md:p-5 bg-[#2A2C5C] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-base md:text-lg font-bold">Campus Single Sign-On (SSO)</h2>
              <p className="text-xs text-slate-200">Google ID Authentication & Security</p>
            </div>
          </div>
          <button
            onClick={() => {
              clearAuthError();
              onClose();
            }}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 md:p-6 overflow-y-auto flex-1 space-y-4">
          {/* Error Banner */}
          {authError && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-xs text-rose-900 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <div className="flex-1">{authError}</div>
              <button
                onClick={clearAuthError}
                className="text-rose-500 hover:text-rose-700 font-bold px-1"
              >
                ✕
              </button>
            </div>
          )}

          {/* Success Banner */}
          {saveSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-900 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Campus profile synchronized with cloud storage.</span>
            </div>
          )}

          {user ? (
            /* Logged in state */
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-3.5">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-[#2A2C5C]/20 shadow-xs"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-[#2A2C5C] text-white flex items-center justify-center font-bold text-lg">
                    {student.name.charAt(0)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 truncate">
                      {user.displayName || student.name}
                    </h3>
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Google Verified
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 truncate mt-0.5">{user.email}</p>
                  <p className="text-[10px] font-mono text-slate-400 mt-1">
                    UID: {user.uid.slice(0, 14)}...
                  </p>
                </div>
              </div>

              {/* Student info card */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-[#2A2C5C]" />
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Academic Details
                    </h4>
                  </div>
                  <button
                    onClick={() => {
                      setIsEditing(!isEditing);
                      setFormData({
                        rollNo: student.rollNo,
                        program: student.program,
                        department: student.department,
                        hostelRoom: student.hostelRoom || '',
                        hostelBlock: student.hostelBlock || '',
                      });
                    }}
                    className="text-xs font-semibold text-[#2A2C5C] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    {isEditing ? 'Cancel Edit' : 'Edit Details'}
                  </button>
                </div>

                {isEditing ? (
                  <form onSubmit={handleSaveProfile} className="space-y-3 pt-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">
                          Roll Number
                        </label>
                        <input
                          type="text"
                          value={formData.rollNo}
                          onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                          className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium focus:outline-[#2A2C5C]"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">
                          Department
                        </label>
                        <input
                          type="text"
                          value={formData.department}
                          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                          className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium focus:outline-[#2A2C5C]"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">
                          Program
                        </label>
                        <input
                          type="text"
                          value={formData.program}
                          onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                          className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium focus:outline-[#2A2C5C]"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-slate-500 uppercase block mb-1">
                          Hostel Room
                        </label>
                        <input
                          type="text"
                          value={formData.hostelRoom}
                          onChange={(e) => setFormData({ ...formData, hostelRoom: e.target.value })}
                          className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium focus:outline-[#2A2C5C]"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="w-full bg-[#2A2C5C] text-white text-xs font-semibold py-2 rounded-xl hover:bg-[#1E2045] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      {isSaving ? 'Saving to Cloud...' : 'Save & Sync to Cloud'}
                    </button>
                  </form>
                ) : (
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-xl">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase block">Roll No</span>
                      <span className="font-semibold text-slate-800">{student.rollNo}</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase block">Department</span>
                      <span className="font-semibold text-slate-800 truncate block">{student.department}</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase block">Program</span>
                      <span className="font-semibold text-slate-800 truncate block">{student.program}</span>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase block">Hostel Room</span>
                      <span className="font-semibold text-slate-800">{student.hostelRoom || 'Not Allotted'}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Sign out button */}
              <button
                onClick={signOutUser}
                className="w-full bg-slate-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 border border-slate-200 text-slate-700 text-xs font-semibold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Sign Out of Google ID
              </button>
            </div>
          ) : (
            /* Logged out state */
            <div className="space-y-4">
              <div className="text-center py-4 space-y-2">
                <div className="w-16 h-16 bg-[#2A2C5C]/10 text-[#2A2C5C] rounded-2xl mx-auto flex items-center justify-center">
                  <LogIn className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Sign In with Google Account</h3>
                <p className="text-xs text-slate-600 max-w-xs mx-auto">
                  Connect your Google account to automatically synchronize your digital RFID identity, bus passes, and campus workshop registrations.
                </p>
              </div>

              {/* Google Sign-in Action Button */}
              <button
                onClick={signInWithGoogle}
                disabled={loading}
                className="w-full bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs md:text-sm py-3 px-4 rounded-2xl border border-slate-300 shadow-xs hover:shadow-sm transition-all flex items-center justify-center gap-3 cursor-pointer active:scale-98"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google ID</span>
              </button>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <div className="text-[11px] font-semibold text-slate-700 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2A2C5C]" />
                  Protected by Firebase & University Google SSO
                </div>
                <p className="text-[10px] text-slate-500 leading-relaxed">
                  Your academic records and private timetable information remain secured to your university authorization scope.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
