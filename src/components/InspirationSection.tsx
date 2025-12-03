import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface InspirationItem {
  id: string;
  title: string;
  image: string;
  category?: string;
}

const defaultInspiration: InspirationItem[] = [
  {
    id: "1",
    title: "Regalos Tecnologia",
    image: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=300&h=200&fit=crop",
    category: "tech"
  },
  {
    id: "2",
    title: "Moda y Accesorios",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=300&h=200&fit=crop",
    category: "fashion"
  },
  {
    id: "3",
    title: "Hogar y Decoracion",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop",
    category: "home"
  },
  {
    id: "4",
    title: "Deportes y Fitness",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=300&h=200&fit=crop",
    category: "sports"
  },
  {
    id: "5",
    title: "Belleza y Cuidado",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&h=200&fit=crop",
    category: "beauty"
  },
  {
    id: "6",
    title: "Libros y Papeleria",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=200&fit=crop",
    category: "books"
  }
];

interface InspirationSectionProps {
  items?: InspirationItem[];
  onItemClick?: (item: InspirationItem) => void;
}

export function InspirationSection({ items = defaultInspiration, onItemClick }: InspirationSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            Inspiracion
            <span className="text-orange-500">*</span>
          </h2>
          <p className="text-sm text-gray-500">Mira cual es la tendencia</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            className={cn(
              "w-9 h-9 rounded-full border flex items-center justify-center transition-all",
              canScrollLeft
                ? "border-gray-300 text-gray-600 hover:border-[#1ABC9C] hover:text-[#1ABC9C]"
                : "border-gray-200 text-gray-300 cursor-not-allowed"
            )}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll('right')}
            disabled={!canScrollRight}
            className={cn(
              "w-9 h-9 rounded-full border flex items-center justify-center transition-all",
              canScrollRight
                ? "border-gray-300 text-gray-600 hover:border-[#1ABC9C] hover:text-[#1ABC9C]"
                : "border-gray-200 text-gray-300 cursor-not-allowed"
            )}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4">Inspiracion</p>

      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onItemClick?.(item)}
            className="flex-shrink-0 group focus:outline-none focus:ring-2 focus:ring-[#1ABC9C] focus:ring-offset-2 rounded-xl"
          >
            <div className="w-48 h-32 rounded-xl overflow-hidden relative">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <p className="text-white font-medium text-sm line-clamp-1">{item.title}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
