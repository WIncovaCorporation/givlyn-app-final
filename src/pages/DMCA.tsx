import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const DMCA = () => {
  const { language } = useLanguage();

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

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <article className="prose prose-slate dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {language === 'es' ? 'Política DMCA / Copyright' : 'DMCA / Copyright Policy'}
          </h1>
          <p className="text-muted-foreground mb-4">
            {language === 'es' ? 'Última actualización: 21 de noviembre de 2025' : 'Last updated: November 21, 2025'}
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            Wincova Corporation
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              {language === 'es' ? '1. Política de Copyright' : '1. Copyright Policy'}
            </h2>
            <p className="text-foreground mb-4">
              {language === 'es'
                ? 'Wincova Corporation ("Givlyn") respeta los derechos de propiedad intelectual de terceros y espera que nuestros usuarios hagan lo mismo. De acuerdo con la Digital Millennium Copyright Act (DMCA), responderemos rápidamente a las notificaciones de presunta infracción de copyright.'
                : 'Wincova Corporation ("Givlyn") respects the intellectual property rights of others and expects our users to do the same. In accordance with the Digital Millennium Copyright Act (DMCA), we will respond promptly to notices of alleged copyright infringement.'}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              {language === 'es' ? '2. Proceso de Notificación' : '2. Notification Process'}
            </h2>
            <p className="text-foreground mb-4">
              {language === 'es'
                ? 'Si crees que tu contenido protegido por copyright ha sido copiado de una manera que constituye infracción de copyright, por favor proporciona a nuestro Agente de Copyright la siguiente información por escrito:'
                : 'If you believe that your copyrighted work has been copied in a way that constitutes copyright infringement, please provide our Copyright Agent with the following information in writing:'}
            </p>
            <ul className="list-disc pl-6 text-foreground space-y-2">
              <li>
                {language === 'es'
                  ? 'Identificación del trabajo protegido por copyright que se alega ha sido infringido'
                  : 'Identification of the copyrighted work claimed to have been infringed'}
              </li>
              <li>
                {language === 'es'
                  ? 'Identificación del material que se alega está infringiendo y su ubicación en el sitio'
                  : 'Identification of the material that is claimed to be infringing and its location on the site'}
              </li>
              <li>
                {language === 'es'
                  ? 'Tu información de contacto (dirección, teléfono, correo electrónico)'
                  : 'Your contact information (address, telephone number, email)'}
              </li>
              <li>
                {language === 'es'
                  ? 'Una declaración de que crees de buena fe que el uso no está autorizado'
                  : 'A statement that you have a good faith belief that the use is not authorized'}
              </li>
              <li>
                {language === 'es'
                  ? 'Una declaración bajo pena de perjurio de que la información es precisa'
                  : 'A statement under penalty of perjury that the information is accurate'}
              </li>
              <li>
                {language === 'es'
                  ? 'Tu firma física o electrónica'
                  : 'Your physical or electronic signature'}
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              {language === 'es' ? '3. Agente de Copyright Designado' : '3. Designated Copyright Agent'}
            </h2>
            <div className="bg-muted p-6 rounded-lg">
              <p className="text-foreground font-semibold mb-2">Wincova Corporation</p>
              <p className="text-foreground mb-1">DMCA Agent</p>
              <p className="text-muted-foreground mb-1">2615 Medical Center Parkway, Suite 1560</p>
              <p className="text-muted-foreground mb-1">Murfreesboro, TN 37129</p>
              <p className="text-muted-foreground mb-1">United States</p>
              <p className="text-muted-foreground mb-1">
                Email: <a href="mailto:legal@givlyn.com" className="text-primary hover:underline">legal@givlyn.com</a>
              </p>
              <p className="text-muted-foreground">
                Phone: <a href="tel:+16157289932" className="text-primary hover:underline">+1 615-728-9932</a>
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              {language === 'es' ? '4. Contra-Notificación' : '4. Counter-Notification'}
            </h2>
            <p className="text-foreground mb-4">
              {language === 'es'
                ? 'Si crees que tu contenido fue removido por error o identificación errónea, puedes enviar una contra-notificación que contenga:'
                : 'If you believe your content was removed by mistake or misidentification, you may submit a counter-notification containing:'}
            </p>
            <ul className="list-disc pl-6 text-foreground space-y-2">
              <li>
                {language === 'es'
                  ? 'Tu firma física o electrónica'
                  : 'Your physical or electronic signature'}
              </li>
              <li>
                {language === 'es'
                  ? 'Identificación del contenido que fue removido y su ubicación anterior'
                  : 'Identification of the content that was removed and its previous location'}
              </li>
              <li>
                {language === 'es'
                  ? 'Una declaración bajo pena de perjurio de que el contenido fue removido por error'
                  : 'A statement under penalty of perjury that the content was removed by mistake'}
              </li>
              <li>
                {language === 'es'
                  ? 'Tu nombre, dirección, número de teléfono y consentimiento a la jurisdicción judicial'
                  : 'Your name, address, phone number, and consent to judicial jurisdiction'}
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              {language === 'es' ? '5. Política de Infractores Repetidos' : '5. Repeat Infringer Policy'}
            </h2>
            <p className="text-foreground mb-4">
              {language === 'es'
                ? 'Givlyn tiene una política de terminar, en circunstancias apropiadas, las cuentas de usuarios que son infractores repetidos de los derechos de copyright de terceros.'
                : 'Givlyn has a policy of terminating, in appropriate circumstances, the accounts of users who are repeat infringers of third-party copyright rights.'}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              {language === 'es' ? '6. Contenido de Afiliados' : '6. Affiliate Content'}
            </h2>
            <p className="text-foreground mb-4">
              {language === 'es'
                ? 'Givlyn muestra productos de terceros a través de enlaces de afiliados. Todo el contenido de productos (imágenes, descripciones, nombres) es propiedad de sus respectivos dueños (Amazon, Walmart, Target, Best Buy, Etsy, etc.). No reclamamos propiedad sobre este contenido y lo mostramos bajo sus respectivos programas de afiliados.'
                : 'Givlyn displays third-party products through affiliate links. All product content (images, descriptions, names) is owned by their respective owners (Amazon, Walmart, Target, Best Buy, Etsy, etc.). We do not claim ownership of this content and display it under their respective affiliate programs.'}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              {language === 'es' ? '7. Contenido Generado por Usuarios' : '7. User-Generated Content'}
            </h2>
            <p className="text-foreground mb-4">
              {language === 'es'
                ? 'Los usuarios son responsables del contenido que publican en Givlyn (listas de deseos, descripciones, etc.). Al publicar contenido, los usuarios garantizan que tienen los derechos necesarios y no infringen los derechos de terceros.'
                : 'Users are responsible for content they post on Givlyn (wishlists, descriptions, etc.). By posting content, users warrant that they have the necessary rights and are not infringing on third-party rights.'}
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-4">
              {language === 'es' ? '8. Contacto' : '8. Contact'}
            </h2>
            <p className="text-foreground mb-4">
              {language === 'es'
                ? 'Para cualquier pregunta sobre esta política DMCA, por favor contáctanos en:'
                : 'For any questions about this DMCA policy, please contact us at:'}
            </p>
            <p className="text-foreground">
              Email: <a href="mailto:legal@givlyn.com" className="text-primary hover:underline">legal@givlyn.com</a>
            </p>
          </section>

          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
              <strong>{language === 'es' ? 'Versión:' : 'Version:'}</strong> 1.0<br />
              <strong>{language === 'es' ? 'Fecha de entrada en vigor:' : 'Effective date:'}</strong>{' '}
              {language === 'es' ? '21 de noviembre de 2025' : 'November 21, 2025'}
            </p>
          </div>
        </article>
      </main>
    </div>
  );
};

export default DMCA;
