import { useState, useEffect } from 'react';
import { supabase, type PartnerItem } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Pencil, Trash2, Save, X, Image as ImageIcon, ExternalLink } from 'lucide-react';

export default function PartnerManage() {
  const [items, setItems] = useState<PartnerItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<PartnerItem>>({ 
    name: '', 
    logo_url: '', 
    url: '', 
    description: '',
    order_index: 0 
  });
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => { fetchItems(); }, []);

  async function fetchItems() {
    const { data, error } = await supabase
      .from('partner')
      .select('*')
      .order('order_index')
      .order('id');
    if (error) console.error('Error:', error);
    else setItems(data || []);
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB 이하여야 합니다.');
      return;
    }

    setUploadingLogo(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `partner-logos/${fileName}`;

      const { error } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Storage error:', error);
        alert(`업로드 오류: ${error.message}`);
        return;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      setFormData({ ...formData, logo_url: publicUrl });
      alert('로고가 업로드되었습니다.');
    } catch (error: any) {
      console.error('Error uploading logo:', error);
      alert(`로고 업로드 중 오류가 발생했습니다.\n${error.message || error}`);
    } finally {
      setUploadingLogo(false);
    }
  }

  async function handleSave() {
    if (!formData.name) {
      alert('파트너명을 입력하세요.');
      return;
    }

    if (editingId) {
      const { error } = await supabase
        .from('partner')
        .update(formData)
        .eq('id', editingId);
      
      if (error) {
        console.error('Error:', error);
        alert('수정 중 오류가 발생했습니다.');
      } else {
        setEditingId(null);
        fetchItems();
      }
    } else {
      const { error } = await supabase
        .from('partner')
        .insert([formData as PartnerItem]);
      
      if (error) {
        console.error('Error:', error);
        alert('추가 중 오류가 발생했습니다.');
      } else {
        setIsAdding(false);
        fetchItems();
      }
    }
    
    setFormData({ 
      name: '', 
      logo_url: '', 
      url: '', 
      description: '',
      order_index: 0 
    });
  }

  async function handleDelete(id: number) {
    if (!confirm('삭제하시겠습니까?')) return;
    await supabase.from('partner').delete().eq('id', id);
    fetchItems();
  }

  function handleEdit(item: PartnerItem) {
    setEditingId(item.id!);
    setFormData({ 
      name: item.name, 
      logo_url: item.logo_url || '', 
      url: item.url || '', 
      description: item.description || '',
      order_index: item.order_index || 0
    });
  }

  function handleCancel() {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ 
      name: '', 
      logo_url: '', 
      url: '', 
      description: '',
      order_index: 0 
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Partner 관리</h1>
        {!isAdding && !editingId && (
          <Button onClick={() => setIsAdding(true)}><Plus className="mr-2 h-4 w-4" />새 항목</Button>
        )}
      </div>

      {(isAdding || editingId) && (
        <Card>
          <CardHeader><CardTitle>{editingId ? '파트너 수정' : '새 파트너 추가'}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">회사명 *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="KT"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="url">웹사이트 URL</Label>
                <Input
                  id="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://www.kt.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo">로고 이미지</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      id="logo"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      disabled={uploadingLogo}
                      className="cursor-pointer"
                    />
                  </div>
                  {formData.logo_url ? (
                    <div className="w-10 h-10 border rounded-md overflow-hidden bg-muted flex items-center justify-center">
                      <img 
                        src={formData.logo_url} 
                        alt="로고 미리보기" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 border rounded-md overflow-hidden bg-muted flex items-center justify-center text-muted-foreground">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                  )}
                </div>
                {uploadingLogo && (
                  <p className="text-xs text-muted-foreground">업로드 중...</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="order_index">정렬 순서</Label>
                <Input
                  id="order_index"
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">파트너 사업 영역</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="AI 교육 플랫폼 개발 및 운영"
                  className="min-h-[80px]"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />저장
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                <X className="mr-2 h-4 w-4" />취소
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {items.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">등록된 파트너사가 없습니다.</p>
            </CardContent>
          </Card>
        )}
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-6">
              <div className="flex gap-4 items-start">
                {/* 로고 */}
                {item.logo_url ? (
                  <div className="w-24 h-24 flex-shrink-0 border rounded-md overflow-hidden bg-muted">
                    <img 
                      src={item.logo_url} 
                      alt={item.name} 
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 flex-shrink-0 border rounded-md bg-muted flex items-center justify-center text-muted-foreground">
                    <ImageIcon className="w-12 h-12" />
                  </div>
                )}

                {/* 정보 */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl font-semibold">{item.name}</h3>
                    {item.url && (
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline inline-flex items-center gap-1"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  {item.description && (
                    <p className="text-muted-foreground">{item.description}</p>
                  )}
                  <div className="text-sm text-muted-foreground">
                    정렬 순서: {item.order_index || 0}
                  </div>
                </div>

                {/* 액션 버튼 */}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(item)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(item.id!)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}



