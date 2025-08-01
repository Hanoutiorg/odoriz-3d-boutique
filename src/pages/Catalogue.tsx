import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, Grid, List, Search, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useProducts } from '../contexts/ProductContext';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/product/ProductCard';

const Catalogue = () => {
  const { 
    products, 
    searchResults, 
    loading, 
    filters, 
    updateFilters, 
    resetFilters, 
    getFilteredProducts 
  } = useProducts();
  
  const [viewMode, setViewMode] = useState('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();

  // Récupérer les paramètres URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    const filter = params.get('filter');
    
    if (category) {
      updateFilters({ category });
    }
    
    if (filter === 'new') {
      updateFilters({ sortBy: 'newest' });
    } else if (filter === 'bestsellers') {
      updateFilters({ sortBy: 'bestseller' });
    }
  }, [location.search, updateFilters]);

  const displayedProducts = searchResults.length > 0 ? searchResults : getFilteredProducts();

  const categories = ['Pour Homme', 'Pour Femme', 'Niche'];
  const brands = [...new Set(products.map(p => p.brand))];
  const sortOptions = [
    { value: 'name', label: 'Nom (A-Z)' },
    { value: 'price-asc', label: 'Prix croissant' },
    { value: 'price-desc', label: 'Prix décroissant' },
    { value: 'rating', label: 'Mieux notés' },
    { value: 'newest', label: 'Nouveautés' }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Logic for search will be handled by the context
    }
  };

  const handleFilterChange = (filterType, value) => {
    updateFilters({ [filterType]: value });
  };

  const clearFilters = () => {
    resetFilters();
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-playfair font-bold text-foreground mb-4">
              Notre Collection
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explorez notre sélection exclusive de parfums de luxe, soigneusement choisis 
              pour vous offrir les plus belles fragrances du monde.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filtres */}
          <div className={`lg:w-80 ${showFilters ? 'block' : 'hidden lg:block'}`}>
            <Card className="sticky top-24">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-playfair font-semibold">Filtres</h2>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Effacer
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Recherche */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Recherche</label>
                    <form onSubmit={handleSearch} className="relative">
                      <Input
                        placeholder="Nom, marque..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </form>
                  </div>

                  <Separator />

                  {/* Catégorie */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">Catégorie</label>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="category"
                          value=""
                          checked={filters.category === ''}
                          onChange={(e) => handleFilterChange('category', e.target.value)}
                          className="w-4 h-4 text-accent"
                        />
                        <span className="text-sm">Toutes les catégories</span>
                      </label>
                      {categories.map((category) => (
                        <label key={category} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name="category"
                            value={category}
                            checked={filters.category === category}
                            onChange={(e) => handleFilterChange('category', e.target.value)}
                            className="w-4 h-4 text-accent"
                          />
                          <span className="text-sm">{category}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Marque */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">Marque</label>
                    <Select value={filters.brand} onValueChange={(value) => handleFilterChange('brand', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Toutes les marques" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Toutes les marques</SelectItem>
                        {brands.map((brand) => (
                          <SelectItem key={String(brand)} value={String(brand)}>
                            {String(brand)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  {/* Prix */}
                  <div>
                    <label className="text-sm font-medium mb-3 block">Prix</label>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-muted-foreground">Prix minimum</label>
                        <Input
                          type="number"
                          value={filters.minPrice}
                          onChange={(e) => handleFilterChange('minPrice', parseInt(e.target.value) || 0)}
                          placeholder="0"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-muted-foreground">Prix maximum</label>
                        <Input
                          type="number"
                          value={filters.maxPrice}
                          onChange={(e) => handleFilterChange('maxPrice', parseInt(e.target.value) || 1000)}
                          placeholder="1000"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contenu principal */}
          <div className="flex-1">
            {/* Barre d'outils */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filtres
                </Button>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{displayedProducts.length} produit{displayedProducts.length > 1 ? 's' : ''}</span>
                  {(filters.category || filters.brand || searchResults.length > 0) && (
                    <>
                      <span>•</span>
                      <Button variant="link" size="sm" onClick={clearFilters} className="h-auto p-0">
                        Effacer les filtres
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={String(option.value)} value={String(option.value)}>
                        {String(option.label)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex border rounded-md">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Filtres actifs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {filters.category && (
                <Badge variant="secondary" className="text-xs">
                  {filters.category}
                  <button
                    onClick={() => handleFilterChange('category', '')}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {filters.brand && (
                <Badge variant="secondary" className="text-xs">
                  {filters.brand}
                  <button
                    onClick={() => handleFilterChange('brand', '')}
                    className="ml-1 hover:text-destructive"
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>

            {/* Grille de produits */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[3/4] bg-muted rounded-lg mb-4" />
                    <div className="space-y-2">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-4 bg-muted rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : displayedProducts.length === 0 ? (
              <div className="text-center py-16">
                <Filter className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Aucun produit trouvé</h3>
                <p className="text-muted-foreground mb-4">
                  Essayez de modifier vos critères de recherche ou de filtrage.
                </p>
                <Button onClick={clearFilters}>
                  Effacer les filtres
                </Button>
              </div>
            ) : (
              <motion.div
                className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                }`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                {displayedProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Catalogue;