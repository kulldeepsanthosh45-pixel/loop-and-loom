'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { WORKSHOP_CONFIG } from '@/lib/workshop-config';
import { ChevronRight, AlertCircle, Loader2 } from 'lucide-react';

function generateRegId(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let id = 'LL-WS-';
  for (let i = 0; i < 8; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
}

type Step = 'form' | 'submitting' | 'payment';

export default function WorkshopRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('form');
  const [error, setError] = useState('');
  const [regId, setRegId] = useState('');

  const [form, setForm] = useState({
    full_name: '',
    mobile: '',
    whatsapp: '',
    email: '',
    age_group: '',
    session: '' as 'saturday' | 'sunday' | '',
    craft_interests: [] as string[],
    previous_experience: 'none',
  });

  const toggleCraft = (id: string) => {
    setForm((f) => ({
      ...f,
      craft_interests: f.craft_interests.includes(id)
        ? f.craft_interests.filter((c) => c !== id)
        : [...f.craft_interests, id],
    }));
  };

  const validate = (): string => {
    if (!form.full_name.trim()) return 'Please enter your full name.';
    if (!/^[6-9]\d{9}$/.test(form.mobile.replace(/\s/g, ''))) return 'Enter a valid 10-digit Indian mobile number.';
    if (!/^[6-9]\d{9}$/.test(form.whatsapp.replace(/\s/g, ''))) return 'Enter a valid 10-digit WhatsApp number.';
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Enter a valid email address.';
    if (!form.age_group) return 'Please select your age group.';
    if (!form.session) return 'Please select a session (Saturday or Sunday).';
    if (form.craft_interests.length === 0) return 'Please select at least one craft activity.';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }
    setError('');
    setStep('submitting');

    // Check if mobile already registered for this session
    const { data: existing } = await supabase
      .from('workshop_registrations')
      .select('id')
      .eq('mobile', form.mobile.replace(/\s/g, ''))
      .eq('session', form.session)
      .neq('payment_status', 'REJECTED')
      .maybeSingle();

    if (existing) {
      setError('This mobile number is already registered for the selected session.');
      setStep('form');
      return;
    }

    // Check seat availability (only CONFIRMED count against capacity)
    const { data: settings } = await supabase
      .from('workshop_settings')
      .select('*')
      .single();

    const maxSeats = form.session === 'saturday'
      ? (settings?.max_seats_saturday ?? WORKSHOP_CONFIG.maxSeatsPerSession)
      : (settings?.max_seats_sunday ?? WORKSHOP_CONFIG.maxSeatsPerSession);

    const { count } = await supabase
      .from('workshop_registrations')
      .select('id', { count: 'exact', head: true })
      .eq('session', form.session)
      .eq('payment_status', 'CONFIRMED');

    if ((count ?? 0) >= maxSeats) {
      setError('Sorry, this session is fully booked. Please choose the other session.');
      setStep('form');
      return;
    }

    const newRegId = generateRegId();
    const fee = settings?.fee ?? WORKSHOP_CONFIG.fee;

    const { error: insertError } = await supabase
      .from('workshop_registrations')
      .insert({
        registration_id: newRegId,
        full_name: form.full_name.trim(),
        mobile: form.mobile.replace(/\s/g, ''),
        whatsapp: form.whatsapp.replace(/\s/g, ''),
        email: form.email.trim() || null,
        age_group: form.age_group,
        session: form.session,
        craft_interests: form.craft_interests,
        previous_experience: form.previous_experience,
        payment_status: 'PAYMENT_PENDING',
        amount: fee,
      });

    if (insertError) {
      setError('Registration failed. Please try again.');
      setStep('form');
      return;
    }

    setRegId(newRegId);
    router.push(`/workshops/payment?regId=${newRegId}`);
  };

  const sessions = [WORKSHOP_CONFIG.saturday, WORKSHOP_CONFIG.sunday];
  const inputCls = "w-full p-3 rounded-xl text-sm focus:outline-none focus:ring-2 transition-all"
    + " bg-[#FAF3E8] border border-[#D8C4A8] text-[#594333] focus:ring-[#A96845]/30 focus:border-[#A96845]";
  const labelCls = "block text-[11px] font-semibold uppercase tracking-wider mb-1.5 text-[#594333]";

  return (
    <main className="min-h-screen py-16 px-4" style={{ background: '#FAF3E8' }}>
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block text-[11px] tracking-[0.2em] uppercase font-semibold px-4 py-1.5 rounded-full mb-4"
            style={{ background: 'rgba(169,104,69,0.1)', color: '#A96845', border: '1px solid rgba(169,104,69,0.2)' }}>
            Workshop Registration
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold" style={{ color: '#594333' }}>
            Reserve Your Seat
          </h1>
          <p className="text-sm mt-2" style={{ color: '#8A7968' }}>
            Fill in your details below. Only {WORKSHOP_CONFIG.feeDisplay} · All materials included.
          </p>
        </div>

        {/* Form */}
        <div className="rounded-3xl shadow-sm p-4 sm:p-8"
          style={{ background: '#FFFDF9', border: '1px solid #E8DCCB' }}>

          {error && (
            <div className="flex items-start gap-2 p-4 rounded-xl mb-6 text-sm"
              style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#991B1B' }}>
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Full Name */}
            <div>
              <label className={labelCls}>Full Name *</label>
              <input type="text" required className={inputCls}
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                placeholder="e.g. Priya Sharma" />
            </div>

            {/* Mobile & WhatsApp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Mobile Number *</label>
                <input type="tel" required className={inputCls}
                  value={form.mobile}
                  onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                  placeholder="9876543210" maxLength={10} />
              </div>
              <div>
                <label className={labelCls}>WhatsApp Number *</label>
                <input type="tel" required className={inputCls}
                  value={form.whatsapp}
                  onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                  placeholder="9876543210" maxLength={10} />
                <button type="button" className="text-[11px] mt-1 hover:underline"
                  style={{ color: '#A96845' }}
                  onClick={() => setForm({ ...form, whatsapp: form.mobile })}>
                  Same as mobile
                </button>
              </div>
            </div>

            {/* Email & Age */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Email Address <span style={{ color: '#8A7968' }}>(optional)</span></label>
                <input type="email" className={inputCls}
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="priya@email.com" />
              </div>
              <div>
                <label className={labelCls}>Age Group *</label>
                <select required className={inputCls + " cursor-pointer"}
                  value={form.age_group}
                  onChange={(e) => setForm({ ...form, age_group: e.target.value })}>
                  <option value="">Select age group</option>
                  {WORKSHOP_CONFIG.ageGroups.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Session Selection */}
            <div>
              <label className={labelCls}>Preferred Session *</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {sessions.map((s) => (
                  <button key={s.key} type="button"
                    onClick={() => setForm({ ...form, session: s.key as 'saturday' | 'sunday' })}
                    className="p-4 rounded-2xl text-left transition-all"
                    style={{
                      border: form.session === s.key ? '2px solid #A96845' : '2px solid #E8DCCB',
                      background: form.session === s.key ? 'rgba(169,104,69,0.08)' : '#FAF3E8',
                    }}>
                    <p className="font-semibold text-sm" style={{ color: '#594333' }}>{s.date}</p>
                    <p className="text-xs mt-0.5" style={{ color: '#8A7968' }}>⏰ {s.time}</p>
                    {form.session === s.key && (
                      <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: '#A96845', color: '#fff' }}>Selected ✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Craft Interests */}
            <div>
              <label className={labelCls}>Craft Interests * (select all that interest you)</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {WORKSHOP_CONFIG.activities.map((act) => (
                  <button key={act.id} type="button"
                    onClick={() => toggleCraft(act.id)}
                    className="flex items-center gap-3 p-3 rounded-xl text-left transition-all"
                    style={{
                      border: form.craft_interests.includes(act.id) ? '2px solid #A96845' : '2px solid #E8DCCB',
                      background: form.craft_interests.includes(act.id) ? 'rgba(169,104,69,0.08)' : '#FAF3E8',
                    }}>
                    <span className="text-xl">{act.emoji}</span>
                    <div>
                      <p className="text-xs font-semibold" style={{ color: '#594333' }}>{act.label}</p>
                    </div>
                    {form.craft_interests.includes(act.id) && (
                      <span className="ml-auto text-xs font-bold" style={{ color: '#A96845' }}>✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Previous Experience */}
            <div>
              <label className={labelCls}>Previous Craft Experience</label>
              <select className={inputCls + " cursor-pointer"}
                value={form.previous_experience}
                onChange={(e) => setForm({ ...form, previous_experience: e.target.value })}>
                <option value="none">Complete Beginner — no experience</option>
                <option value="some">Some experience — tried crafts before</option>
                <option value="intermediate">Intermediate — do crafts regularly</option>
                <option value="advanced">Advanced — experienced crafter</option>
              </select>
            </div>

            {/* Price note */}
            <div className="rounded-2xl p-4 text-center"
              style={{ background: 'rgba(169,104,69,0.08)', border: '1px dashed #A96845' }}>
              <p className="text-sm font-semibold" style={{ color: '#594333' }}>
                Workshop Fee: <strong style={{ color: '#A96845' }}>{WORKSHOP_CONFIG.feeDisplay}</strong> per person
              </p>
              <p className="text-xs mt-1" style={{ color: '#8A7968' }}>
                Pay via UPI after registration. All materials included.
              </p>
            </div>

            {/* Submit */}
            <button type="submit" disabled={step === 'submitting'}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-60 shadow-md"
              style={{ background: '#A96845' }}>
              {step === 'submitting' ? (
                <><Loader2 size={16} className="animate-spin" /> Processing…</>
              ) : (
                <>Continue to Payment <ChevronRight size={16} /></>
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

