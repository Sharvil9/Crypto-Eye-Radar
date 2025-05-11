
import React, { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import { useToast } from '@/components/ui/use-toast';
import '../styles/DraggableGrid.css';

// Enable responsive features
const ResponsiveGridLayout = WidthProvider(Responsive);

export type LayoutItem = {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  maxW?: number;
  minH?: number;
  maxH?: number;
  static?: boolean;
};

export type GridLayout = {
  lg: LayoutItem[];
  md: LayoutItem[];
  sm: LayoutItem[];
  xs: LayoutItem[];
  xxs: LayoutItem[];
};

export type DraggableGridProps = {
  children: React.ReactNode[];
  initialLayout?: GridLayout;
  onLayoutChange?: (layout: GridLayout) => void;
  id: string;
};

const DraggableGrid: React.FC<DraggableGridProps> = ({ 
  children, 
  initialLayout, 
  onLayoutChange,
  id 
}) => {
  const { toast } = useToast();
  
  // Generate a default layout if none is provided
  const generateDefaultLayout = (): GridLayout => {
    const layouts: GridLayout = {
      lg: [],
      md: [],
      sm: [],
      xs: [],
      xxs: []
    };
    
    if (!children?.length) return layouts;
    
    // Default layout with uneven box sizes based on content type
    // First component (Dashboard) - wide
    // Second component (Wallets) - normal
    // Third component (Chart) - wide and tall
    // Fourth component (CoinList) - normal but tall
    const boxConfigs = [
      { w: 6, h: 4, x: 0, y: 0 },  // Dashboard - wide
      { w: 6, h: 4, x: 6, y: 0 },  // Wallets - normal
      { w: 8, h: 6, x: 0, y: 4 },  // Chart - wide and tall
      { w: 4, h: 6, x: 8, y: 4 }   // CoinList - normal but tall
    ];
    
    children.forEach((_, i) => {
      const config = boxConfigs[i] || { w: 6, h: 4, x: 0, y: Math.floor(i / 2) * 4 };
      
      const item: LayoutItem = {
        i: `${i}`,
        x: config.x,
        y: config.y,
        w: config.w,
        h: config.h,
        minW: 2,
        minH: 2
      };
      
      layouts.lg.push({ ...item });
      
      // Adjust for medium screens (2-column layout)
      layouts.md.push({
        ...item,
        x: i % 2 * 6,
        y: Math.floor(i / 2) * 4,
        w: 6,
      });
      
      // Single column for small screens
      layouts.sm.push({
        ...item,
        x: 0,
        y: i * 4,
        w: 12,
        h: Math.min(item.h, 5) // Limit height on small screens
      });
      
      // Extra small screens
      layouts.xs.push({
        ...item,
        x: 0,
        y: i * 4,
        w: 12,
        h: Math.min(item.h, 4)
      });
      
      // Extra extra small screens
      layouts.xxs.push({
        ...item,
        x: 0,
        y: i * 4,
        w: 12,
        h: Math.min(item.h, 4)
      });
    });
    
    return layouts;
  };

  // Try to load saved layout from localStorage
  const loadSavedLayout = (): GridLayout | undefined => {
    try {
      const savedLayout = localStorage.getItem(`grid-layout-${id}`);
      return savedLayout ? JSON.parse(savedLayout) : undefined;
    } catch (error) {
      console.error('Failed to load saved layout:', error);
      return undefined;
    }
  };

  const [layout, setLayout] = useState<GridLayout>(() => {
    return loadSavedLayout() || initialLayout || generateDefaultLayout();
  });

  const handleLayoutChange = (currentLayout: LayoutItem[], allLayouts: GridLayout) => {
    setLayout(allLayouts);
    if (onLayoutChange) {
      onLayoutChange(allLayouts);
    }
    // Save to localStorage
    localStorage.setItem(`grid-layout-${id}`, JSON.stringify(allLayouts));
  };

  const handleSaveLayout = () => {
    localStorage.setItem(`grid-layout-${id}`, JSON.stringify(layout));
    toast({
      title: "Layout saved",
      description: "Your custom dashboard layout has been saved"
    });
  };

  const handleResetLayout = () => {
    const defaultLayout = generateDefaultLayout();
    setLayout(defaultLayout);
    localStorage.removeItem(`grid-layout-${id}`);
    toast({
      title: "Layout reset",
      description: "Dashboard layout has been reset to default"
    });
    if (onLayoutChange) {
      onLayoutChange(defaultLayout);
    }
  };

  return (
    <div className="draggable-grid-container">
      <div className="flex justify-end mb-4 gap-2">
        <button 
          onClick={handleSaveLayout}
          className="px-3 py-1 bg-crypto-primary hover:bg-crypto-secondary text-white text-sm rounded"
        >
          Save Layout
        </button>
        <button 
          onClick={handleResetLayout}
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded"
        >
          Reset Layout
        </button>
      </div>
      
      <ResponsiveGridLayout
        className="layout"
        layouts={layout}
        breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
        cols={{ lg: 12, md: 12, sm: 12, xs: 12, xxs: 12 }}
        rowHeight={100}
        margin={[16, 16]}
        onLayoutChange={handleLayoutChange}
        isDraggable={true}
        isResizable={true}
        draggableHandle=".draggable-handle"
      >
        {children.map((child, i) => (
          <div key={i.toString()} className="crypto-card relative overflow-hidden">
            <div className="draggable-handle bg-gray-800 absolute top-0 left-0 w-full h-6 cursor-move opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-xs text-gray-400">Drag to move</span>
            </div>
            {child}
          </div>
        ))}
      </ResponsiveGridLayout>
    </div>
  );
};

export default DraggableGrid;
