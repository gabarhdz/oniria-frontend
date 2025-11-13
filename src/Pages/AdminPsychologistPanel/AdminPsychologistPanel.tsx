import React, { useState, useEffect } from 'react';
import { 
  Users, CheckCircle, XCircle, Clock, AlertTriangle, 
  Search, Filter, Eye, FileText, GraduationCap, 
  Mail, Calendar, Shield, Award, TrendingUp, RefreshCw,
  User, Building, ChevronDown, ChevronUp, Download,
  AlertCircle, Loader2
} from 'lucide-react';
import axios from 'axios';

// ==================== TYPES ====================
interface User {
  id: string;
  username: string;
  email: string;
  profile_pic?: string;
  date_joined: string;
}

interface PsychologistApplication {
  id: string;
  user: User;
  university_name: string;
  professional_description: string;
  credentials_document?: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  reviewed_by?: User;
  reviewed_at?: string;
  rejection_reason?: string;
}

interface Stats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

// ==================== COMPONENTS ====================

// Loading Screen
const LoadingScreen: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-[#1a1f35] via-[#2a3f5f] to-[#4a5d7a] flex items-center justify-center">
    <div className="text-center">
      <Loader2 className="w-16 h-16 text-[#f1b3be] animate-spin mx-auto mb-4" />
      <p className="text-[#ffe0db] text-xl">Cargando panel de administración...</p>
    </div>
  </div>
);

