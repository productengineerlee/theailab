import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, MapPin } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import SEO from '@/components/SEO';
import { supabase, type CareerItem } from '@/lib/supabase';
import { useTranslation } from 'react-i18next';

export default function Career() {
  const { t } = useTranslation('career');
  const introRef = useScrollAnimation();
  const benefitsRef = useScrollAnimation();
  const processRef = useScrollAnimation();
  const jobPostingsRef = useScrollAnimation();
  const contactRef = useScrollAnimation();
  const locationRef = useScrollAnimation();
  
  const [jobPostings, setJobPostings] = useState<CareerItem[]>([]);
  const [benefits, setBenefits] = useState<CareerItem[]>([]);
  const [processSteps, setProcessSteps] = useState<CareerItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCareerData();
  }, []);

  async function fetchCareerData() {
    setLoading(true);
    
    // 채용 공고 가져오기
    const { data: jobData, error: jobError } = await supabase
      .from('career')
      .select('*')
      .eq('type', 'job_posting')
      .order('order_index');

    if (jobError) {
      console.error('Error fetching job postings:', jobError);
    } else {
      setJobPostings(jobData || []);
    }

    // 혜택 및 복지 가져오기
    const { data: benefitData, error: benefitError } = await supabase
      .from('career')
      .select('*')
      .eq('type', 'benefit')
      .order('order_index');

    if (benefitError) {
      console.error('Error fetching benefits:', benefitError);
    } else {
      setBenefits(benefitData || []);
    }

    // 채용 프로세스 가져오기
    const { data: processData, error: processError } = await supabase
      .from('career')
      .select('*')
      .eq('type', 'process')
      .order('order_index');

    if (processError) {
      console.error('Error fetching process:', processError);
    } else {
      setProcessSteps(processData || []);
    }
    
    setLoading(false);
  }

  return (
    <>
      <SEO
        title={t('seo.title')}
        description={t('seo.description')}
        keywords={t('seo.keywords')}
        path="/career"
      />
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-[#1e1b4b] via-[#5b21b6] to-[#a855f7] py-20 md:py-32 animate-fade-in">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white animate-slide-up">
                {t('hero.title')}
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8 animate-slide-up animate-delay-200">
                {t('hero.subtitle')}
              </p>
            </div>
          </div>
        </section>

        {/* Introduction Section */}
        <section ref={introRef.ref as any} className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className={`max-w-4xl mx-auto transition-all duration-700 ${
              introRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <div className="prose prose-lg max-w-none text-center">
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {t('intro.paragraph1')}
                </p>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {t('intro.paragraph2')}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {t('intro.paragraph3')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section ref={benefitsRef.ref as any} className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className={`max-w-6xl mx-auto transition-all duration-700 ${
              benefitsRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                {t('benefits.title')}
              </h2>
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">{t('loading')}</p>
                </div>
              ) : benefits.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">{t('noBenefits')}</p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {benefits.map((benefit, index) => (
                    <Card key={benefit.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="py-8 px-6">
                        <div className="space-y-4">
                          <div className="text-2xl font-bold text-primary">
                            {String(index + 1).padStart(2, '0')}
                          </div>
                          <div className="min-h-[80px]">
                            <p className="text-base font-medium leading-relaxed">{benefit.title}</p>
                            {benefit.description && (
                              <p className="text-sm text-muted-foreground mt-2">{benefit.description}</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section ref={processRef.ref as any} className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className={`max-w-6xl mx-auto transition-all duration-700 ${
              processRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
                {t('process.title')}
              </h2>
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">{t('loading')}</p>
                </div>
              ) : processSteps.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">{t('noProcess')}</p>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                  {processSteps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                      <div className="flex flex-col items-center">
                        <div 
                          className={`w-40 h-40 rounded-full flex flex-col items-center justify-center text-center transition-all hover:scale-105 ${
                            index === processSteps.length - 1 
                              ? 'bg-primary text-primary-foreground shadow-lg' 
                              : 'bg-muted hover:bg-muted/80'
                          }`}
                        >
                          <div className="text-xl font-bold mb-2">
                            {String(index + 1).padStart(2, '0')}
                          </div>
                          <div className="text-base font-semibold px-4">
                            {step.title}
                          </div>
                        </div>
                        {step.description && (
                          <p className="text-sm text-muted-foreground mt-4 text-center max-w-[160px]">
                            {step.description}
                          </p>
                        )}
                      </div>
                      {index < processSteps.length - 1 && (
                        <div className="hidden md:block text-4xl text-muted-foreground/30 mx-4">
                          ›
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Job Postings Section */}
        <section ref={jobPostingsRef.ref as any} className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className={`max-w-6xl mx-auto transition-all duration-700 ${
              jobPostingsRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                {t('positions.title')}
              </h2>
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">{t('positions.loadingJobs')}</p>
                </div>
              ) : jobPostings.length === 0 ? (
                <div className="text-center py-12">
                  <Card className="max-w-2xl mx-auto">
                    <CardContent className="py-12">
                      <p className="text-muted-foreground text-lg">
                        {t('positions.noJobs1')}
                      </p>
                      <p className="text-muted-foreground mt-4">
                        {t('positions.noJobs2')}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="space-y-6">
                  {jobPostings.map((posting) => (
                    <Card key={posting.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-2xl">{posting.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div 
                          className="prose prose-lg max-w-none text-muted-foreground"
                          dangerouslySetInnerHTML={{ __html: posting.description.replace(/\n/g, '<br />') }}
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section ref={contactRef.ref as any} className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className={`max-w-4xl mx-auto transition-all duration-700 ${
              contactRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                {t('contact.title')}
              </h2>
              <Card className="text-center">
                <CardContent className="py-12">
                  <p className="text-muted-foreground mb-6 text-lg">
                    {t('contact.description')}
                  </p>
                  <a
                    href="mailto:sanders@codingx.ai"
                    className="inline-flex items-center gap-2 text-primary hover:underline text-xl font-medium"
                  >
                    <Mail className="h-5 w-5" />
                    sanders@codingx.ai
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Location Section */}
        <section ref={locationRef.ref as any} className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className={`max-w-6xl mx-auto transition-all duration-700 ${
              locationRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                {t('location.title')}
              </h2>
              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-8">
                    <div className="flex items-start gap-3 mb-6">
                      <MapPin className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-xl font-semibold mb-2">{t('location.headquarters')}</p>
                        <p className="text-lg text-muted-foreground">
                          {t('location.address')}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="relative w-full h-[400px] bg-muted">
                    <iframe
                      title={t('location.mapTitle')}
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3165.2514837446746!2d127.04235731559824!3d37.50586383490574!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x357ca3f1b2b5b5b5%3A0x1b5b5b5b5b5b5b5!2z7ISc7Jq47Yq567OE7IucIOqwleuCqOq1rCDsmIHrj5nripjroZwgMzI0!5e0!3m2!1sko!2skr!4v1234567890123!5m2!1sko!2skr"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
