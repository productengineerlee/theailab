import { useState, useEffect } from 'react';
import { supabase, type AboutItem } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pencil, Save, X } from 'lucide-react';

const SECTION_LABELS: Record<string, string> = {
  hero: 'Hero 섹션 (ABOUT US)',
  mission: 'Mission 섹션',
  vision: 'Vision 섹션',
};

export default function AboutManage() {
  const [items, setItems] = useState<AboutItem[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<AboutItem>>({
    section: 'hero',
    title_en: '',
    title_ko: '',
    subtitle: '',
    content: '',
  });

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    const { data, error } = await supabase
      .from('about')
      .select('*')
      .order('order_index');

    if (error) {
      console.error('Error fetching about:', error);
    } else {
      setItems(data || []);
    }
  }

  async function handleSave() {
    if (!formData.content) {
      alert('본문 내용을 입력하세요.');
      return;
    }

    console.log('💾 저장할 데이터:', formData);

    if (editingId) {
      const { data, error } = await supabase
        .from('about')
        .update(formData)
        .eq('id', editingId)
        .select();

      console.log('✏️ 수정 결과:', { data, error });

      if (error) {
        console.error('❌ 저장 실패:', error);
        alert(`저장 실패: ${error.message}`);
        return;
      }

      alert('저장되었습니다! ✅');
      setEditingId(null);
      await fetchItems();
    }

    setFormData({
      section: 'hero',
      title_en: '',
      title_ko: '',
      subtitle: '',
      content: '',
    });
  }

  function handleEdit(item: AboutItem) {
    setEditingId(item.id!);
    setFormData({
      section: item.section,
      title_en: item.title_en || '',
      title_ko: item.title_ko || '',
      subtitle: item.subtitle || '',
      content: item.content || '',
    });
  }

  function handleCancel() {
    setEditingId(null);
    setFormData({
      section: 'hero',
      title_en: '',
      title_ko: '',
      subtitle: '',
      content: '',
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">About 관리</h1>
          <p className="text-muted-foreground">About 페이지의 내용을 수정합니다</p>
        </div>
      </div>

      {/* 수정 폼 */}
      {editingId && (
        <Card>
          <CardHeader>
            <CardTitle>
              {SECTION_LABELS[formData.section || 'hero']} 수정
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              {formData.section !== 'hero' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="title_en">영문 제목</Label>
                    <Input
                      id="title_en"
                      value={formData.title_en}
                      onChange={(e) =>
                        setFormData({ ...formData, title_en: e.target.value })
                      }
                      placeholder="AI for Everyone, for Everything"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="title_ko">한글 부제목</Label>
                    <Input
                      id="title_ko"
                      value={formData.title_ko}
                      onChange={(e) =>
                        setFormData({ ...formData, title_ko: e.target.value })
                      }
                      placeholder="모든 사람을 위한, 모든 것을 위한 AI"
                    />
                  </div>
                </>
              )}

              {formData.section === 'hero' && (
                <div className="space-y-2">
                  <Label htmlFor="title_en">제목</Label>
                  <Input
                    id="title_en"
                    value={formData.title_en}
                    onChange={(e) =>
                      setFormData({ ...formData, title_en: e.target.value })
                    }
                    placeholder="ABOUT US"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="content">본문 내용 *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="내용을 입력하세요"
                  className="min-h-[150px]"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                저장
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                <X className="mr-2 h-4 w-4" />
                취소
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 항목 목록 */}
      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-sm px-3 py-1 bg-primary/10 text-primary rounded font-medium">
                      {SECTION_LABELS[item.section]}
                    </span>
                  </div>

                  {item.section !== 'hero' && (
                    <>
                      {item.title_en && (
                        <h3 className="text-2xl font-bold">{item.title_en}</h3>
                      )}
                      {item.title_ko && (
                        <p className="text-lg text-muted-foreground">
                          {item.title_ko}
                        </p>
                      )}
                    </>
                  )}

                  {item.section === 'hero' && item.title_en && (
                    <h3 className="text-2xl font-bold">{item.title_en}</h3>
                  )}

                  {item.content && (
                    <p className="text-base text-muted-foreground leading-relaxed">
                      {item.content}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(item)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {items.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">
              등록된 항목이 없습니다. 데이터베이스 마이그레이션을 실행하세요.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

