import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ pagination, onPageChange }) => {
  if (!pagination || pagination.pages <= 1) return null;

  const { page, pages, total, limit } = pagination;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-slate-50 border-t border-slate-200 text-xs text-slate-600">
      <div>
        Showing <span className="font-bold text-slate-900">{(page - 1) * limit + 1}</span> to{' '}
        <span className="font-bold text-slate-900">{Math.min(page * limit, total)}</span> of{' '}
        <span className="font-bold text-slate-900">{total}</span> records
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="px-3 py-1 font-semibold text-slate-700">
          Page {page} of {pages}
        </span>

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= pages}
          className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
