'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { Mail, Send, MessageCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

type Props = {
  contactEmail: string;
};

export function ContactForm({ contactEmail }: Props) {
  const t = useTranslations('contact');
  const tForm = useTranslations('contact.form');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message'),
    };
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('failed');
      setSent(true);
      toast.success(tForm('success'));
      (e.target as HTMLFormElement).reset();
      setTimeout(() => setSent(false), 4000);
    } catch {
      toast.error(tForm('error', { email: contactEmail }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 md:py-28">
      <div className="container max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">{t('title')}</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">{t('subtitle')}</p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-8">
          {/* Lateral info */}
          <div className="space-y-4">
            <Card className="p-5 glass flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-sm font-semibold mb-1">{t('email')}</div>
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors break-all"
                  data-cta="contact-email"
                  data-cta-dest={`mailto:${contactEmail}`}
                >
                  {contactEmail}
                </a>
              </div>
            </Card>

            <Card className="p-5 glass flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                <Send className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <div className="text-sm font-semibold mb-1">{t('telegram')}</div>
                <a
                  href="https://t.me/JuanMaCryptoYoutube"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-secondary transition-colors"
                  data-cta="contact-telegram"
                  data-outbound="telegram-group"
                >
                  @JuanMaCryptoYoutube
                </a>
              </div>
            </Card>

            <Card className="p-5 glass flex items-start gap-3 border-accent/30">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                <MessageCircle className="h-5 w-5 text-accent" />
              </div>
              <div className="text-sm">
                Para partnerships, tarifas y propuestas profesionales, usa el formulario o el email.
                Tiempo de respuesta habitual: 24-48h.
              </div>
            </Card>
          </div>

          {/* Form */}
          <Card className="p-6 md:p-8 glass">
            <h3 className="font-display text-xl font-semibold mb-6">{tForm('title')}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{tForm('name')}</Label>
                  <Input id="name" name="name" required placeholder="Tu nombre" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{tForm('email')}</Label>
                  <Input id="email" name="email" type="email" required placeholder="tu@email.com" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">{tForm('subject')}</Label>
                <Input
                  id="subject"
                  name="subject"
                  required
                  placeholder="Partnership, colaboración…"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">{tForm('message')}</Label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  placeholder="Cuéntame en qué puedo ayudarte…"
                  rows={6}
                />
              </div>
              <Button
                type="submit"
                size="lg"
                variant="gradient"
                disabled={loading}
                className="w-full"
                data-cta="contact-submit"
                data-cta-id="contact-form-submit"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {tForm('sending')}
                  </>
                ) : sent ? (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    {tForm('success')}
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    {tForm('send')}
                  </>
                )}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </section>
  );
}
