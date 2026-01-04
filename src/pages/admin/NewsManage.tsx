import { useState, useEffect } from 'react';
import { supabase, type NewsItem } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Pencil, Trash2, Save, X, Upload, Image as ImageIcon } from 'lucide-react';

export default function NewsManage() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<NewsItem>>({ 
    date: '', 
    title: '', 
    content: '',
    image_url: '',
    link: ''
  });
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => { fetchItems(); }, []);

  async function fetchItems() {
    const { data, error} = await supabase.from('news').select('*').order('date', { ascending: false });
    if (error) console.error('Error:', error);
    else setItems(data || []);
  }

  async function uploadImage(file: File): Promise<string | null> {
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `news/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        alert('이미지 업로드 실패: ' + uploadError.message);
        return null;
      }

      const { data } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('이미지 업로드 중 오류가 발생했습니다.');
      return null;
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    if (!formData.date || !formData.title || !formData.content) {
      alert('모든 필수 필드를 입력해주세요.');
      return;
    }

    let imageUrl = formData.image_url;

    if (imageFile) {
      const uploadedUrl = await uploadImage(imageFile);
      if (uploadedUrl) {
        imageUrl = uploadedUrl;
      }
    }

    const dataToSave = {
      date: formData.date,
      title: formData.title,
      content: formData.content,
      image_url: imageUrl || null,
      link: formData.link || null,
    };

    if (editingId) {
      await supabase.from('news').update(dataToSave).eq('id', editingId);
      setEditingId(null);
    } else {
      await supabase.from('news').insert([dataToSave as NewsItem]);
      setIsAdding(false);
    }

    setFormData({ date: '', title: '', content: '', image_url: '', link: '' });
    setImageFile(null);
    setImagePreview('');
    fetchItems();
  }

  async function handleDelete(id: number) {
    if (!confirm('삭제하시겠습니까?')) return;
    await supabase.from('news').delete().eq('id', id);
    fetchItems();
  }

  function handleEdit(item: NewsItem) {
    setEditingId(item.id!);
    setFormData({ 
      date: item.date, 
      title: item.title, 
      content: item.content,
      image_url: item.image_url || '',
      link: item.link || ''
    });
    setImagePreview(item.image_url || '');
    setImageFile(null);
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('이미지 파일 크기는 5MB 이하여야 합니다.');
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.');
        return;
      }

      setImageFile(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  function handleCancel() {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ date: '', title: '', content: '', image_url: '', link: '' });
    setImageFile(null);
    setImagePreview('');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">News 관리</h1>
        {!isAdding && !editingId && (
          <Button onClick={() => setIsAdding(true)}><Plus className="mr-2 h-4 w-4" />새 항목</Button>
        )}
      </div>

      {(isAdding || editingId) && (
        <Card>
          <CardHeader><CardTitle>{editingId ? '수정' : '추가'}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date">날짜 (YYYY.MM)</Label>
                <Input 
                  id="date"
                  value={formData.date} 
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })} 
                  placeholder="2025.01" 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="title">제목</Label>
                <Input 
                  id="title"
                  value={formData.title} 
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                  placeholder="뉴스 제목"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">내용</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="뉴스 내용을 입력하세요&#10;(Enter 키로 줄바꿈 가능)"
                rows={8}
                className="resize-y text-justify whitespace-pre-wrap"
              />
              <p className="text-xs text-muted-foreground">
                * 드래그하여 입력란 크기를 조절할 수 있습니다. Enter 키로 줄바꿈이 가능합니다.
              </p>
            </div>
            
            {/* 썸네일 이미지 업로드 */}
            <div className="space-y-2">
              <Label htmlFor="image">썸네일 이미지</Label>
              <div className="max-w-md">
                <div className="flex items-center gap-2 mb-3">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={uploading}
                    className="hidden"
                  />
                  <Button 
                    type="button" 
                    variant="outline"
                    disabled={uploading}
                    onClick={() => document.getElementById('image')?.click()}
                    className="flex-1"
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full mr-2" />
                        업로드 중...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        이미지 선택
                      </>
                    )}
                  </Button>
                </div>
                
                {imagePreview && (
                  <div className="relative w-full h-32 border rounded-lg overflow-hidden bg-muted mb-3">
                    <img
                      src={imagePreview}
                      alt="미리보기"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                {!imagePreview && (
                  <div className="w-full h-32 border rounded-lg flex items-center justify-center bg-muted text-muted-foreground mb-3">
                    <div className="text-center">
                      <ImageIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-xs">썸네일 미리보기</p>
                    </div>
                  </div>
                )}
                
                <p className="text-xs text-muted-foreground">
                  * 권장 크기: 800×400px, 최대 5MB
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="link">원문 기사 링크 (선택)</Label>
              <Input
                id="link"
                type="url"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                placeholder="https://example.com/news/article"
                className="max-w-md"
              />
              <p className="text-xs text-muted-foreground">
                * 원문 기사 URL을 입력하면 뉴스 페이지에 "원문 보기" 버튼이 표시됩니다.
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={uploading}>
                <Save className="mr-2 h-4 w-4" />
                {uploading ? '업로드 중...' : '저장'}
              </Button>
              <Button variant="outline" onClick={handleCancel} disabled={uploading}>
                <X className="mr-2 h-4 w-4" />취소
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-6">
              <div className="flex gap-4">
                {/* 썸네일 이미지 */}
                <div className="flex-shrink-0">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-32 h-20 object-cover rounded-lg border"
                    />
                  ) : (
                    <div className="w-32 h-20 bg-muted rounded-lg border flex items-center justify-center">
                      <ImageIcon className="h-6 w-6 text-muted-foreground opacity-50" />
                    </div>
                  )}
                </div>
                
                {/* 텍스트 정보 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm text-primary font-medium">{item.date}</span>
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    {item.link && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">링크</span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2 whitespace-pre-wrap">{item.content}</p>
                  {item.link && (
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      🔗 {item.link}
                    </p>
                  )}
                </div>
                
                {/* 액션 버튼 */}
                <div className="flex gap-2 flex-shrink-0">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(item)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(item.id!)}>
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

