import { useState, useEffect } from 'react';
import { Calendar, Target, Lightbulb, Rocket, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import SEO from '@/components/SEO';
import { OrganizationSchema } from '@/components/StructuredData';
import { supabase, type HistoryItem } from '@/lib/supabase';

interface GroupedHistory {
  [year: string]: {
    [month: string]: HistoryItem[];
  };
}

export default function About() {
  const { t, i18n } = useTranslation('about');
  const mission = useScrollAnimation();
  const history = useScrollAnimation();

  const [historyData, setHistoryData] = useState<GroupedHistory>({});
  const [openYears, setOpenYears] = useState<{ [key: string]: boolean }>({});
  const [loadingHistory, setLoadingHistory] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    try {
      const { data, error } = await supabase
        .from('history')
        .select('*')
        .order('year_month', { ascending: false });

      if (error) throw error;

      const grouped: GroupedHistory = {};
      data?.forEach((item) => {
        const [year, month] = item.year_month.split('-');
        if (!grouped[year]) {
          grouped[year] = {};
          setOpenYears((prev) => ({ ...prev, [year]: year === new Date().getFullYear().toString() }));
        }
        if (!grouped[year][month]) {
          grouped[year][month] = [];
        }
        grouped[year][month].push(item);
      });

      setHistoryData(grouped);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoadingHistory(false);
    }
  }

  const toggleYear = (year: string) => {
    setOpenYears((prev) => ({ ...prev, [year]: !prev[year] }));
  };

  const getMonthName = (month: string) => {
    const monthNum = parseInt(month);
    
    if (i18n.language === 'en') {
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                          'July', 'August', 'September', 'October', 'November', 'December'];
      return monthNames[monthNum - 1];
    }
    return `${monthNum}월`;
  };

  return (
    <>
      <SEO
        title="더에이아이랩 - AI for Everyone, for Everything"
        description="더에이아이랩은 누구나 쉽게 배우고, 일상과 업무에서 실질적으로 활용할 수 있도록 보편적 인공지능 시대를 지향합니다."
        keywords="AI, 인공지능, AI교육, AICE, 생성형AI, 더에이아이랩"
        path="/"
      />
      <OrganizationSchema />
      
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-[#1e1b4b] via-[#5b21b6] to-[#a855f7] py-20 md:py-32 overflow-hidden">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 left-0 w-full h-full text-white" style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
              backgroundSize: '48px 48px'
            }}></div>
          </div>

          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <Rocket className="absolute top-20 left-[10%] w-12 h-12 text-white/20 animate-float" />
            <Lightbulb className="absolute top-32 right-[15%] w-16 h-16 text-white/20 animate-float animation-delay-2000" />
            <Target className="absolute bottom-32 left-[20%] w-14 h-14 text-white/20 animate-float animation-delay-4000" />
            <Users className="absolute bottom-20 right-[10%] w-12 h-12 text-white/20 animate-float animation-delay-1000" />
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
                  <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white animate-slide-up">
                    {t('hero.title')}
                  </h1>
                  <div className="w-24 h-1 bg-gradient-to-r from-white to-purple-200 mx-auto mb-6 rounded-full animate-slide-up animate-delay-100"></div>
                  {t('hero.description') && (
                    <p className="text-lg md:text-xl text-white/90 leading-relaxed animate-slide-up animate-delay-200 max-w-3xl mx-auto">
                      {t('hero.description')}
                    </p>
                  )}
            </div>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section ref={mission.ref as any} className="py-16 md:py-24 bg-gradient-to-br from-slate-50 via-background to-gray-50 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-10 w-72 h-72 bg-slate-200 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
            <div className="absolute top-40 right-10 w-72 h-72 bg-gray-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-slate-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className={`max-w-7xl mx-auto transition-all duration-700 ${
              mission.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                {/* Vision Card */}
                <div className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-slate-400 to-gray-400 rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
                  <div className="relative bg-white rounded-3xl p-8 md:p-10 lg:p-12 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col border border-slate-200">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300">
                      <Rocket className="w-8 h-8 text-white" />
                    </div>
                    
                    <div className="inline-block px-4 py-1 bg-slate-100 text-slate-700 rounded-full text-sm font-semibold mb-4 self-start">
                      {t('vision.badge')}
                    </div>

                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                      {t('vision.title')}
                    </h3>

                    <p className="text-lg md:text-xl font-semibold text-slate-700 mb-6">
                      {t('vision.titleEn')}
                    </p>

                    <p className="text-base text-gray-600 mb-6 font-medium">
                      {t('vision.titleKo')}
                    </p>

                    <p className="text-base text-gray-600 leading-relaxed flex-1">
                      {t('vision.description')}
                    </p>

                    <div className="mt-6 flex items-center gap-2 text-slate-600">
                      <div className="w-12 h-1 bg-gradient-to-r from-slate-600 to-slate-700 rounded-full"></div>
                      <Target className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Mission Card */}
                <div className="group relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-gray-400 to-slate-400 rounded-3xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
                  <div className="relative bg-white rounded-3xl p-8 md:p-10 lg:p-12 shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col border border-gray-200">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300">
                      <Lightbulb className="w-8 h-8 text-white" />
                    </div>
                    
                    <div className="inline-block px-4 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-semibold mb-4 self-start">
                      {t('mission.badge')}
                    </div>

                    <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                      {t('mission.title')}
                    </h3>

                    <p className="text-lg md:text-xl font-semibold text-gray-700 mb-6">
                      {t('mission.titleEn')}
                    </p>

                    <p className="text-base text-gray-600 mb-6 font-medium">
                      {t('mission.titleKo')}
                    </p>

                    <p className="text-base text-gray-600 leading-relaxed flex-1">
                      {t('mission.description')}
                    </p>

                    <div className="mt-6 flex items-center gap-2 text-gray-600">
                      <div className="w-12 h-1 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full"></div>
                      <Users className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* History Section */}
        <section ref={history.ref as any} className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className={`max-w-4xl mx-auto transition-all duration-700 ${
              history.isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {t('history.title')}
                </h2>
                <p className="text-lg text-muted-foreground">
                  {t('history.subtitle')}
                </p>
              </div>

              {loadingHistory ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                  <p className="text-muted-foreground mt-4">불러오는 중...</p>
                </div>
              ) : Object.keys(historyData).length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  아직 등록된 교육 이력이 없습니다.
                </div>
              ) : (
                <div className="divide-y divide-border rounded-lg border bg-card shadow-sm">
                  {Object.keys(historyData)
                    .sort((a, b) => b.localeCompare(a))
                    .map((year) => (
                      <div key={year}>
                        <button
                          onClick={() => toggleYear(year)}
                          className="w-full px-6 py-5 flex items-center justify-between hover:bg-muted/50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-muted-foreground" />
                            <h3 className="text-lg md:text-xl font-semibold">
                              {i18n.language === 'en' ? year : `${year}년`}
                            </h3>
                          </div>
                          <svg
                            className={`h-5 w-5 text-muted-foreground transition-transform ${
                              openYears[year] ? 'rotate-180' : ''
                            }`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        {openYears[year] && (
                          <div className="px-6 pb-8 pt-4 bg-muted/20">
                            <div className="space-y-8">
                              {Object.keys(historyData[year])
                                .sort((a, b) => parseInt(a) - parseInt(b))
                                .map((month) => (
                                  <div key={month}>
                                    <div className="flex items-baseline gap-3 mb-4">
                                      <span className="text-lg font-semibold text-primary">
                                        {getMonthName(month)}
                                      </span>
                                      <div className="flex-1 h-px bg-border"></div>
                                    </div>
                                    <div className="space-y-3">
                                      {historyData[year][month].map((item) => (
                                        <div
                                          key={item.id}
                                          className="flex items-start gap-4 p-4 rounded-lg bg-background hover:bg-muted/50 transition-colors border border-border"
                                        >
                                          {item.logo_url && (
                                            <div className="w-16 h-16 flex items-center justify-center flex-shrink-0 bg-white rounded-lg border border-border p-2">
                                              <img
                                                src={item.logo_url}
                                                alt={item.client || 'Logo'}
                                                className="w-full h-full object-contain"
                                              />
                                            </div>
                                          )}
                                          <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                              <h4 className="font-semibold text-foreground text-base">
                                                {item.client}
                                              </h4>
                                              {item.major_category && (
                                                <span className="text-xs px-3 py-1 bg-primary/10 text-primary rounded-full whitespace-nowrap font-medium">
                                                  {item.major_category}
                                                  {item.sub_category && ` - ${item.sub_category}`}
                                                </span>
                                              )}
                                            </div>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                              {item.education_content}
                                            </p>
                                            {item.participants && (
                                              <p className="text-xs text-muted-foreground mt-1">
                                                {i18n.language === 'en' 
                                                  ? `Participants: ${item.participants}` 
                                                  : `참여인원: ${item.participants}명`}
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>
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
