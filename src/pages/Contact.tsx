import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      toast({
        title: language === 'es' ? '¡Mensaje Enviado!' : 'Message Sent!',
        description: language === 'es'
          ? 'Gracias por contactarnos. Te responderemos pronto.'
          : 'Thank you for contacting us. We will respond soon.',
      });
      setFormData({ name: '', email: '', subject: '', message: '' });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {language === 'es' ? 'Volver' : 'Back'}
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {language === 'es' ? 'Contáctanos' : 'Contact Us'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === 'es'
              ? 'Estamos aquí para ayudarte. Envíanos un mensaje y te responderemos lo antes posible.'
              : 'We are here to help. Send us a message and we will respond as soon as possible.'}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>{language === 'es' ? 'Envíanos un Mensaje' : 'Send us a Message'}</CardTitle>
              <CardDescription>
                {language === 'es'
                  ? 'Completa el formulario y nos pondremos en contacto contigo.'
                  : 'Fill out the form and we will get in touch with you.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="text-sm font-medium text-foreground">
                    {language === 'es' ? 'Nombre' : 'Name'}
                  </label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="text-sm font-medium text-foreground">
                    {language === 'es' ? 'Correo Electrónico' : 'Email'}
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="text-sm font-medium text-foreground">
                    {language === 'es' ? 'Asunto' : 'Subject'}
                  </label>
                  <Input
                    id="subject"
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    className="mt-1"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="text-sm font-medium text-foreground">
                    {language === 'es' ? 'Mensaje' : 'Message'}
                  </label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={5}
                    className="mt-1"
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting
                    ? (language === 'es' ? 'Enviando...' : 'Sending...')
                    : (language === 'es' ? 'Enviar Mensaje' : 'Send Message')}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>{language === 'es' ? 'Información de Contacto' : 'Contact Information'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">
                      {language === 'es' ? 'Dirección' : 'Address'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      2615 Medical Center Parkway, Suite 1560<br />
                      Murfreesboro, TN 37129<br />
                      United States
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">
                      {language === 'es' ? 'Teléfono' : 'Phone'}
                    </p>
                    <a href="tel:+16157289932" className="text-sm text-muted-foreground hover:text-primary">
                      +1 615-728-9932
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">
                      {language === 'es' ? 'Correos Electrónicos' : 'Email Addresses'}
                    </p>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <div>
                        <span className="font-medium">{language === 'es' ? 'General:' : 'General:'}</span>{' '}
                        <a href="mailto:hello@givlyn.com" className="hover:text-primary">hello@givlyn.com</a>
                      </div>
                      <div>
                        <span className="font-medium">{language === 'es' ? 'Soporte:' : 'Support:'}</span>{' '}
                        <a href="mailto:support@givlyn.com" className="hover:text-primary">support@givlyn.com</a>
                      </div>
                      <div>
                        <span className="font-medium">{language === 'es' ? 'Legal:' : 'Legal:'}</span>{' '}
                        <a href="mailto:legal@givlyn.com" className="hover:text-primary">legal@givlyn.com</a>
                      </div>
                      <div>
                        <span className="font-medium">{language === 'es' ? 'Privacidad:' : 'Privacy:'}</span>{' '}
                        <a href="mailto:privacy@givlyn.com" className="hover:text-primary">privacy@givlyn.com</a>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{language === 'es' ? 'Horario de Atención' : 'Business Hours'}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {language === 'es'
                    ? 'Lunes a Viernes: 9:00 AM - 6:00 PM (CST)'
                    : 'Monday to Friday: 9:00 AM - 6:00 PM (CST)'}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  {language === 'es'
                    ? 'Normalmente respondemos en 24-48 horas.'
                    : 'We typically respond within 24-48 hours.'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Contact;
