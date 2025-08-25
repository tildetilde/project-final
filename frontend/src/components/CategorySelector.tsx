import React, { useEffect } from 'react';
import { useGame } from '../store/game';
import { Card } from '../ui/Card';
import { Spinner } from '../ui/Spinner';
// import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';

export const CategorySelector: React.FC = () => {
  const { categories, loading, error, loadCategories, selectCategory, selectedCategory } = useGame();
  const navigate = useNavigate();

  useEffect(() => { loadCategories(); }, [loadCategories]);

  if (loading) return (
  <div className="flex justify-center items-center p-16">
    <Spinner label="Loading categories..." />
  </div>
  );

  if (error) return (
    <div className="flex justify-center items-center p-8">
      <div className="text-red-600 text-lg">Error: {error}</div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary mb-2">Choose a Category</h2>
        <p className="text-muted-foreground">Select a category to start playing</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Card
            key={category.id}
            className={`p-6 cursor-pointer transition-all hover:shadow-medium ${
              selectedCategory?.id === category.id ? 'ring-2 ring-primary bg-primary/10' : 'hover:bg-card'
            }`}
            onClick={() => {
              selectCategory(category);     // ✔️ bara välja
              navigate('/gamemode');        // ✔️ till GameMode (SETUP)
            }}
          >
            <div className="space-y-3">
              <h3 className="font-semibold text-lg text-foreground">{category.question}</h3>
              <div className="text-sm text-muted-foreground">
                <p>Unit: {category.unit}</p>
                {category.source && <p>Source: {category.source.name}</p>}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* ⬇️ Ta bort "Start Game with …"-knappen */}
    </div>
  );
};
