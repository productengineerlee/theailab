import { useState, useEffect } from 'react';
import { supabase, type CareerItem } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';

export default function CareerManage() {
  const [items, setItems] = useState<CareerItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<CareerItem>>({ 
    title: '', 
    description: '', 
    type: 'job_posting',
    order_index: 0 
  });

  useEffect(() => { fetchItems(); }, []);

  async function fetchItems() {
    const { data, error } = await supabase.from('career').select('*').order('order_index');
    if (error) console.error('Error:', error);
    else setItems(data || []);
  }

  async function handleSave() {
    if (editingId) {
      await supabase.from('career').update(formData).eq('id', editingId);
      setEditingId(null);
    } else {
      await supabase.from('career').insert([formData as CareerItem]);
      setIsAdding(false);
    }
    setFormData({ title: '', description: '', type: 'job_posting', order_index: 0 });
    fetchItems();
  }

  async function handleDelete(id: number) {
    if (!confirm('삭제하시겠습니까?')) return;
    await supabase.from('career').delete().eq('id', id);
    fetchItems();
  }

  function handleEdit(item: CareerItem) {
    setEditingId(item.id!);
    setFormData({ 
      title: item.title, 
      description: item.description, 
      type: item.type,
      order_index: item.order_index 
    });
  }

  const jobPostings = items.filter(i => i.type === 'job_posting');
  const benefits = items.filter(i => i.type === 'benefit');
  const processes = items.filter(i => i.type === 'process');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Career 관리</h1>
        {!isAdding && !editingId && (
          <Button onClick={() => setIsAdding(true)}><Plus className="mr-2 h-4 w-4" />새 항목</Button>
        )}
      </div>

      {(isAdding || editingId) && (
        <Card>
          <CardHeader><CardTitle>{editingId ? '수정' : '추가'}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>타입</Label>
              <select 
                className="w-full p-2 border rounded" 
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as 'benefit' | 'process' | 'job_posting' })}
              >
                <option value="job_posting">채용 공고</option>
                <option value="benefit">혜택</option>
                <option value="process">프로세스</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>제목</Label>
              <Input 
                value={formData.title} 
                onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                placeholder="예: 백엔드 개발자"
              />
            </div>
            <div className="space-y-2">
              <Label>설명</Label>
              <Textarea 
                value={formData.description} 
                onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                placeholder="상세 설명을 입력하세요"
                className="min-h-[150px]"
              />
            </div>
            <div className="space-y-2">
              <Label>순서</Label>
              <Input 
                type="number" 
                value={formData.order_index} 
                onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })} 
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave}><Save className="mr-2 h-4 w-4" />저장</Button>
              <Button variant="outline" onClick={() => { setIsAdding(false); setEditingId(null); }}><X className="mr-2 h-4 w-4" />취소</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4 mb-6">
        <h2 className="text-xl font-semibold">채용 공고</h2>
        {jobPostings.length === 0 && (
          <p className="text-sm text-muted-foreground">등록된 채용 공고가 없습니다.</p>
        )}
        {jobPostings.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-primary mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">{item.description}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(item)}><Pencil className="h-4 w-4" /></Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id!)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">혜택 및 복지</h2>
          {benefits.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(item)}><Pencil className="h-4 w-4" /></Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id!)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">채용 프로세스</h2>
          {processes.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(item)}><Pencil className="h-4 w-4" /></Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id!)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

