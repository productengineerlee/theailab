import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ExternalLink, Image as ImageIcon } from 'lucide-react';
import { supabase, type PartnerItem } from '@/lib/supabase';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import SEO from '@/components/SEO';
import { useTranslation } from 'react-i18next';

export default function Partner() {
  const { t } = useTranslation('partner');
  const [partners, setPartners] = useState<PartnerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const partnersRef = useScrollAnimation();

  useEffect(() => {
    fetchPartners();
  }, []);

  async function fetchPartners() {
    setLoading(true);
    const { data, error } = await supabase
      .from('partner')
      .select('*')
      .order('order_index')
      .order('id');

    if (error) {
      console.error('Error fetching partners:', error);
    } else {
      setPartners(data || []);
    }
    setLoading(false);
  }

  return (
    <>
      <SEO
        title={t('seo.title')}
        description={t('seo.description')}
        keywords={t('seo.keywords')}
        path="/partner"
      />
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-[#1e1b4b] via-[#5b21b6] to-[#a855f7] py-20 md:py-32 animate-fade-in">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white animate-slide-up">
                {t('hero.title')}
              </h1>
              <p className="text-lg md:text-xl text-white/90 animate-slide-up animate-delay-200">
                {t('hero.subtitle')}
              </p>
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <section ref={partnersRef.ref as any} className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className={`max-w-6xl mx-auto transition-all duration-700 ${
              partnersRef.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="text-muted-foreground mt-4">{t('loading')}</p>
                </div>
              ) : partners.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">
                    {t('noPartners')}
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {partners.map((partner) => (
                    <Card
                      key={partner.id}
                      className="hover:shadow-lg transition-all hover:scale-105"
                    >
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {/* 로고 */}
                          <div className="flex items-center justify-center h-32">
                            {partner.logo_url ? (
                              <img 
                                src={partner.logo_url} 
                                alt={partner.name}
                                className="max-w-full max-h-full object-contain"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-muted rounded-md">
                                <ImageIcon className="w-16 h-16 text-muted-foreground" />
                              </div>
                            )}
                          </div>

                          {/* 회사명 */}
                          <div className="text-center">
                            <h3 className="text-xl font-semibold mb-2">
                              {partner.name}
                            </h3>
                            {partner.description && (
                              <p className="text-sm text-muted-foreground">
                                {partner.description}
                              </p>
                            )}
                          </div>

                          {/* 웹사이트 링크 */}
                          {partner.url && (
                            <div className="flex justify-center pt-2">
                              <a
                                href={partner.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-primary hover:underline text-sm"
                              >
                                웹사이트 방문
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
