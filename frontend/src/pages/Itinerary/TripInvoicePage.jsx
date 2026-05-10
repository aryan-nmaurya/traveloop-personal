import { Download, FileText, Wallet } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import AppLayout from '../../components/layout/AppLayout';
import api from '../../api/axiosInstance';
import { Button, EmptyState, InfoBadge, PageIntro, PageSection, SectionHeader } from '../../components/ui/primitives';
import { getTripById, hydrateTrip, profileFallback } from '../../data/mockData';
import { formatCurrency, toPercent } from '../../utils/formatters';

const TripInvoicePage = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(getTripById(id));
  const [invoiceStatus, setInvoiceStatus] = useState(getTripById(id)?.invoice?.status ?? 'Pending');

  useEffect(() => {
    let cancelled = false;

    const loadTrip = async () => {
      try {
        const response = await api.get(`/trips/${id}`);
        if (cancelled) return;

        const fallback = getTripById(id);
        const hydrated = hydrateTrip({
          ...fallback,
          ...response.data,
          sections: fallback?.sections ?? [],
          traveler: fallback?.traveler ?? profileFallback,
        });
        setTrip(hydrated);
        setInvoiceStatus(hydrated.invoice.status);
      } catch {
        if (!cancelled) {
          setTrip(getTripById(id));
        }
      }
    };

    loadTrip();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (!trip) {
    return (
      <AppLayout>
        <EmptyState description="The invoice could not be loaded for this trip." title="Invoice unavailable" />
      </AppLayout>
    );
  }

  const { invoice } = trip;
  const usagePercent = toPercent(invoice.total, trip.budget || invoice.total);

  return (
    <AppLayout>
      <PageIntro
        badges={[<InfoBadge key="id">{invoice.invoice_id}</InfoBadge>, <InfoBadge key="status">{invoiceStatus}</InfoBadge>]}
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
              <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{trip.hero_fact}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[22px] bg-white p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Generated date</p>
                <p className="mt-2 text-sm font-semibold text-slate-950">{invoice.generated_date}</p>
              </div>
              <div className="rounded-[22px] bg-white p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Payment status</p>
                <p className="mt-2 text-sm font-semibold text-slate-950">{invoiceStatus}</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="px-3 py-3 font-semibold">Category</th>
                  <th className="px-3 py-3 font-semibold">Description</th>
                  <th className="px-3 py-3 font-semibold">Qty/details</th>
                  <th className="px-3 py-3 font-semibold">Unit cost</th>
                  <th className="px-3 py-3 font-semibold">Amount</th>
                </tr>
              </thead>
              <tbody>
                {invoice.line_items.map((item) => (
                  <tr key={item.id} className="border-b border-slate-100 text-slate-700">
                    <td className="px-3 py-4 font-semibold text-slate-950">{item.category}</td>
                    <td className="px-3 py-4">{item.description}</td>
                    <td className="px-3 py-4">{item.qty}</td>
                    <td className="px-3 py-4">{formatCurrency(item.unit_cost)}</td>
                    <td className="px-3 py-4">{formatCurrency(item.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 ml-auto grid max-w-sm gap-3 rounded-[28px] bg-slate-50/90 p-5">
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Subtotal</span>
              <strong className="text-slate-950">{formatCurrency(invoice.subtotal)}</strong>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Tax</span>
              <strong className="text-slate-950">{formatCurrency(invoice.tax)}</strong>
            </div>
            <div className="flex items-center justify-between text-sm text-slate-600">
              <span>Discount</span>
              <strong className="text-slate-950">-{formatCurrency(invoice.discount)}</strong>
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-slate-200 pt-3 text-base">
              <span className="font-semibold text-slate-950">Grand total</span>
              <strong className="text-xl text-slate-950">{formatCurrency(invoice.total)}</strong>
            </div>
          </div>
        </PageSection>

        <div className="flex flex-col gap-6">
          <PageSection>
            <SectionHeader eyebrow="Budget insights" title="Spend snapshot" />
            <div className="space-y-5">
              <div className="mx-auto flex h-44 w-44 items-center justify-center rounded-full bg-[conic-gradient(from_180deg_at_50%_50%,#0f766e_0%,#0ea5e9_var(--usage),rgba(226,232,240,0.92)_var(--usage),rgba(226,232,240,0.92)_100%)]" style={{ '--usage': `${usagePercent}%` }}>
                <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white text-slate-900 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
                  <strong className="text-2xl font-semibold">{usagePercent}%</strong>
                  <span className="text-xs uppercase tracking-[0.16em] text-slate-400">used</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="rounded-[22px] bg-slate-50/90 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Total budget</p>
                  <p className="mt-2 text-xl font-semibold text-slate-950">{formatCurrency(trip.budget)}</p>
                </div>
                <div className="rounded-[22px] bg-slate-50/90 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Total spent</p>
                  <p className="mt-2 text-xl font-semibold text-slate-950">{formatCurrency(invoice.total)}</p>
                </div>
                <div className="rounded-[22px] bg-slate-50/90 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Remaining</p>
                  <p className="mt-2 text-xl font-semibold text-slate-950">{formatCurrency((trip.budget ?? 0) - invoice.total)}</p>
                </div>
              </div>
              <div className="space-y-3">
                <Button className="w-full" variant="secondary">
                  <Download size={16} />
                  Download invoice
                </Button>
                <Button className="w-full" variant="secondary">
                  <FileText size={16} />
                  Export as PDF
                </Button>
                <Button className="w-full" onClick={() => setInvoiceStatus('Paid')}>
                  <Wallet size={16} />
                  Mark as paid
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
