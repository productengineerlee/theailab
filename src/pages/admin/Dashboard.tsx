import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Heart, History, Package, Users, Briefcase, Newspaper } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminDashboard() {
  const [counts, setCounts] = useState({
    about: 0,
    culture: 0,
    history: 0,
    product: 0,
    partner: 0,
    career: 0,
    news: 0,
  });

  useEffect(() => {
    async function fetchCounts() {
      try {
        const [about, culture, history, product, partner, career, news] = await Promise.all([
          supabase.from('about').select('*', { count: 'exact', head: true }),
          supabase.from('culture').select('*', { count: 'exact', head: true }),
          supabase.from('history').select('*', { count: 'exact', head: true }),
          supabase.from('product').select('*', { count: 'exact', head: true }),
          supabase.from('partner').select('*', { count: 'exact', head: true }),
          supabase.from('career').select('*', { count: 'exact', head: true }),
          supabase.from('news').select('*', { count: 'exact', head: true }),
        ]);

        setCounts({
          about: about.count || 0,
          culture: culture.count || 0,
          history: history.count || 0,
          product: product.count || 0,
          partner: partner.count || 0,
          career: career.count || 0,
          news: news.count || 0,
        });
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    }

    fetchCounts();
  }, []);

  const stats = [
    { title: 'About', count: counts.about, icon: FileText, color: 'text-slate-600' },
    { title: 'Culture', count: counts.culture, icon: Heart, color: 'text-pink-600' },
    { title: 'History', count: counts.history, icon: History, color: 'text-blue-600' },
    { title: 'Product', count: counts.product, icon: Package, color: 'text-green-600' },
    { title: 'Partner', count: counts.partner, icon: Users, color: 'text-purple-600' },
    { title: 'Career', count: counts.career, icon: Briefcase, color: 'text-orange-600' },
    { title: 'News', count: counts.news, icon: Newspaper, color: 'text-red-600' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">대시보드</h1>
        <p className="text-muted-foreground">관리 시스템 개요</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.count}</div>
                <p className="text-xs text-muted-foreground">총 항목 수</p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}



