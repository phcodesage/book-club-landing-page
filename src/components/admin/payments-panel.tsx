'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { 
  Check, 
  Clock, 
  X, 
  Eye, 
  Phone, 
  Hash, 
  Calendar,
  DollarSign,
  MessageSquare,
  ExternalLink,
  RefreshCw
} from 'lucide-react';

type PaymentStatus = 'pending' | 'verified' | 'rejected';

type ZellePayment = {
  _id: string;
  name: string;
  phone: string;
  reference: string;
  imageUrl?: string;
  courseName: string;
  amount: string;
  status: PaymentStatus;
  submittedAt: string;
  verifiedAt?: string;
  notes?: string;
};

export function PaymentsPanel() {
  const [payments, setPayments] = useState<ZellePayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState<ZellePayment | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | PaymentStatus>('all');

  useEffect(() => {
    fetchPayments();
  }, []);

  async function fetchPayments() {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/payments');
      const data = await response.json();
      setPayments(data.payments || []);
    } catch (error) {
      console.error('Failed to fetch payments:', error);
    } finally {
      setLoading(false);
    }
  }

  async function updatePaymentStatus(paymentId: string, status: PaymentStatus, notes?: string) {
    try {
      setUpdating(paymentId);
      const response = await fetch('/api/admin/payments', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentId, status, notes }),
      });

      if (response.ok) {
        await fetchPayments();
        setSelectedPayment(null);
      }
    } catch (error) {
      console.error('Failed to update payment:', error);
    } finally {
      setUpdating(null);
    }
  }

  const filteredPayments = payments.filter(payment => 
    filter === 'all' || payment.status === filter
  );

  const statusCounts = {
    all: payments.length,
    pending: payments.filter(p => p.status === 'pending').length,
    verified: payments.filter(p => p.status === 'verified').length,
    rejected: payments.filter(p => p.status === 'rejected').length,
  };

  const getStatusBadge = (status: PaymentStatus) => {
    const styles = {
      pending: 'bg-yellow-50 text-yellow-600 border-yellow-200',
      verified: 'bg-green-50 text-green-600 border-green-200',
      rejected: 'bg-red-50 text-red-600 border-red-200',
    };

    const icons = {
      pending: Clock,
      verified: Check,
      rejected: X,
    };

    const Icon = icons[status];

    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-widest border ${styles[status]}`}>
        <Icon className="w-3 h-3" />
        {status}
      </span>
    );
  };

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="sticky top-0 z-30 -mx-1 rounded-[28px] border border-slate-200 bg-white/95 p-8 shadow-lg backdrop-blur-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[var(--color-accent)]">Payments</p>
            <h1 className="mt-2 text-3xl font-black text-[var(--color-ink)]">Zelle Payments</h1>
            <p className="mt-2 text-sm font-medium text-slate-500">
              {statusCounts.all} total payments &mdash; {statusCounts.pending} pending, {statusCounts.verified} verified, {statusCounts.rejected} rejected.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {/* Filter tabs */}
            <div className="flex gap-1.5">
              {(['all', 'pending', 'verified', 'rejected'] as const).map((f) => (
                <button key={f} type="button" onClick={() => setFilter(f)}
                  className={`rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-widest transition ${
                    filter === f
                      ? 'bg-[var(--color-ink)] text-white shadow-sm'
                      : 'border border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                  }`}>
                  {f === 'all' ? `All (${statusCounts.all})` : 
                   f === 'pending' ? `Pending (${statusCounts.pending})` : 
                   f === 'verified' ? `Verified (${statusCounts.verified})` :
                   `Rejected (${statusCounts.rejected})`}
                </button>
              ))}
            </div>
            {/* Refresh button */}
            <button type="button" onClick={fetchPayments} disabled={loading}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--color-accent)] px-5 py-2.5 text-[10px] font-black uppercase tracking-widest text-white transition hover:bg-[var(--color-accent-hover)] hover:shadow-lg disabled:opacity-60">
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Payments List */}
      <div className="flex gap-6">
        <div className="min-w-0 flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <RefreshCw className="h-8 w-8 animate-spin text-slate-400" />
            </div>
          ) : filteredPayments.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-[28px] border border-dashed border-slate-200 bg-slate-50/50 py-20">
              <DollarSign className="h-10 w-10 text-slate-300" />
              <p className="mt-3 text-sm font-bold text-slate-400">No payments found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPayments.map((payment) => (
                <div key={payment._id} 
                  className={`rounded-[20px] border bg-white p-6 shadow-sm transition-all hover:shadow-md ${
                    selectedPayment?._id === payment._id ? 'border-[var(--color-accent)] shadow-lg' : 'border-slate-200'
                  }`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-[var(--color-ink)]">{payment.name}</h3>
                        {getStatusBadge(payment.status)}
                      </div>
                      
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Phone className="h-4 w-4 text-slate-400" />
                          <span>{payment.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Hash className="h-4 w-4 text-slate-400" />
                          <span className="font-mono">{payment.reference}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <DollarSign className="h-4 w-4 text-slate-400" />
                          <span className="font-bold">{payment.amount}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Calendar className="h-4 w-4 text-slate-400" />
                          <span>{new Date(payment.submittedAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="text-sm text-slate-500">
                        <span className="font-medium">Course:</span> {payment.courseName}
                      </div>

                      {payment.notes && (
                        <div className="flex items-start gap-2 rounded-lg bg-slate-50 p-3 text-sm">
                          <MessageSquare className="h-4 w-4 text-slate-400 mt-0.5" />
                          <span className="text-slate-600">{payment.notes}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      {payment.imageUrl && (
                        <a 
                          href={payment.imageUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="rounded-lg border border-slate-200 p-2 text-slate-400 transition hover:border-slate-300 hover:text-slate-600"
                          title="View screenshot"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                      <button
                        onClick={() => setSelectedPayment(selectedPayment?._id === payment._id ? null : payment)}
                        className="rounded-lg border border-slate-200 p-2 text-slate-400 transition hover:border-slate-300 hover:text-slate-600"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail Sidebar */}
        {selectedPayment && (
          <div className="w-[320px] shrink-0">
            <div className="sticky top-[160px] overflow-hidden rounded-[28px] border border-slate-100 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                <p className="text-xs font-black uppercase tracking-widest text-slate-500">Payment Details</p>
                <button type="button" onClick={() => setSelectedPayment(null)}
                  className="rounded-full border border-slate-100 p-1.5 text-slate-400 transition hover:border-slate-200 hover:text-slate-600">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Customer</p>
                  <p className="mt-1 text-lg font-bold text-slate-800">{selectedPayment.name}</p>
                  <p className="text-sm text-slate-600">{selectedPayment.phone}</p>
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Reference</p>
                  <p className="mt-1 font-mono text-sm text-slate-800">{selectedPayment.reference}</p>
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Amount & Course</p>
                  <p className="mt-1 text-lg font-bold text-green-600">{selectedPayment.amount}</p>
                  <p className="text-sm text-slate-600">{selectedPayment.courseName}</p>
                </div>

                {selectedPayment.imageUrl && (
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Screenshot</p>
                    <div className="mt-2 relative aspect-[3/4] rounded-lg overflow-hidden border border-slate-200">
                      <Image
                        src={selectedPayment.imageUrl}
                        alt="Payment screenshot"
                        fill
                        className="object-contain"
                        sizes="320px"
                      />
                    </div>
                    <a 
                      href={selectedPayment.imageUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-2 text-xs text-[var(--color-accent)] hover:underline"
                    >
                      <ExternalLink className="h-3 w-3" />
                      View full size
                    </a>
                  </div>
                )}

                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</p>
                  <div className="mt-2">{getStatusBadge(selectedPayment.status)}</div>
                </div>

                {selectedPayment.status === 'pending' && (
                  <div className="space-y-2 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => updatePaymentStatus(selectedPayment._id, 'verified')}
                      disabled={updating === selectedPayment._id}
                      className="w-full rounded-xl bg-green-600 py-3 text-xs font-black uppercase tracking-widest text-white transition hover:bg-green-700 disabled:opacity-60"
                    >
                      {updating === selectedPayment._id ? 'Updating...' : 'Verify Payment'}
                    </button>
                    <button
                      onClick={() => updatePaymentStatus(selectedPayment._id, 'rejected')}
                      disabled={updating === selectedPayment._id}
                      className="w-full rounded-xl border border-red-200 bg-red-50 py-3 text-xs font-black uppercase tracking-widest text-red-600 transition hover:bg-red-100 disabled:opacity-60"
                    >
                      {updating === selectedPayment._id ? 'Updating...' : 'Reject Payment'}
                    </button>
                  </div>
                )}

                <div className="text-xs text-slate-400 pt-2 border-t border-slate-100">
                  <p>Submitted: {new Date(selectedPayment.submittedAt).toLocaleString()}</p>
                  {selectedPayment.verifiedAt && (
                    <p>Verified: {new Date(selectedPayment.verifiedAt).toLocaleString()}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}