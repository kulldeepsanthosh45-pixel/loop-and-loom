'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, MessageSquare, Clock } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'general',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="pt-24 pb-20 bg-bg min-h-screen">
      {/* Header */}
      <section className="bg-card border-b border-border py-12 sm:py-16 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <span className="text-xs uppercase tracking-widest text-accent font-semibold mb-2 block">
            Get in Touch
          </span>
          <h1 className="font-display text-4xl sm:text-5xl text-text mb-4">
            We Would Love to Hear From You
          </h1>
          <p className="text-sm text-muted max-w-xl mx-auto leading-relaxed">
            Have a question about a handmade piece, custom color commissions, or our crochet video masterclasses? Drop us a line below.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Contact Details Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-card rounded-2xl border border-border p-6 sm:p-8 space-y-6 shadow-sm">
              <h2 className="font-display text-2xl text-text">Studio &amp; Atelier</h2>

              <div className="space-y-5 text-xs text-text">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-accent/15 text-accent flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text text-sm">Artisan Studio</h4>
                    <p className="text-muted mt-0.5">
                      42, 3rd Cross, Indiranagar<br />
                      Bengaluru, Karnataka 560038, India
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-accent/15 text-accent flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text text-sm">Email Us</h4>
                    <p className="text-muted mt-0.5">hello@loopandloom.in</p>
                    <p className="text-muted">academy@loopandloom.in</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-accent/15 text-accent flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text text-sm">WhatsApp &amp; Support</h4>
                    <p className="text-muted mt-0.5">+91 98765 43210</p>
                    <p className="text-[10px] text-muted">Mon – Sat, 10:00 AM – 6:00 PM IST</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-accent/15 text-accent flex items-center justify-center flex-shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-text text-sm">Response Time</h4>
                    <p className="text-muted mt-0.5">We typically reply within 24 business hours.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Column */}
          <div className="lg:col-span-7 bg-card rounded-2xl border border-border p-6 sm:p-8 shadow-sm">
            <h2 className="font-display text-2xl text-text mb-2">Send a Message</h2>
            <p className="text-xs text-muted mb-6">
              Fill out the form and our studio team will get back to you promptly.
            </p>

            {submitted ? (
              <div className="p-8 text-center bg-bg rounded-2xl border border-border space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="font-display text-2xl text-text">Message Dispatched!</h3>
                <p className="text-xs text-muted max-w-sm mx-auto">
                  Thank you for reaching out to Loop &amp; Loom. Priya or a studio associate will reply to your email shortly.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-xs font-semibold text-accent underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-text uppercase tracking-wider mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Radhika"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-border bg-bg text-text focus:outline-none focus:border-accent"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-text uppercase tracking-wider mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="radhika@example.com"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-border bg-bg text-text focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-text uppercase tracking-wider mb-1">
                    Subject / Topic *
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-border bg-bg text-text focus:outline-none focus:border-accent"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="custom">Custom Handmade Commission</option>
                    <option value="courses">Course / Academy Question</option>
                    <option value="order">Order Tracking &amp; Delivery</option>
                    <option value="wholesale">Wholesale &amp; Gifting</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-text uppercase tracking-wider mb-1">
                    Message *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us what you have in mind..."
                    className="w-full text-xs p-3.5 rounded-xl border border-border bg-bg text-text focus:outline-none focus:border-accent"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto bg-accent text-card font-medium text-xs py-3 px-8 rounded-xl hover:bg-accent/90 transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" /> Dispatched Note
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
