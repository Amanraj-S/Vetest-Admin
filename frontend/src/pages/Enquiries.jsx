import React, { useEffect, useState } from 'react';
import { enquiryService } from '../services/enquiryService';
import { useToast } from '../contexts/ToastContext';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import Pagination from '../components/Pagination';
import Skeleton from '../components/Skeleton';
import { MessageSquare, Search, Eye, Trash2, Loader2 } from 'lucide-react';

const Enquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);

  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [statusInput, setStatusInput] = useState('NEW');
  const [notesInput, setNotesInput] = useState('');
  const [updating, setUpdating] = useState(false);

  const toast = useToast();

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const res = await enquiryService.getEnquiries({ page, limit: 10, search, status: statusFilter });
      if (res.success) {
        setEnquiries(res.data);
        setPagination(res.pagination);
      }
    } catch (err) {
      toast.error('Failed to load enquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, [page, search, statusFilter]);

  const handleOpenDetails = (enq) => {
    setSelectedEnquiry(enq);
    setStatusInput(enq.status || 'NEW');
    setNotesInput(enq.internalNotes || '');
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedEnquiry) return;

    try {
      setUpdating(true);
      await enquiryService.updateEnquiry(selectedEnquiry._id, {
        status: statusInput,
        internalNotes: notesInput
      });
      toast.success('Enquiry status updated successfully!');
      setSelectedEnquiry(null);
      fetchEnquiries();
    } catch (err) {
      toast.error('Failed to update enquiry status');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this enquiry record?')) return;
    try {
      await enquiryService.deleteEnquiry(id);
      toast.success('Enquiry deleted');
      fetchEnquiries();
    } catch (err) {
      toast.error('Failed to delete enquiry');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <MessageSquare className="w-7 h-7 text-blue-600" />
            Customer Enquiries Management
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Inquiries submitted via public website contact forms and commercial quote requests.
          </p>
        </div>
      </div>

      <div className="p-4 bg-white border border-slate-200 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xs">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, company, or message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-emerald-600"
        >
          <option value="">All Statuses</option>
          <option value="NEW">NEW</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="CONTACTED">CONTACTED</option>
          <option value="CLOSED">CLOSED</option>
        </select>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase tracking-wider font-semibold">
              <tr>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Company</th>
                <th className="px-6 py-4">Enquiry Type</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Submitted Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan="6" className="p-4">
                      <Skeleton className="h-6 w-full" />
                    </td>
                  </tr>
                ))
              ) : enquiries.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-slate-500">
                    No customer enquiries found matching filter criteria.
                  </td>
                </tr>
              ) : (
                enquiries.map((enq) => (
                  <tr key={enq._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900 text-sm">{enq.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{enq.email}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-700 font-medium">{enq.company || '—'}</td>
                    <td className="px-6 py-4 text-slate-600">{enq.enquiryType}</td>
                    <td className="px-6 py-4">
                      <Badge status={enq.status} />
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-mono">
                      {new Date(enq.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenDetails(enq)}
                          className="p-1.5 rounded-lg bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(enq._id)}
                          className="p-1.5 rounded-lg bg-red-50 border border-red-200 text-red-600 hover:bg-red-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <Pagination pagination={pagination} onPageChange={(p) => setPage(p)} />
      </div>

      {/* Enquiry Detail Modal */}
      <Modal
        isOpen={Boolean(selectedEnquiry)}
        onClose={() => setSelectedEnquiry(null)}
        title={`Enquiry from ${selectedEnquiry?.name || ''}`}
        subtitle={`Submitted on ${selectedEnquiry ? new Date(selectedEnquiry.createdAt).toLocaleString() : ''}`}
      >
        {selectedEnquiry && (
          <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs text-slate-700">
            <div className="grid grid-cols-2 gap-4 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <span className="text-slate-500 font-bold block">Email:</span>
                <span className="text-slate-900 font-mono">{selectedEnquiry.email}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block">Phone:</span>
                <span className="text-slate-900">{selectedEnquiry.phone || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block">Company:</span>
                <span className="text-slate-900">{selectedEnquiry.company || 'N/A'}</span>
              </div>
              <div>
                <span className="text-slate-500 font-bold block">Country:</span>
                <span className="text-slate-900">{selectedEnquiry.country || 'N/A'}</span>
              </div>
            </div>

            <div>
              <span className="block font-bold text-slate-700 mb-1">Message Content:</span>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 leading-relaxed whitespace-pre-wrap">
                {selectedEnquiry.message}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Update Status</label>
                <select
                  value={statusInput}
                  onChange={(e) => setStatusInput(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600"
                >
                  <option value="NEW">NEW</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="CONTACTED">CONTACTED</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Internal Notes</label>
                <textarea
                  rows="3"
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="Notes visible only to Vtest team..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-emerald-600"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={updating}
                className="px-5 py-2 bg-emerald-600 text-white font-bold rounded-xl shadow-md flex items-center gap-2"
              >
                {updating && <Loader2 className="w-4 h-4 animate-spin" />}
                Save Status & Notes
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default Enquiries;
