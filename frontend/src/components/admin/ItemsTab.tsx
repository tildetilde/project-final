import React, { useState, useMemo } from 'react';
import { Button, Card, Input, Label } from '../../ui';
import { Item, Category } from '../../types/admin';

interface ItemsTabProps {
  items: Record<string, Item[]>;
  categories: Category[];
  onEdit: (item: Item) => void;
  onDelete: (id: string) => Promise<boolean>;
  onCreate: () => void;
  editingItem: Item | null;
  showCreateForm: boolean;
  onSave: (data: Partial<Item>) => Promise<boolean>;
  onUpdate: (id: string, data: Partial<Item>) => Promise<boolean>;
  onCancel: () => void;
  selectedCategoryFilter: string;
  setSelectedCategoryFilter: (filter: string) => void;
}

const ItemsTab: React.FC<ItemsTabProps> = ({
  items,
  categories,
  onEdit,
  onDelete,
  onCreate,
  editingItem,
  showCreateForm,
  onSave,
  onUpdate,
  onCancel,
  selectedCategoryFilter,
  setSelectedCategoryFilter
}) => {
  const [formData, setFormData] = useState<Partial<Item>>({
    id: '',
    name: '',
    value: 0,
    label: '',
    categoryId: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let success = false;
    
    if (editingItem) {
      success = await onUpdate(editingItem.id, formData);
    } else {
      success = await onSave(formData);
    }
    
    if (success) {
      setFormData({ id: '', name: '', value: 0, label: '', categoryId: '' });
    }
  };

  const handleEdit = (item: Item) => {
    setFormData(item);
    onEdit(item);
  };

  const handleCancel = () => {
    setFormData({ id: '', name: '', value: 0, label: '', categoryId: '' });
    onCancel();
  };

  // Sort and group items by category, then alphabetically within each category
  const sortedAndGroupedItems = useMemo(() => {
    const filteredItems = selectedCategoryFilter === 'all' 
      ? Object.values(items).flat()
      : items[selectedCategoryFilter] || [];
    
    // Group by category
    const grouped = filteredItems.reduce((acc, item) => {
      const categoryId = item.categoryId;
      if (!acc[categoryId]) {
        acc[categoryId] = [];
      }
      acc[categoryId].push(item);
      return acc;
    }, {} as Record<string, Item[]>);
    
    // Sort items within each category alphabetically
    Object.keys(grouped).forEach(categoryId => {
      grouped[categoryId].sort((a, b) => a.name.localeCompare(b.name));
    });
    
    return grouped;
  }, [items, selectedCategoryFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Items</h2>
        <Button onClick={onCreate} className="w-full sm:w-auto">Create Item</Button>
      </div>

      {/* Create/Edit Form */}
      {(showCreateForm || editingItem) && (
        <Card className="p-4 sm:p-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingItem ? 'Edit Item' : 'Create Item'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="itemId">ID</Label>
                <Input
                  id="itemId"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  required
                  disabled={!!editingItem}
                />
              </div>
              <div>
                <Label htmlFor="itemName">Name</Label>
                <Input
                  id="itemName"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="itemValue">Value</Label>
                <Input
                  id="itemValue"
                  type="number"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="itemLabel">Label</Label>
                <Input
                  id="itemLabel"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="itemCategoryId">Category</Label>
              <select
                id="itemCategoryId"
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                required
                className="w-full px-3 py-2 border border-border rounded-md bg-background"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button type="submit" className="w-full sm:w-auto">
                {editingItem ? 'Update' : 'Create'}
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel} className="w-full sm:w-auto">
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Items List */}
      <div className="grid gap-4">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            variant={selectedCategoryFilter === 'all' ? 'primary' : 'outline'}
            onClick={() => setSelectedCategoryFilter('all')}
            className="text-xs sm:text-sm"
          >
            All Items
          </Button>
          {Object.keys(items).map((categoryId) => {
            const category = categories.find(c => c.id === categoryId);
            return (
              <Button
                key={categoryId}
                variant={selectedCategoryFilter === categoryId ? 'primary' : 'outline'}
                onClick={() => setSelectedCategoryFilter(categoryId)}
                className="text-xs sm:text-sm"
              >
                {category?.name || 'Unknown Category'} ({items[categoryId].length})
              </Button>
            );
          })}
        </div>

        {Object.entries(sortedAndGroupedItems).map(([categoryId, categoryItems]) => (
          <div key={categoryId} className="space-y-4">
            <h3 className="text-xl font-bold">
              {categories.find(c => c.id === categoryId)?.name || 'Unknown Category'}
            </h3>
            <div className="grid gap-4">
              {categoryItems.map((item) => (
                <Card key={item.id} className="p-4">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg break-words">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">ID: {item.id}</p>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mt-2 text-sm text-muted-foreground space-y-1 sm:space-y-0">
                        <span>Value: {item.value}</span>
                        <span>Label: {item.label}</span>
                        <span>
                          Category: {categories.find(c => c.id === categoryId)?.name || 'Unknown'}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(item)} className="w-full sm:w-auto">
                        Edit
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => onDelete(item.id)} className="w-full sm:w-auto">
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItemsTab;
