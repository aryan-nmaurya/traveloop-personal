import { Download, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import api from '../../api/axiosInstance';
import { Button, EmptyState, InfoBadge, PageIntro, PageSection, SectionHeader } from '../../components/ui/primitives';
import { formatCurrency, toPercent } from '../../utils/formatters';

const TripInvoicePage = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [invoice, setInvoice] = useState(null);
  const [markingPaid, setMarkingPaid] = useState(false);

  const fetchInvoice = async () => {
    try {
      const res = await api.get(`/trips/${id}/invoice`);
      setInvoice(res.data);
    } catch {
      // fall through — invoice stays null
    }
  };

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const [tripRes] = await Promise.all([api.get(`/trips/${id}`), fetchInvoice()]);
        if (cancelled) return;
        setTrip(tripRes.data);
      } catch {
        // trip stays null → shows EmptyState
      }
    };

    load();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleDownload = async () => {
    try {
      const res = await api.get(`/trips/${id}/invoice/pdf`, { responseType: 'blob' });
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${id}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch { /* ignore */ }
  };

  const handleMarkPaid = async () => {
    setMarkingPaid(true);
    try {
      await api.put(`/trips/${id}/invoice/status`, { status: 'paid' });
      await fetchInvoice();
    } catch {
      // ignore
    } finally {
      setMarkingPaid(false);
    }
  };

  if (!trip) {
    return (
      <AppLayout>
        <EmptyState description="The invoice could not be loaded for this trip." title="Invoice unavailable" />
      </AppLayout>
    );
  }

  const lineItems = invoice?.line_items ?? [];
  const subtotal = invoice?.subtotal ?? 0;
  const tax = invoice?.tax ?? 0;
  const discount = invoice?.discount ?? 0;
  const total = invoice?.total ?? 0;
  const budget = invoice?.budget ?? trip?.budget ?? 0;
  const invoiceStatus = invoice?.invoice_status ?? 'pending';
  const generatedDate = invoice?.generated_date ?? '—';
  const usagePercent = toPercent(total, budget || total);

  return (
    <AppLayout>
      <PageIntro
        badges={[
          <InfoBadge key="status" className="capitalize">{invoiceStatus}</InfoBadge>,
          <InfoBadge key="date">{generatedDate}</InfoBadge>,
        ]}
        description="An upgraded billing screen that respects the wireframe structure: trip summary, traveler details, line items, budget insights, and invoice actions."
        eyebrow="Expense invoice"
        title={`${trip.name} invoice`}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_360px]">
        <PageSection>
          <SectionHeader eyebrow="Trip summary" title="Trip details and line items" />
          <div className="mb-6 grid gap-4 rounded-[28px] bg-slate-50/90 p-5 lg:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Trip to</p>
              <h3 className="mt-2 text-3xl font-semibold tracking-[-0.04em] text-slate-950">{trip.name}</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{trip.description}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[22px] bg-white p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Generated date</p>
                <p className="mt-2 text-sm font-semibold text-slate-950">{generatedDate}</p>
              </div>
              <div className="rounded-[22px] bg-white p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Payment status</p>
                <p className="mt-2 text-sm font-semibold capitalize text-slate-950">{invoiceStatus}</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="px-3 py-3 font-semibold">Category</th>
                  <th className="px-3 py-3 font-semibold">Description</th>
                  <th className="px-3 py-3 font-semibold">Dates</th>
                  <th className="px-3 py-3 font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody>
                {lineItems.length ? lineItems.map((item, i) => (
                  <tr key={item.section_id ?? item.id ?? i} className="border-b border-slate-100 text-slate-700">
                    <td className="px-3 py-4 font-semibold capitalize text-slate-950">{item.type ?? item.category ?? '—'}</td>
                    <td className="px-3 py-4">{item.description}</td>
                    <td className="px-3 py-4 text-xs text-slate-500">
                      {item.start_date ?? ''}{item.end_date ? ` → ${item.end_date}` : ''}
                    </td>
                    <td className="px-3 py-4">{formatCurrency(item.amount ?? item.unit_cost ?? 0)}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="px-3 py-6 text-center text-sm text-slate-400">No line items — add sections to this trip to populate the invoice.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-6 ml-auto grid max-w-sm gap-3 rounded-[28px] bg-slate-50/90 p-5">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Subtotal</span>
              <strong className="text-slate-950">{formatCurrency(subtotal)}</strong>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Tax</span>
              <strong className="text-slate-950">{formatCurrency(tax)}</strong>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Discount</span>
              <strong className="text-slate-950">-{formatCurrency(discount)}</strong>
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-slate-200 pt-3 text-base">
              <span className="font-semibold text-slate-950">Grand total</span>
              <strong className="text-xl text-slate-950">{formatCurrency(total)}</strong>
            </div>
          </div>
        </PageSection>

        <div className="flex flex-col gap-6">
          <PageSection>
            <SectionHeader eyebrow="Budget insights" title="Spend snapshot" />
            <div className="space-y-5">
              <div
                className="mx-auto flex h-44 w-44 items-center justify-center rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,#0f766e_0%,#0ea5e9_var(--usage),rgba(226,232,240,0.92)_var(--usage),rgba(226,232,240,0.92)_100%)]"
                style={{ '--usage': `${usagePercent}%` }}
              >
                <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white text-slate-900 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
                  <strong className="text-2xl font-semibold">{usagePercent}%</strong>
                  <span className="text-xs uppercase tracking-[0.16em] text-slate-400">used</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="rounded-[22px] bg-slate-50/90 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Total budget</p>
                  <p className="mt-2 text-xl font-semibold text-slate-950">{formatCurrency(budget)}</p>
                </div>
                <div className="rounded-[22px] bg-slate-50/90 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Total spent</p>
                  <p className="mt-2 text-xl font-semibold text-slate-950">{formatCurrency(total)}</p>
                </div>
                <div className="rounded-[22px] bg-slate-50/90 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Remaining</p>
                  <p className="mt-2 text-xl font-semibold text-slate-950">{formatCurrency((budget ?? 0) - total)}</p>
                </div>
              </div>
              <div className="space-y-3">
                <Button className="w-full" variant="secondary" onClick={handleDownload}>
                  <Download size={16} />
                  Download PDF invoice
                </Button>
                <Button className="w-full" onClick={handleMarkPaid} disabled={markingPaid || invoiceStatus === 'paid'}>
                  <Wallet size={16} />
                  {invoiceStatus === 'paid' ? 'Marked as paid' : markingPaid ? 'Saving…' : 'Mark as paid'}
                </Button>
              </div>
            </div>
          </PageSection>
        </div>
      </div>
    </AppLayout>
  );
};

export default TripInvoicePage;
