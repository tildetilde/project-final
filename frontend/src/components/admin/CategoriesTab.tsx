import React, { useState, useMemo } from 'react';
import { Button, Card, Input, Label } from '../../ui';
import { Category } from '../../types/admin';

interface CategoriesTabProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: string) => Promise<boolean>;
  onCreate: () => void;
  editingCategory: Category | null;
  showCreateForm: boolean;
  onSave: (data: Partial<Category>) => Promise<boolean>;
  onUpdate: (id: string, data: Partial<Category>) => Promise<boolean>;
  onCancel: () => void;
}

const CategoriesTab: React.FC<CategoriesTabProps> = ({
  categories,
  onEdit,
  onDelete,
  onCreate,
  editingCategory,
  showCreateForm,
  onSave,
  onUpdate,
  onCancel
}) => {
  const [formData, setFormData] = useState<Partial<Category>>({
    id: '',
    name: '',
    description: '',
    question: '',
    unit: '',
    unitVisible: false,
    sort: 'asc'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let success = false;
    
    if (editingCategory) {
      success = await onUpdate(editingCategory.id, formData);
    } else {
      success = await onSave(formData);
    }
    
    if (success) {
      setFormData({ id: '', name: '', description: '', question: '', unit: '', unitVisible: false, sort: 'asc' });
    }
  };

  const handleEdit = (category: Category) => {
    setFormData(category);
    onEdit(category);
  };

  const handleCancel = () => {
    setFormData({ id: '', name: '', description: '', question: '', unit: '', unitVisible: false, sort: 'asc' });
    onCancel();
  };

  // Sort categories alphabetically
  const sortedCategories = useMemo(() => {
    return [...categories].sort((a, b) => a.name.localeCompare(b.name));
  }, [categories]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Categories</h2>
        <Button onClick={onCreate}>Create Category</Button>
      </div>

      {/* Create/Edit Form */}
      {(showCreateForm || editingCategory) && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingCategory ? 'Edit Category' : 'Create Category'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="id">ID</Label>
                <Input
                  id="id"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  required
                  disabled={!!editingCategory}
                />
              </div>
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="sort">Sort Order</Label>
                <select
                  id="sort"
                  value={formData.sort}
                  onChange={(e) => setFormData({ ...formData, sort: e.target.value as 'asc' | 'desc' })}
                  className="w-full px-3 py-2 border border-border rounded-md bg-background"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="question">Question</Label>
              <Input
                id="question"
                value={formData.question || ''}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="unitVisible"
                checked={formData.unitVisible || false}
                onChange={(e) => setFormData({ ...formData, unitVisible: e.target.checked })}
                className="rounded border-border"
              />
              <Label htmlFor="unitVisible">Show Unit</Label>
            </div>
            <div className="flex space-x-2">
              <Button type="submit">
                {editingCategory ? 'Update' : 'Create'}
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Categories List */}
      <div className="grid gap-4">
        {sortedCategories.map((category) => (
          <Card key={category.id} className="p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{category.name}</h3>
                <p className="text-sm text-muted-foreground">ID: {category.id}</p>
                {category.description && (
                  <p className="text-sm mt-1">{category.description}</p>
                )}
                {category.question && (
                  <p className="text-sm mt-1 text-blue-600">Q: {category.question}</p>
                )}
                <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                  <span>Unit: {category.unit}</span>
                  <span>Sort: {category.sort}</span>
                  <span>Unit Visible: {category.unitVisible ? 'Yes' : 'No'}</span>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(category)}>
                  Edit
                </Button>
                <Button size="sm" variant="secondary" onClick={() => onDelete(category.id)}>
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CategoriesTab;