// Stats Card Component
const StatCard: React.FC<{
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
  gradient: string;
}> = ({ icon: Icon, label, value, color, gradient }) => (
  <div className="bg-gradient-to-br from-white/95 via-white/90 to-[#ffe0db]/20 backdrop-blur-xl rounded-2xl border border-[#ffe0db]/20 shadow-lg p-6 hover:scale-105 transition-transform duration-300">
    <div className={`w-12 h-12 bg-gradient-to-r ${gradient} rounded-xl flex items-center justify-center mb-4`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div className="text-3xl font-bold text-[#252c3e] mb-1">{value}</div>
    <div className="text-sm text-[#252c3e]/60">{label}</div>
  </div>
);

// Application Card Component
const ApplicationCard: React.FC<{
  application: PsychologistApplication;
  onView: () => void;
  onReview: (action: 'approve' | 'reject') => void;
}> = ({ application, onView, onReview }) => {
  const [expanded, setExpanded] = useState(false);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-amber-600 bg-amber-500/20';
      case 'approved': return 'text-emerald-600 bg-emerald-500/20';
      case 'rejected': return 'text-red-600 bg-red-500/20';
      default: return 'text-gray-600 bg-gray-500/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock;
      case 'approved': return CheckCircle;
      case 'rejected': return XCircle;
      default: return AlertCircle;
    }
  };

  const StatusIcon = getStatusIcon(application.status);

  return (
    <div className="bg-gradient-to-br from-white/95 via-white/90 to-[#ffe0db]/20 backdrop-blur-xl rounded-3xl border border-[#ffe0db]/20 shadow-lg hover:shadow-2xl transition-all duration-300">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-start space-x-4 flex-1">
            {/* Avatar */}
            <div className="relative">
              {application.user.profile_pic ? (
                <img
                  src={application.user.profile_pic}
                  alt={application.user.username}
                  className="w-16 h-16 rounded-full border-4 border-[#f1b3be]/30 object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#9675bc] to-[#f1b3be] flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {application.user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h3 className="text-xl font-bold text-[#252c3e]">
                {application.user.username}
              </h3>
              <div className="flex flex-wrap gap-2 mt-2">
                <div className="flex items-center space-x-1 text-sm text-[#252c3e]/70">
                  <Mail className="w-4 h-4" />
                  <span>{application.user.email}</span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-[#252c3e]/70">
                  <Building className="w-4 h-4" />
                  <span>{application.university_name || 'Sin universidad'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${getStatusColor(application.status)}`}>
            <StatusIcon className="w-4 h-4" />
            <span className="font-semibold capitalize">{application.status}</span>
          </div>
        </div>

        {/* Description Preview */}
        <div className="mb-4">
          <p className={`text-sm text-[#252c3e]/70 ${expanded ? '' : 'line-clamp-2'}`}>
            {application.professional_description}
          </p>
          {application.professional_description.length > 100 && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-[#9675bc] text-sm font-medium mt-1 hover:underline flex items-center space-x-1"
            >
              <span>{expanded ? 'Ver menos' : 'Ver más'}</span>
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Dates */}
        <div className="flex items-center space-x-4 text-xs text-[#252c3e]/60 mb-4">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>Solicitud: {new Date(application.created_at).toLocaleDateString('es-ES')}</span>
          </div>
          {application.status !== 'pending' && (
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>Revisado: {new Date(application.updated_at).toLocaleDateString('es-ES')}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        {application.status === 'pending' ? (
          <div className="flex gap-3">
            <button
              onClick={onView}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-[#9675bc]/10 hover:bg-[#9675bc]/20 rounded-xl text-[#9675bc] font-medium transition-all duration-300"
            >
              <Eye className="w-4 h-4" />
              <span>Ver Detalles</span>
            </button>
            <button
              onClick={() => onReview('approve')}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Aprobar</span>
            </button>
            <button
              onClick={() => onReview('reject')}
              className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-xl text-white font-medium transition-all duration-300 hover:scale-105"
            >
              <XCircle className="w-4 h-4" />
              <span>Rechazar</span>
            </button>
          </div>
        ) : (
          <button
            onClick={onView}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-[#9675bc]/10 hover:bg-[#9675bc]/20 rounded-xl text-[#9675bc] font-medium transition-all duration-300"
          >
            <Eye className="w-4 h-4" />
            <span>Ver Detalles</span>
          </button>
        )}
      </div>
    </div>
  );
};

// Review Modal Component
const ReviewModal: React.FC<{
  application: PsychologistApplication | null;
  action: 'approve' | 'reject' | null;
  onClose: () => void;
  onConfirm: (notes: string) => void;
}> = ({ application, action, onClose, onConfirm }) => {
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!application || !action) return null;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await onConfirm(notes);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-gradient-to-br from-[#252c3e]/95 via-[#214d72]/90 to-[#252c3e]/95 backdrop-blur-2xl rounded-3xl p-8 max-w-2xl w-full border border-[#ffe0db]/20 shadow-2xl animate-scale-in">
        <div className="text-center space-y-6">
          {/* Icon */}
          <div className={`w-20 h-20 ${action === 'approve' ? 'bg-emerald-500/20' : 'bg-red-500/20'} rounded-full flex items-center justify-center mx-auto`}>
            {action === 'approve' ? (
              <CheckCircle className="w-10 h-10 text-emerald-400" />
            ) : (
              <XCircle className="w-10 h-10 text-red-400" />
            )}
          </div>

          {/* Title */}
          <div>
            <h3 className="text-2xl font-bold text-[#ffe0db] mb-2">
              {action === 'approve' ? '¿Aprobar Solicitud?' : '¿Rechazar Solicitud?'}
            </h3>
            <p className="text-[#ffe0db]/70">
              {action === 'approve' 
                ? `Al aprobar, ${application.user.username} se convertirá en psicólogo certificado.`
                : `Al rechazar, ${application.user.username} podrá volver a solicitar en el futuro.`
              }
            </p>
          </div>

          {/* Application Details */}
          <div className="bg-[#ffe0db]/10 rounded-2xl p-4 text-left">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-[#ffe0db]/80">
                <User className="w-4 h-4" />
                <span className="font-semibold">Usuario:</span>
                <span>{application.user.username}</span>
              </div>
              <div className="flex items-center space-x-2 text-[#ffe0db]/80">
                <Mail className="w-4 h-4" />
                <span className="font-semibold">Email:</span>
                <span>{application.user.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-[#ffe0db]/80">
                <Building className="w-4 h-4" />
                <span className="font-semibold">Universidad:</span>
                <span>{application.university_name || 'No especificada'}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="text-left">
            <label className="block text-[#ffe0db] font-semibold mb-2">
              {action === 'reject' ? 'Razón del Rechazo (Requerido)' : 'Notas de Revisión (Opcional)'}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={action === 'reject' ? 'Explica por qué rechazas esta solicitud...' : 'Añade comentarios sobre tu decisión...'}
              className="w-full px-4 py-3 bg-[#ffe0db]/10 border border-[#ffe0db]/20 rounded-xl text-[#ffe0db] placeholder-[#ffe0db]/50 focus:outline-none focus:ring-2 focus:ring-[#f1b3be] resize-none"
              rows={4}
              required={action === 'reject'}
            />
            {action === 'reject' && !notes.trim() && (
              <p className="mt-2 text-sm text-red-400">
                Debes proporcionar una razón para rechazar la solicitud
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-[#252c3e]/50 hover:bg-[#252c3e]/70 text-[#ffe0db] rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`flex-1 px-6 py-3 ${
                action === 'approve'
                  ? 'bg-emerald-500 hover:bg-emerald-600'
                  : 'bg-red-500 hover:bg-red-600'
              } text-white rounded-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 flex items-center justify-center space-x-2`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  {action === 'approve' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                  <span>{action === 'approve' ? 'Aprobar' : 'Rechazar'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== MAIN COMPONENT ====================
const AdminPsychologistPanel: React.FC = () => {
  const [applications, setApplications] = useState<PsychologistApplication[]>([]);
  const [filteredApplications, setFilteredApplications] = useState<PsychologistApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [reviewModal, setReviewModal] = useState<{
    application: PsychologistApplication | null;
    action: 'approve' | 'reject' | null;
  }>({ application: null, action: null });
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Fetch applications
  const fetchApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('access_token');
      
      const response = await axios.get(
        'http://127.0.0.1:8000/api/psychologists/applications/',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const apps = response.data;
      setApplications(apps);
      
      // Calculate stats
      const newStats: Stats = {
        total: apps.length,
        pending: apps.filter((a: PsychologistApplication) => a.status === 'pending').length,
        approved: apps.filter((a: PsychologistApplication) => a.status === 'approved').length,
        rejected: apps.filter((a: PsychologistApplication) => a.status === 'rejected').length,
      };
      setStats(newStats);
    } catch (error) {
      console.error('Error fetching applications:', error);
      showNotification('error', 'Error al cargar las solicitudes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Filter applications
  useEffect(() => {
    let filtered = applications;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(app => 
        app.user.username.toLowerCase().includes(term) ||
        app.user.email.toLowerCase().includes(term) ||
        (app.university_name || '').toLowerCase().includes(term)
      );
    }

    setFilteredApplications(filtered);
  }, [applications, statusFilter, searchTerm]);

  // Show notification
  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Handle review
  const handleReviewConfirm = async (notes: string) => {
    if (!reviewModal.application || !reviewModal.action) return;

    try {
      const token = localStorage.getItem('access_token');
      
      await axios.post(
        `http://127.0.0.1:8000/api/psychologists/applications/${reviewModal.application.id}/review/`,
        {
          action: reviewModal.action,
          rejection_reason: notes || undefined
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      showNotification(
        'success',
        reviewModal.action === 'approve' 
          ? '✅ Solicitud aprobada exitosamente' 
          : '❌ Solicitud rechazada'
      );

      setReviewModal({ application: null, action: null });
      fetchApplications();
    } catch (error) {
      console.error('Error reviewing application:', error);
      showNotification('error', 'Error al procesar la solicitud');
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a1f35] via-[#2a3f5f] to-[#4a5d7a] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#252c3e]/60 via-[#214d72]/50 to-[#9675bc]/40 backdrop-blur-[0.5px]" />

      {/* Notification */}
      {notification && (
        <div className={`fixed top-24 right-6 z-50 p-4 rounded-2xl shadow-2xl backdrop-blur-xl border transition-all duration-500 max-w-sm ${
          notification.type === 'success' 
            ? 'bg-green-500/20 border-green-400/30 text-green-100' 
            : 'bg-red-500/20 border-red-400/30 text-red-100'
        } animate-slide-in-right`}>
          <p className="font-medium">{notification.message}</p>
        </div>
      )}

      {/* Review Modal */}
      <ReviewModal
        application={reviewModal.application}
        action={reviewModal.action}
        onClose={() => setReviewModal({ application: null, action: null })}
        onConfirm={handleReviewConfirm}
      />

      {/* Header */}
      <header className="relative z-10 p-6 border-b border-[#f1b3be]/20 backdrop-blur-xl bg-[#252c3e]/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-[#9675bc] via-[#f1b3be] to-[#ffe0db] rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#ffe0db]">Panel de Administración</h1>
              <p className="text-[#f1b3be]">Gestión de Solicitudes de Psicólogos</p>
            </div>
          </div>
          <button
            onClick={fetchApplications}
            className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-[#ffe0db] transition-all duration-300 hover:scale-105"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Actualizar</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatCard
              icon={Users}
              label="Total Solicitudes"
              value={stats.total}
              color="blue"
              gradient="from-blue-500 to-blue-600"
            />
            <StatCard
              icon={Clock}
              label="Pendientes"
              value={stats.pending}
              color="amber"
              gradient="from-amber-500 to-amber-600"
            />
            <StatCard
              icon={CheckCircle}
              label="Aprobadas"
              value={stats.approved}
              color="emerald"
              gradient="from-emerald-500 to-emerald-600"
            />
            <StatCard
              icon={XCircle}
              label="Rechazadas"
              value={stats.rejected}
              color="red"
              gradient="from-red-500 to-red-600"
            />
          </div>

          {/* Filters */}
          <div className="bg-gradient-to-br from-white/95 via-white/90 to-[#ffe0db]/20 backdrop-blur-xl rounded-2xl border border-[#ffe0db]/20 shadow-lg p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#9675bc]/60" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, email o universidad..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-[#9675bc]/20 rounded-xl focus:ring-2 focus:ring-[#9675bc]/40 focus:border-[#9675bc] transition-all duration-300 bg-white/70"
                />
              </div>

              {/* Status Filter */}
              <div className="flex gap-2">
                {['all', 'pending', 'approved', 'rejected'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status as any)}
                    className={`px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                      statusFilter === status
                        ? 'bg-gradient-to-r from-[#9675bc] to-[#f1b3be] text-white shadow-lg'
                        : 'bg-white/70 text-[#252c3e] hover:bg-[#ffe0db]/50'
                    }`}
                  >
                    {status === 'all' ? 'Todos' : status === 'pending' ? 'Pendientes' : status === 'approved' ? 'Aprobadas' : 'Rechazadas'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Applications List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredApplications.length > 0 ? (
              filteredApplications.map((app) => (
                <ApplicationCard
                  key={app.id}
                  application={app}
                  onView={() => alert('Ver detalles completos')}
                  onReview={(action) => setReviewModal({ application: app, action })}
                />
              ))
            ) : (
              <div className="col-span-2 bg-gradient-to-br from-white/95 via-white/90 to-[#ffe0db]/20 backdrop-blur-xl rounded-3xl border border-[#ffe0db]/20 shadow-lg p-12 text-center">
                <AlertTriangle className="w-16 h-16 text-[#f1b3be]/30 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-[#252c3e] mb-2">
                  No se encontraron solicitudes
                </h3>
                <p className="text-[#252c3e]/70">
                  {searchTerm ? 'Intenta con otros términos de búsqueda' : 'No hay solicitudes que coincidan con los filtros'}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <style>{`
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        
        @keyframes scale-in {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        @keyframes slide-in-right {
          0% { opacity: 0; transform: translateX(100%); }
          100% { opacity: 1; transform: translateX(0); }
        }
        
        .animate-fade-in { animation: fade-in 0.3s ease-out; }
        .animate-scale-in { animation: scale-in 0.3s ease-out; }
        .animate-slide-in-right { animation: slide-in-right 0.5s ease-out; }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default AdminPsychologistPanel;