import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase, type CultureItem } from '@/lib/supabase';
import { Trash2, Edit2, Save, X, Plus } from 'lucide-react';

export default function CultureManage() {
  const [items, setItems] = useState<CultureItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState<Partial<CultureItem>>({
    section: 'principle',
    title: '',
    subtitle: '',
    content: '',
    order_index: 0,
  });
  const [editFormData, setEditFormData] = useState<Record<number, Partial<CultureItem>>>({});

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    try {
      console.log('Fetching culture items...');
      setLoading(true);
      
      const { data, error } = await supabase
        .from('culture')
        .select('*')
        .order('section')
        .order('order_index');

      if (error) {
        console.error('Supabase fetch error:', error);
        throw error;
      }
      
      console.log('Fetched culture items:', data);
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching culture items:', error);
      alert('데이터를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    try {
      // Insert only
      const { error } = await supabase
        .from('culture')
        .insert([formData]);

      if (error) throw error;
      
      // 먼저 데이터를 새로고침한 후 alert 표시
      await fetchItems();
      resetForm();
      alert('등록되었습니다.');
    } catch (error) {
      console.error('Error saving culture item:', error);
      alert('저장에 실패했습니다.');
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      const { error } = await supabase
        .from('culture')
        .delete()
        .eq('id', id);

      if (error) throw error;
      alert('삭제되었습니다.');
      fetchItems();
    } catch (error) {
      console.error('Error deleting culture item:', error);
      alert('삭제에 실패했습니다.');
    }
  }

  function handleEdit(item: CultureItem) {
    if (!item.id) return;
    setEditingId(item.id);
    setEditFormData({
      ...editFormData,
      [item.id]: {
        section: item.section,
        title: item.title || '',
        subtitle: item.subtitle || '',
        content: item.content || '',
        order_index: item.order_index || 0,
      }
    });
  }

  function cancelEdit(id: number) {
    setEditingId(null);
    const newEditFormData = { ...editFormData };
    delete newEditFormData[id];
    setEditFormData(newEditFormData);
  }

  async function saveEdit(id: number) {
    try {
      const data = editFormData[id];
      if (!data) {
        console.error('No form data found for id:', id);
        return;
      }

      console.log('Saving data:', data);

      // 먼저 업데이트만 수행
      const { error } = await supabase
        .from('culture')
        .update(data)
        .eq('id', id);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Update successful');

      // 로컬 상태 직접 업데이트
      setItems(prevItems => 
        prevItems.map(item => 
          item.id === id ? { ...item, ...data } : item
        )
      );

      // 편집 상태 초기화
      setEditingId(null);
      const newEditFormData = { ...editFormData };
      delete newEditFormData[id];
      setEditFormData(newEditFormData);
      
      alert('수정되었습니다.');
      
      // 백그라운드에서 전체 데이터 새로고침
      fetchItems();
    } catch (error) {
      console.error('Error updating item:', error);
      alert(`수정에 실패했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  }

  function resetForm() {
    setShowAddForm(false);
    setFormData({
      section: 'principle',
      title: '',
      subtitle: '',
      content: '',
      order_index: 0,
    });
  }

  const getSectionLabel = (section: string) => {
    const labels: Record<string, string> = {
      hero: 'Hero 섹션',
      principle: '우리의 기업문화',
      work_method: '업무방식',
      culture_value: '존중과 이해, 상호작용과 소통',
    };
    return labels[section] || section;
  };

  const groupedItems = items.reduce((acc, item) => {
    const section = item.section;
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(item);
    return acc;
  }, {} as Record<string, CultureItem[]>);

  // 섹션 표시 순서 정의
  const sectionOrder = ['hero', 'principle', 'work_method', 'culture_value'];
  
  // 정의된 순서대로 섹션 정렬
  const sortedSections = sectionOrder.filter(section => groupedItems[section]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Culture 페이지 관리</h1>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="mr-2 h-4 w-4" />
          새 항목 추가
        </Button>
      </div>

      {/* 입력 폼 - 조건부 표시 */}
      {showAddForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>새 항목 추가</CardTitle>
          </CardHeader>
          <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="section">섹션</Label>
                <Select
                  value={formData.section}
                  onValueChange={(value: CultureItem['section']) =>
                    setFormData({ ...formData, section: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="섹션 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hero">Hero 섹션</SelectItem>
                    <SelectItem value="principle">우리의 기업문화</SelectItem>
                    <SelectItem value="work_method">업무방식</SelectItem>
                    <SelectItem value="culture_value">존중과 이해, 상호작용과 소통</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="order_index">정렬 순서</Label>
                <Input
                  id="order_index"
                  type="number"
                  value={formData.order_index}
                  onChange={(e) =>
                    setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })
                  }
                  placeholder="0"
                />
              </div>
            </div>

            {formData.section === 'hero' && (
              <>
                <div>
                  <Label htmlFor="subtitle">부제목</Label>
                  <Input
                    id="subtitle"
                    value={formData.subtitle || ''}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="일이 즐겁도록"
                  />
                </div>
                <div>
                  <Label htmlFor="title">제목</Label>
                  <Input
                    id="title"
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="OUR Culture"
                  />
                </div>
              </>
            )}

            {formData.section !== 'hero' && formData.section !== 'principle' && (
              <div>
                <Label htmlFor="title">제목</Label>
                <Input
                  id="title"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="제목을 입력하세요"
                  required
                />
              </div>
            )}

            <div>
              <Label htmlFor="content">내용</Label>
              <Textarea
                id="content"
                value={formData.content || ''}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="내용을 입력하세요"
                rows={4}
                required
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                등록
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                <X className="mr-2 h-4 w-4" />
                취소
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      )}

      {/* 섹션별 항목 리스트 */}
      <div className="space-y-6">
        {sortedSections.map((section) => {
          const sectionItems = groupedItems[section];
          return (
          <Card key={section}>
            <CardHeader>
              <CardTitle>{getSectionLabel(section)}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sectionItems.map((item) => {
                  const isEditing = editingId === item.id;
                  const itemData = isEditing && item.id ? editFormData[item.id] : item;
                  
                  return (
                    <div
                      key={item.id}
                      className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                    >
                      {!isEditing ? (
                        // 보기 모드
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                #{item.order_index}
                              </span>
                              {item.title && (
                                <h3 className="font-semibold text-lg">{item.title}</h3>
                              )}
                            </div>
                            {item.subtitle && (
                              <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                            )}
                            <p className="text-sm whitespace-pre-wrap">{item.content}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEdit(item)}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => item.id && handleDelete(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        // 편집 모드
                        <div className="space-y-4">
                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-xs text-muted-foreground">
                              #{item.order_index}
                            </span>
                            <span className="text-sm font-medium text-primary">편집 중</span>
                          </div>
                          
                          <div className="grid gap-4">
                            <div>
                              <Label>정렬 순서</Label>
                              <Input
                                type="number"
                                value={itemData?.order_index || 0}
                                onChange={(e) => item.id && setEditFormData({
                                  ...editFormData,
                                  [item.id]: {
                                    ...editFormData[item.id],
                                    order_index: parseInt(e.target.value) || 0
                                  }
                                })}
                              />
                            </div>

                            {item.section === 'hero' && (
                              <>
                                <div>
                                  <Label>부제목</Label>
                                  <Input
                                    value={itemData?.subtitle || ''}
                                    onChange={(e) => item.id && setEditFormData({
                                      ...editFormData,
                                      [item.id]: {
                                        ...editFormData[item.id],
                                        subtitle: e.target.value
                                      }
                                    })}
                                  />
                                </div>
                                <div>
                                  <Label>제목</Label>
                                  <Input
                                    value={itemData?.title || ''}
                                    onChange={(e) => item.id && setEditFormData({
                                      ...editFormData,
                                      [item.id]: {
                                        ...editFormData[item.id],
                                        title: e.target.value
                                      }
                                    })}
                                  />
                                </div>
                              </>
                            )}

                            {item.section !== 'hero' && item.section !== 'principle' && (
                              <div>
                                <Label>제목</Label>
                                <Input
                                  value={itemData?.title || ''}
                                  onChange={(e) => item.id && setEditFormData({
                                    ...editFormData,
                                    [item.id]: {
                                      ...editFormData[item.id],
                                      title: e.target.value
                                    }
                                  })}
                                />
                              </div>
                            )}

                            <div>
                              <Label>내용</Label>
                              <Textarea
                                value={itemData?.content || ''}
                                onChange={(e) => item.id && setEditFormData({
                                  ...editFormData,
                                  [item.id]: {
                                    ...editFormData[item.id],
                                    content: e.target.value
                                  }
                                })}
                                rows={4}
                              />
                            </div>
                          </div>

                          <div className="flex gap-2 justify-end">
                            <Button
                              size="sm"
                              onClick={() => item.id && saveEdit(item.id)}
                            >
                              <Save className="mr-2 h-4 w-4" />
                              저장
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => item.id && cancelEdit(item.id)}
                            >
                              <X className="mr-2 h-4 w-4" />
                              취소
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                {sectionItems.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    등록된 항목이 없습니다.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
          );
        })}
      </div>
    </div>
  );
}

