import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import SEO from '@/components/SEO';
import { supabase, type CultureItem } from '@/lib/supabase';
import { Target, Eye, Users, MessageSquare, MessageCircle, DoorOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function Culture() {
  const { t } = useTranslation('culture');
  const [principles, setPrinciples] = useState<CultureItem[]>([]);
  const [workMethods, setWorkMethods] = useState<CultureItem[]>([]);
  const [cultureValues, setCultureValues] = useState<CultureItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCultureData();
  }, []);

  async function fetchCultureData() {
    try {
      const { data, error } = await supabase
        .from('culture')
        .select('*')
        .order('order_index');

      if (error) throw error;

      // 섹션별로 데이터 분류 (Hero 제외)
      const principleItems = data?.filter(item => item.section === 'principle') || [];
      const workMethodItems = data?.filter(item => item.section === 'work_method') || [];
      const cultureValueItems = data?.filter(item => item.section === 'culture_value') || [];

      setPrinciples(principleItems);
      setWorkMethods(workMethodItems);
      setCultureValues(cultureValueItems);
    } catch (error) {
      console.error('Error fetching culture data:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <SEO
        title={t('seo.title')}
        description={t('seo.description')}
        keywords={t('seo.keywords')}
        path="/culture"
      />
      <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#1e1b4b] via-[#5b21b6] to-[#a855f7] py-20 md:py-32 animate-fade-in">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white animate-slide-up">
              {t('hero.title')}
            </h1>
            {t('hero.subtitle') && (
              <p className="text-lg md:text-xl text-white/90 mb-4 animate-slide-up animate-delay-200">
                {t('hero.subtitle')}
              </p>
            )}
            {t('hero.description') && (
              <p className="text-base md:text-lg text-white/80 leading-relaxed max-w-3xl mx-auto animate-slide-up animate-delay-400">
                {t('hero.description')}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 기업문화 7가지 원칙 */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              {t('sections.principle')}
            </h2>
            {loading ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-32 bg-gray-200 rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : principles.length === 0 ? (
              <p className="text-center text-muted-foreground">
                {t('noData')}
              </p>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {principles.map((principle, index) => (
                  <Card
                    key={principle.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                          {principle.content}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 업무방식 6가지 */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              {t('sections.workMethod')}
            </h2>
            {loading ? (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : workMethods.length === 0 ? (
              <p className="text-center text-muted-foreground">
                {t('noData')}
              </p>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {workMethods.map((method, index) => {
                  // 각 항목에 맞는 아이콘 매핑
                  const icons = [Target, Eye, Users, MessageSquare, MessageCircle, DoorOpen];
                  const Icon = icons[index] || Target;
                  
                  return (
                    <div
                      key={method.id}
                      className="group"
                    >
                      {/* 번호 */}
                      <div className="text-sm font-bold text-muted-foreground mb-4 flex items-center gap-2">
                        <div className="h-px flex-1 bg-border"></div>
                        <span>{String(index + 1).padStart(2, '0')}</span>
                      </div>

                      {/* 아이콘 */}
                      <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                        <Icon className="w-10 h-10 text-primary" />
                      </div>

                      {/* 제목 */}
                      <h3 className="text-xl font-bold mb-4 text-foreground leading-tight">
                        {method.title}
                      </h3>

                      {/* 설명 */}
                      <p className="text-base text-muted-foreground leading-relaxed">
                        {method.content}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 팀워크 문화 */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              {t('sections.cultureValue')}
            </h2>
            <p className="text-center text-muted-foreground mb-12">
              {t('sections.cultureValueSubtitle')}
            </p>
            {loading ? (
              <div className="grid gap-6 md:grid-cols-2">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-40 bg-gray-200 rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : cultureValues.length === 0 ? (
              <p className="text-center text-muted-foreground">
                {t('noData')}
              </p>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {cultureValues.map((value, index) => (
                  <Card
                    key={value.id}
                    className="hover:shadow-lg transition-shadow hover:border-primary/50"
                  >
                    <CardContent className="p-8">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold mb-3 text-foreground">
                            {value.title}
                          </h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {value.content}
                          </p>
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
    </div>
    </>
  );
}
