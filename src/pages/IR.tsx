import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SEO from '@/components/SEO';
import { useTranslation } from 'react-i18next';

export default function IR() {
  const { t, i18n } = useTranslation('ir');
  const companyInfo = [
    { label: t('companyInfo.companyName'), value: '더에이아이랩(주)' },
    { label: t('companyInfo.ceo'), value: '최영준' },
    { label: t('companyInfo.founded'), value: '2020년' },
    { label: t('companyInfo.address'), value: i18n.language === 'en' ? '804, 324 Yeongdong-daero, Gangnam-gu, Seoul, South Korea' : '서울특별시 강남구 영동대로 324, 804호' },
    { label: t('companyInfo.businessNumber'), value: '439-87-00757' },
    { label: t('companyInfo.ecommerceNumber'), value: '제 2020-서울강남-02380' },
  ];

  return (
    <>
      <SEO
        title={t('seo.title')}
        description={t('seo.description')}
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

        {/* Company Info Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl md:text-3xl">
                    {t('companyInfo.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {companyInfo.map((info, index) => (
                      <div
                        key={index}
                        className="flex flex-col md:flex-row md:items-center py-3 border-b last:border-b-0"
                      >
                        <div className="md:w-1/3 font-semibold text-foreground mb-1 md:mb-0">
                          {info.label}
                        </div>
                        <div className="md:w-2/3 text-muted-foreground">
                          {info.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-8">
                <CardHeader>
                  <CardTitle className="text-2xl md:text-3xl">
                    {t('investmentInquiry.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    {t('investmentInquiry.description')}
                  </p>
                  <div className="space-y-2">
                    <p>
                      <span className="font-semibold">{t('investmentInquiry.email')}:</span>{' '}
                    <a
                      href="mailto:contact@theailab.co"
                      className="text-primary hover:underline"
                    >
                      contact@theailab.co
                    </a>
                  </p>
                  <p>
                    <span className="font-semibold">{t('investmentInquiry.tel')}:</span> 02-2039-9355
                  </p>
                  <p>
                    <span className="font-semibold">Fax:</span> 02-2039-9356
                  </p>
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
