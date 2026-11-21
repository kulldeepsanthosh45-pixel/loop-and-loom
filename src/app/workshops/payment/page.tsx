'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { WORKSHOP_CONFIG } from '@/lib/workshop-config';
import { Copy, Check, Loader2, AlertCircle, Upload } from 'lucide-react';

function PaymentPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const regId = searchParams.get('regId') ?? '';

  const [reg, setReg] = useState<{ full_name: string; session: string; amount: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [utr, setUtr] = useState('');
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!regId) { router.replace('/workshops/register'); return; }
    supabase
      .from('workshop_registrations')
      .select('full_name, session, amount')
      .eq('registration_id', regId)
      .single()
      .then(({ data }) => {
        if (!data) { router.replace('/workshops/register'); return; }
        setReg(data);
        setLoading(false);
      });
  }, [regId, router]);

  const copyUPI = () => {
    navigator.clipboard.writeText(WORKSHOP_CONFIG.upi.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleScreenshot = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setScreenshotFile(file);
    const reader = new FileReader();
    reader.onload = () => setScreenshotPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSubmitPayment = async () => {
    if (!utr.trim()) { setError('Please enter your UPI Transaction ID / UTR number.'); return; }
    if (utr.trim().length < 6) { setError('UTR number seems too short. Please check.'); return; }
    setError('');
    setSubmitting(true);

    // Check for duplicate UTR
    const { data: utrExists } = await supabase
      .from('workshop_registrations')
      .select('id')
      .eq('utr', utr.trim())
      .maybeSingle();

    if (utrExists) {
      setError('This UTR number has already been submitted. Please check and re-enter.');
      setSubmitting(false);
      return;
    }

    // Upload screenshot if provided
    let screenshotUrl: string | null = null;
    if (screenshotFile) {
      const ext = screenshotFile.name.split('.').pop() ?? 'jpg';
      const path = `payment-screenshots/${regId}.${ext}`;
      const { error: uploadErr } = await supabase.storage
        .from('workshop-payments')
        .upload(path, screenshotFile, { upsert: true });
      if (!uploadErr) {
        const { data: urlData } = supabase.storage
          .from('workshop-payments')
          .getPublicUrl(path);
        screenshotUrl = urlData.publicUrl;
      }
    }

    const { error: updateErr } = await supabase
      .from('workshop_registrations')
      .update({
        utr: utr.trim(),
        screenshot_url: screenshotUrl,
      })
      .eq('registration_id', regId);

    if (updateErr) {
      setError('Could not save payment details. Please try again.');
      setSubmitting(false);
      return;
    }

    setSubmitted(true);
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FAF3E8' }}>
        <Loader2 size={32} className="animate-spin" style={{ color: '#A96845' }} />
      </div>
    );
  }

  const amount = reg?.amount ?? WORKSHOP_CONFIG.fee;
  const upiIntent = WORKSHOP_CONFIG.upi.intentUrl(amount, regId);

  if (submitted) {
    return (
      <main className="min-h-screen flex items-center justify-center py-16 px-4" style={{ background: '#FAF3E8' }}>
        <div className="max-w-md w-full text-center rounded-3xl p-8 shadow-sm"
          style={{ background: '#FFFDF9', border: '1px solid #E8DCCB' }}>
          <div className="text-6xl mb-4 payment-success-anim">🎉</div>
          <h2 className="font-display text-2xl font-semibold mb-3" style={{ color: '#594333' }}>
            Payment Details Submitted!
          </h2>
          <p className="text-sm leading-relaxed mb-6" style={{ color: '#8A7968' }}>
            Your payment details have been submitted successfully.
            Your registration will be <strong style={{ color: '#594333' }}>confirmed after payment verification</strong> by our team.
          </p>
          <div className="rounded-2xl p-4 mb-6 text-left space-y-2"
            style={{ background: '#FAF3E8', border: '1px solid #D8C4A8' }}>
            <p className="text-xs"><span className="font-semibold" style={{ color: '#594333' }}>Registration ID:</span>
              <span className="ml-2 font-mono font-bold" style={{ color: '#A96845' }}>{regId}</span></p>
            <p className="text-xs"><span className="font-semibold" style={{ color: '#594333' }}>Name:</span>
              <span className="ml-2" style={{ color: '#8A7968' }}>{reg?.full_name}</span></p>
            <p className="text-xs"><span className="font-semibold" style={{ color: '#594333' }}>UTR Submitted:</span>
              <span className="ml-2 font-mono" style={{ color: '#8A7968' }}>{utr}</span></p>
          </div>
          <p className="text-xs" style={{ color: '#8A7968' }}>
            We&apos;ll contact you on WhatsApp once your payment is verified. 💬
          </p>
        </div>
        <style jsx>{`
          .payment-success-anim { animation: bounce 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97) both; }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            40%       { transform: translateY(-16px); }
            60%       { transform: translateY(-8px); }
          }
        `}</style>
      </main>
    );
  }

  return (
    <main className="min-h-screen py-16 px-4" style={{ background: '#FAF3E8' }}>
      <div className="max-w-lg mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-block text-[11px] tracking-[0.2em] uppercase font-semibold px-4 py-1.5 rounded-full mb-4"
            style={{ background: 'rgba(169,104,69,0.1)', color: '#A96845', border: '1px solid rgba(169,104,69,0.2)' }}>
            Complete Your Payment
          </span>
          <h1 className="font-display text-3xl font-semibold" style={{ color: '#594333' }}>
            Pay via UPI
          </h1>
          <p className="text-sm mt-2" style={{ color: '#8A7968' }}>
            Reg ID: <strong className="font-mono" style={{ color: '#A96845' }}>{regId}</strong>
          </p>
        </div>

        {/* Payment card */}
        <div className="rounded-3xl shadow-sm overflow-hidden mb-6"
          style={{ background: '#FFFDF9', border: '1px solid #E8DCCB' }}>

          {/* Amount banner */}
          <div className="p-5 text-center" style={{ background: '#594333' }}>
            <p className="text-xs uppercase tracking-widest font-semibold mb-1" style={{ color: '#D8C4A8' }}>
              Workshop Fee
            </p>
            <p className="font-display text-5xl font-semibold text-white">₹{amount.toLocaleString('en-IN')}</p>
            <p className="text-xs mt-1" style={{ color: '#D8C4A8' }}>Pay to: {WORKSHOP_CONFIG.upi.name}</p>
          </div>

          <div className="p-6">
            {/* QR Code */}
            <div className="flex flex-col items-center mb-6">
              <div className="rounded-2xl p-3 shadow-sm mb-3" style={{ background: '#fff', border: '1px solid #E8DCCB' }}>
                <Image
                  src={WORKSHOP_CONFIG.upi.qrImage}
                  alt="UPI QR Code — Scan to pay"
                  width={220}
                  height={220}
                  className="rounded-xl"
                />
              </div>
              <p className="text-xs font-medium" style={{ color: '#8A7968' }}>Scan with any UPI app</p>
              <div className="flex gap-2 mt-2 text-sm">
                {['GPay', 'PhonePe', 'BHIM', 'Paytm'].map((app) => (
                  <span key={app} className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                    style={{ background: '#D8C4A8', color: '#594333' }}>{app}</span>
                ))}
              </div>
            </div>

            {/* UPI ID */}
            <div className="rounded-xl p-4 mb-4 flex items-center justify-between gap-3"
              style={{ background: '#FAF3E8', border: '1px solid #D8C4A8' }}>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide mb-0.5" style={{ color: '#8A7968' }}>UPI ID</p>
                <p className="font-mono font-bold text-sm" style={{ color: '#594333' }}>
                  {WORKSHOP_CONFIG.upi.id}
                </p>
              </div>
              <button onClick={copyUPI}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                style={{ background: copied ? '#6B8E6B' : '#A96845', color: '#fff' }}>
                {copied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
              </button>
            </div>

            {/* Open UPI App button */}
            <a href={upiIntent}
              className="block w-full text-center py-3.5 rounded-2xl text-sm font-bold mb-4 transition-all hover:opacity-90"
              style={{ background: '#594333', color: '#FFFFFF' }}>
              📲 Open UPI App to Pay ✦
            </a>

            <p className="text-center text-xs" style={{ color: '#8A7968' }}>
              After paying, enter your UTR / Transaction ID below ↓
            </p>
          </div>
        </div>

        {/* UTR Submission */}
        <div className="rounded-3xl p-6 shadow-sm"
          style={{ background: '#FFFDF9', border: '1px solid #E8DCCB' }}>
          <h2 className="font-display text-xl font-semibold mb-1" style={{ color: '#594333' }}>
            Submit Payment Proof
          </h2>
          <p className="text-xs mb-5" style={{ color: '#8A7968' }}>
            After completing the UPI payment, enter the transaction reference number below.
          </p>

          {error && (
            <div className="flex items-start gap-2 p-3 rounded-xl mb-4 text-sm"
              style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B' }}>
              <AlertCircle size={15} className="mt-0.5 flex-shrink-0" />
              <span className="text-xs">{error}</span>
            </div>
          )}

          {/* UTR input */}
          <div className="mb-4">
            <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#594333' }}>
              UPI Transaction ID / UTR Number *
            </label>
            <input type="text" value={utr}
              onChange={(e) => setUtr(e.target.value)}
              placeholder="e.g. 123456789012 or T2411211234..."
              className="w-full p-3 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 transition-all"
              style={{ background: '#FAF3E8', border: '1px solid #D8C4A8', color: '#594333' }} />
            <p className="text-[11px] mt-1" style={{ color: '#8A7968' }}>
              Find this in your UPI app under transaction history.
            </p>
          </div>

          {/* Screenshot upload */}
          <div className="mb-6">
            <label className="block text-[11px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: '#594333' }}>
              Payment Screenshot <span style={{ color: '#8A7968' }}>(optional but recommended)</span>
            </label>
            <label className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl cursor-pointer transition-all hover:border-[#A96845]"
              style={{ border: '2px dashed #D8C4A8', background: '#FAF3E8' }}>
              <input type="file" accept="image/*" className="hidden" onChange={handleScreenshot} />
              {screenshotPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={screenshotPreview} alt="Screenshot preview" className="max-h-32 rounded-xl object-contain" />
              ) : (
                <>
                  <Upload size={20} style={{ color: '#A96845' }} />
                  <span className="text-xs" style={{ color: '#8A7968' }}>Tap to upload payment screenshot</span>
                </>
              )}
            </label>
          </div>

          {/* Important notice */}
          <div className="rounded-xl p-3 mb-5"
            style={{ background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.3)' }}>
            <p className="text-xs font-medium" style={{ color: '#594333' }}>
              ⚠ <strong>Important:</strong> Your registration will be confirmed only after our team verifies the payment in our bank account. This may take a few hours.
            </p>
          </div>

          <button onClick={handleSubmitPayment} disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-60 shadow-md"
            style={{ background: '#A96845' }}>
            {submitting ? (
              <><Loader2 size={16} className="animate-spin" /> Submitting…</>
            ) : (
              'Submit Payment Details ✓'
            )}
          </button>
        </div>

      </div>
    </main>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#FAF3E8' }}>
        <Loader2 size={32} className="animate-spin" style={{ color: '#A96845' }} />
      </div>
    }>
      <PaymentPageInner />
    </Suspense>
  );
}

