import React from 'react';

const Badge = ({ status, children }) => {
  const label = children || status;

  let style = 'bg-slate-100 text-slate-700 border-slate-200';

  switch (status) {
    case 'PUBLISHED':
    case 'ACTIVE':
    case 'CLOSED':
      style = 'bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold';
      break;
    case 'DRAFT':
    case 'IN_PROGRESS':
      style = 'bg-amber-50 text-amber-700 border-amber-200 font-semibold';
      break;
    case 'UNPUBLISHED':
    case 'INACTIVE':
      style = 'bg-slate-100 text-slate-500 border-slate-200';
      break;
    case 'NEW':
      style = 'bg-blue-50 text-blue-700 border-blue-200 font-bold';
      break;
    case 'CONTACTED':
      style = 'bg-purple-50 text-purple-700 border-purple-200 font-semibold';
      break;
    case 'SUPER_ADMIN':
      style = 'bg-emerald-100 text-emerald-800 border-emerald-300 font-bold';
      break;
    case 'ADMIN':
      style = 'bg-teal-50 text-teal-700 border-teal-200 font-semibold';
      break;
    case 'EDITOR':
      style = 'bg-slate-100 text-slate-700 border-slate-200';
      break;
    default:
      style = 'bg-slate-100 text-slate-700 border-slate-200';
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${style}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75"></span>
      {label}
    </span>
  );
};

export default Badge;
