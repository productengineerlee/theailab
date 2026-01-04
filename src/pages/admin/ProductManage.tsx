import { useState, useEffect } from 'react';
import { supabase, type ProductItem } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Pencil, Trash2, Save, X, Upload, Image as ImageIcon } from 'lucide-react';

export default function ProductManage() {
  const [items, setItems] = useState<ProductItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<ProductItem>>({
    title: '',
    description: '',
    image_url: '',
    url: '',
  });
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    const { data, error } = await supabase.from('product').select('*').order('id');
    if (error) console.error('Error:', error);
    else setItems(data || []);
  }

  async function uploadImage(file: File): Promise<string | null> {
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
      const filePath = `products/${fileName}`;

      // Supabase Storage에 이미지 업로드
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        alert('이미지 업로드 실패: ' + uploadError.message);
        return null;
      }

      // Public URL 생성
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
    if (!formData.title || !formData.description) {
      alert('제목과 설명을 입력해주세요.');
      return;
    }

    let imageUrl = formData.image_url;

    // 새 이미지 파일이 있으면 업로드
    if (imageFile) {
      const uploadedUrl = await uploadImage(imageFile);
      if (uploadedUrl) {
        imageUrl = uploadedUrl;
      }
    }

    const dataToSave = {
      title: formData.title,
      description: formData.description,
      image_url: imageUrl || null,
      url: formData.url || null,
    };

    console.log('💾 저장할 데이터:', dataToSave);

    let error;
    if (editingId) {
      const result = await supabase.from('product').update(dataToSave).eq('id', editingId);
      error = result.error;
      console.log('✏️ 수정 결과:', result);
    } else {
      const result = await supabase.from('product').insert([dataToSave]);
      error = result.error;
      console.log('➕ 추가 결과:', result);
    }

    if (error) {
      console.error('❌ 저장 실패:', error);
      alert(`저장 실패: ${error.message}`);
      return;
    }

    alert('저장되었습니다! ✅');
    
    setFormData({ title: '', description: '', image_url: '', url: '' });
    setImageFile(null);
    setImagePreview('');
    setEditingId(null);
    setIsAdding(false);
    
    await fetchItems();
  }

  async function handleDelete(id: number) {
    if (!confirm('삭제하시겠습니까?')) return;
    await supabase.from('product').delete().eq('id', id);
    fetchItems();
  }

  function handleEdit(item: ProductItem) {
    setEditingId(item.id!);
    setFormData({ 
      title: item.title, 
      description: item.description,
      image_url: item.image_url || '',
      url: item.url || ''
    });
    setImagePreview(item.image_url || '');
    setImageFile(null);
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      // 파일 크기 체크 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('이미지 파일 크기는 5MB 이하여야 합니다.');
        return;
      }

      // 파일 타입 체크
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 업로드 가능합니다.');
        return;
      }

      setImageFile(file);
      
      // 미리보기 생성
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
    setFormData({ title: '', description: '', image_url: '', url: '' });
    setImageFile(null);
    setImagePreview('');
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Product 관리</h1>
        {!isAdding && !editingId && (
          <Button onClick={() => setIsAdding(true)}>
            <Plus className="mr-2 h-4 w-4" />새 항목
          </Button>
        )}
      </div>

      {(isAdding || editingId) && (
        <Card>
          <CardHeader><CardTitle>{editingId ? '수정' : '추가'}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">제목</Label>
              <Input 
                id="title"
                value={formData.title} 
                onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                placeholder="제품명을 입력하세요"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">설명</Label>
              <Input 
                id="description"
                value={formData.description} 
                onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
                placeholder="제품 설명을 입력하세요"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="url">링크 URL</Label>
              <Input 
                id="url"
                type="url"
                value={formData.url || ''} 
                onChange={(e) => setFormData({ ...formData, url: e.target.value })} 
                placeholder="https://example.com"
              />
            </div>
            
            {/* 이미지 업로드 */}
            <div className="space-y-2">
              <Label htmlFor="image">제품 이미지</Label>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={uploading}
                    className="flex-1"
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="icon"
                    disabled={uploading}
                  >
                    {uploading ? (
                      <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                
                {/* 이미지 미리보기 */}
                {imagePreview && (
                  <div className="relative w-full h-48 border rounded-lg overflow-hidden bg-muted">
                    <img
                      src={imagePreview}
                      alt="미리보기"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}
                
                {!imagePreview && (
                  <div className="w-full h-48 border rounded-lg flex items-center justify-center bg-muted text-muted-foreground">
                    <div className="text-center">
                      <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">이미지 미리보기</p>
                    </div>
                  </div>
                )}
                
                <p className="text-xs text-muted-foreground">
                  * 최대 5MB, 이미지 파일만 가능 (jpg, png, gif, webp 등)
                </p>
              </div>
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

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-6">
              <div className="flex gap-4">
                {/* 이미지 섬네일 */}
                <div className="flex-shrink-0">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-24 h-24 object-cover rounded-lg border"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-muted rounded-lg border flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-muted-foreground opacity-50" />
                    </div>
                  )}
                </div>
                
                {/* 텍스트 정보 */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{item.description}</p>
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

