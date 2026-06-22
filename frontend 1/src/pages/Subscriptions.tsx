import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  X, 
  Check, 
  Loader2,
  Download,
  Calendar,
  Tag,
  Repeat,
  AlertCircle,
  ArrowUpDown,
  FileText,
  Table as TableIcon,
  ChevronDown
} from 'lucide-react';
import { format, addMonths, addYears, addWeeks } from 'date-fns';
import api from '../services/api';
import { Subscription, RenewalType, SubscriptionStatus } from '../types';
import { formatCurrency, cn } from '../lib/utils';
import { useSettings } from '../context/SettingsContext';
import toast from 'react-hot-toast';
import { jsPDF } from 'jspdf';

type SortField = 'serviceName' | 'amount' | 'nextRenewalDate';
type SortOrder = 'asc' | 'desc';

const Subscriptions: React.FC = () => {
  const { currency } = useSettings();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<Subscription | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortField, setSortField] = useState<SortField>('serviceName');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    serviceName: '',
    amount: 0,
    category: 'Entertainment',
    renewalType: 'Monthly' as RenewalType,
    nextRenewalDate: format(new Date(), 'yyyy-MM-dd'),
    status: 'Active' as SubscriptionStatus,
    isTrial: false,
    trialEndDate: format(addWeeks(new Date(), 1), 'yyyy-MM-dd'),
    attachmentUrl: '',
    cancellationUrl: '',
  });

  useEffect(() => {
    fetchSubs();
  }, []);

  const fetchSubs = async () => {
    try {
      const response = await api.get('/subscriptions');
      setSubscriptions(response.data);
    } catch (error) {
      console.error('Failed to fetch subscriptions', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (sub: Subscription | null = null) => {
    if (sub) {
      setEditingSub(sub);
      setFormData({
        serviceName: sub.serviceName,
        amount: sub.amount,
        category: sub.category,
        renewalType: sub.renewalType,
        nextRenewalDate: format(new Date(sub.nextRenewalDate), 'yyyy-MM-dd'),
        status: sub.status,
        isTrial: sub.isTrial || false,
        trialEndDate: sub.trialEndDate ? format(new Date(sub.trialEndDate), 'yyyy-MM-dd') : format(addWeeks(new Date(), 1), 'yyyy-MM-dd'),
        attachmentUrl: sub.attachmentUrl || '',
        cancellationUrl: sub.cancellationUrl || '',
      });
    } else {
      setEditingSub(null);
      setFormData({
        serviceName: '',
        amount: 0,
        category: 'Entertainment',
        renewalType: 'Monthly',
        nextRenewalDate: format(new Date(), 'yyyy-MM-dd'),
        status: 'Active',
        isTrial: false,
        trialEndDate: format(addWeeks(new Date(), 1), 'yyyy-MM-dd'),
        attachmentUrl: '',
        cancellationUrl: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (editingSub) {
        await api.put(`/subscriptions/${editingSub._id}`, formData);
      } else {
        await api.post('/subscriptions', formData);
      }
      await fetchSubs();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to save subscription', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this subscription?')) return;
    try {
      await api.delete(`/subscriptions/${id}`);
      setSubscriptions(subscriptions.filter(s => s._id !== id));
    } catch (error) {
      console.error('Failed to delete subscription', error);
    }
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const exportToCSV = () => {
    try {
      const headers = ['Service', 'Amount', 'Category', 'Renewal', 'Next Renewal', 'Status', 'Is Trial', 'Trial End', 'Cancellation URL'];
      const rows = subscriptions.map(sub => [
        sub.serviceName,
        sub.amount,
        sub.category,
        sub.renewalType,
        format(new Date(sub.nextRenewalDate), 'yyyy-MM-dd'),
        sub.status,
        sub.isTrial ? 'Yes' : 'No',
        sub.trialEndDate ? format(new Date(sub.trialEndDate), 'yyyy-MM-dd') : 'N/A',
        sub.cancellationUrl || 'N/A'
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `subscriptions_${format(new Date(), 'yyyy-MM-dd')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsExportMenuOpen(false);
    } catch (err) {
      console.error('CSV Export failed', err);
    }
  };

  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(18);
      doc.text('Subscription List', 14, 22);
      doc.setFontSize(11);
      doc.setTextColor(100);
      doc.text(`Generated on ${format(new Date(), 'PPP')}`, 14, 30);

      let y = 45;
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text('Service', 14, y);
      doc.text('Amount', 80, y);
      doc.text('Category', 120, y);
      doc.text('Next Renewal', 160, y);
      
      doc.setLineWidth(0.5);
      doc.line(14, y + 2, 196, y + 2);
      
      y += 10;
      subscriptions.forEach((sub) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.text(sub.serviceName, 14, y);
        doc.text(formatCurrency(sub.amount, currency), 80, y);
        doc.text(sub.category, 120, y);
        doc.text(format(new Date(sub.nextRenewalDate), 'MMM d, yyyy'), 160, y);
        y += 8;
      });

      doc.save(`subscriptions_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
      setIsExportMenuOpen(false);
    } catch (err) {
      console.error('PDF Export failed', err);
    }
  };

  const filteredSubs = subscriptions
    .filter(sub => {
      const matchesSearch = sub.serviceName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'All' || sub.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortField === 'amount') {
        comparison = a.amount - b.amount;
      } else if (sortField === 'nextRenewalDate') {
        comparison = new Date(a.nextRenewalDate).getTime() - new Date(b.nextRenewalDate).getTime();
      } else {
        comparison = a.serviceName.localeCompare(b.serviceName);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const categories = ['All', 'Entertainment', 'Software', 'Utilities', 'Lifestyle', 'Health', 'Other'];

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight">My Subscriptions</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage and track all your active services</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button 
              onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
              className="btn-secondary flex items-center gap-2"
            >
              <Download className="w-5 h-5" /> Export <ChevronDown className={cn("w-4 h-4 transition-transform", isExportMenuOpen && "rotate-180")} />
            </button>
            <AnimatePresence>
              {isExportMenuOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsExportMenuOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 p-2 z-50"
                  >
                    <button 
                      onClick={exportToCSV}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <TableIcon className="w-4 h-4 text-emerald-500" /> Export as CSV
                    </button>
                    <button 
                      onClick={exportToPDF}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      <FileText className="w-4 h-4 text-rose-500" /> Export as PDF
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
          <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2">
            <Plus className="w-5 h-5" /> Add New
          </button>
        </div>
      </header>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <input
            type="text"
            placeholder="Search subscriptions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-12"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200",
                filterCategory === cat 
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none" 
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-indigo-300"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Sorting Controls */}
      <div className="flex items-center gap-4 px-2 overflow-x-auto pb-2 scrollbar-hide">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">Sort by:</span>
        {[
          { field: 'serviceName', label: 'Name' },
          { field: 'amount', label: 'Amount' },
          { field: 'nextRenewalDate', label: 'Renewal Date' },
        ].map((item) => (
          <button
            key={item.field}
            onClick={() => handleSort(item.field as SortField)}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
              sortField === item.field 
                ? "bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400" 
                : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
            )}
          >
            {item.label}
            {sortField === item.field && (
              <ArrowUpDown className={cn("w-3 h-3 transition-transform", sortOrder === 'desc' && "rotate-180")} />
            )}
          </button>
        ))}
      </div>

      {/* Subscriptions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredSubs.map((sub) => (
            <motion.div
              layout
              key={sub._id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="neumorphic-card group relative overflow-hidden"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xl shadow-sm border border-indigo-100/50 dark:border-indigo-800/30">
                      {sub.serviceName.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg">{sub.serviceName}</h3>
                        {sub.isTrial && (
                          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-1.5 py-0.5 rounded uppercase tracking-wider">
                            Trial
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                        {sub.category}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button 
                      onClick={() => handleOpenModal(sub)}
                      className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(sub._id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Amount</span>
                    <span className="font-bold text-lg">{formatCurrency(sub.amount, currency)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Renewal</span>
                    <div className="flex items-center gap-1 text-sm font-medium">
                      <Repeat className="w-3 h-3 text-indigo-500" />
                      {sub.renewalType}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Next Bill</span>
                    <div className="flex items-center gap-1 text-sm font-medium">
                      <Calendar className="w-3 h-3 text-indigo-500" />
                      {format(new Date(sub.nextRenewalDate), 'MMM d, yyyy')}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold",
                      sub.status === 'Active' ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" :
                      sub.status === 'Cancelled' ? "bg-slate-100 dark:bg-slate-800 text-slate-500" :
                      "bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400"
                    )}>
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        sub.status === 'Active' ? "bg-emerald-500" :
                        sub.status === 'Cancelled' ? "bg-slate-400" :
                        "bg-rose-500"
                      )} />
                      {sub.status}
                    </div>
                    <button 
                      onClick={async () => {
                        const newStatus = sub.status === 'Active' ? 'Cancelled' : 'Active';
                        try {
                          await api.patch(`/subscriptions/${sub._id}`, { status: newStatus });
                          setSubscriptions(prev => prev.map(s => s._id === sub._id ? { ...s, status: newStatus } : s));
                          toast.success(`Subscription ${newStatus.toLowerCase()}`);
                        } catch (error) {
                          toast.error('Failed to update status');
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
                      title={sub.status === 'Active' ? "Mark as Cancelled" : "Mark as Active"}
                    >
                      {sub.status === 'Active' ? <X className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />}
                    </button>
                    {sub.cancellationUrl && (
                      <a 
                        href={sub.cancellationUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
                        title="Cancellation Link"
                      >
                        <X className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {sub.attachmentUrl && (
                      <a 
                        href={sub.attachmentUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
                        title="View Attachment"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                  {sub.status === 'Active' && (
                    <button className="text-xs font-bold text-indigo-600 hover:underline">
                      Mark as Expired
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 m-auto w-full max-w-lg h-fit bg-white dark:bg-slate-900 rounded-3xl shadow-2xl z-[110] overflow-hidden"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold font-display tracking-tight">
                    {editingSub ? 'Edit Subscription' : 'Add Subscription'}
                  </h2>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="col-span-2 space-y-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Service Name</label>
                      <input
                        type="text"
                        required
                        value={formData.serviceName}
                        onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                        className="input-field"
                        placeholder="e.g. Netflix, Spotify"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Amount ({currency === 'INR' ? '₹' : currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£'})</label>
                      <input
                        type="number"
                        required
                        min="1"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                        className="input-field"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="input-field"
                      >
                        {categories.filter(c => c !== 'All').map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Renewal Type</label>
                      <select
                        value={formData.renewalType}
                        onChange={(e) => setFormData({ ...formData, renewalType: e.target.value as RenewalType })}
                        className="input-field"
                      >
                        <option value="Monthly">Monthly</option>
                        <option value="Yearly">Yearly</option>
                        <option value="Weekly">Weekly</option>
                        <option value="One-time">One-time</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Next Renewal</label>
                      <input
                        type="date"
                        required
                        value={formData.nextRenewalDate}
                        onChange={(e) => setFormData({ ...formData, nextRenewalDate: e.target.value })}
                        className="input-field"
                      />
                    </div>

                    <div className="col-span-2 space-y-4 pt-2">
                      <div className="flex items-center justify-between p-4 neumorphic-inset rounded-2xl">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/20 rounded-xl flex items-center justify-center text-amber-600">
                            <AlertCircle className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold">Free Trial</p>
                            <p className="text-xs text-slate-500">Is this a trial subscription?</p>
                          </div>
                        </div>
                        <div 
                          onClick={() => setFormData({ ...formData, isTrial: !formData.isTrial })}
                          className={cn(
                            "w-12 h-6 rounded-full relative cursor-pointer transition-all duration-300",
                            formData.isTrial ? "bg-amber-500" : "bg-slate-300 dark:bg-slate-700"
                          )}
                        >
                          <div className={cn(
                            "w-4 h-4 bg-white rounded-full absolute top-1 transition-all duration-300",
                            formData.isTrial ? "left-7" : "left-1"
                          )} />
                        </div>
                      </div>

                      {formData.isTrial && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="space-y-2"
                        >
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Trial End Date</label>
                          <input
                            type="date"
                            value={formData.trialEndDate}
                            onChange={(e) => setFormData({ ...formData, trialEndDate: e.target.value })}
                            className="input-field"
                          />
                        </motion.div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Cancellation URL</label>
                          <input
                            type="url"
                            value={formData.cancellationUrl}
                            onChange={(e) => setFormData({ ...formData, cancellationUrl: e.target.value })}
                            className="input-field"
                            placeholder="https://service.com/cancel"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Attachment URL</label>
                          <input
                            type="url"
                            value={formData.attachmentUrl}
                            onChange={(e) => setFormData({ ...formData, attachmentUrl: e.target.value })}
                            className="input-field"
                            placeholder="Link to invoice/receipt"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-4">
                    <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary flex-1">
                      Cancel
                    </button>
                    <button type="submit" disabled={isLoading} className="btn-primary flex-1 flex items-center justify-center gap-2">
                      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (editingSub ? 'Update' : 'Save')}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Subscriptions;
