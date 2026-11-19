export type ProductSeed = {
  title: string;
  description: string;
  price: number;
  rating: number;
  category: string;
  stockQuantity: number;
  specifications: Record<string, string>;
};

function imagesFor(title: string): string[] {
  return [1, 2, 3].map(
    (index) =>
      `https://placehold.co/800x600?text=${encodeURIComponent(`${title} ${index}`)}`,
  );
}

const catalog: ProductSeed[] = [
  {
    title: 'Exterior Paint Set',
    description:
      'Professional-grade exterior paint set designed to withstand harsh weather conditions. This premium paint offers excellent coverage, durability, and color retention.',
    price: 45.99,
    rating: 3.5,
    category: 'Paint & Coatings',
    stockQuantity: 40,
    specifications: {
      Volume: '5 gallons total',
      Type: '100% Acrylic Latex',
      Coverage: '400 sq ft per gallon',
      Finish: 'Satin',
    },
  },
  {
    title: 'Plywood Sheets',
    description:
      'Versatile construction-grade plywood sheets suitable for subfloors, roofing, walls, and general construction.',
    price: 52.99,
    rating: 4.5,
    category: 'Wood & Lumber',
    stockQuantity: 80,
    specifications: {
      Dimensions: "4' x 8'",
      Thickness: '3/4 inch',
      Grade: 'CDX',
      Exposure: 'Exterior grade',
    },
  },
  {
    title: 'Premium Cement Bags',
    description:
      'High-quality Portland cement bags for foundations, structural work, and general concrete applications.',
    price: 24.99,
    rating: 5,
    category: 'Cement & Concrete',
    stockQuantity: 200,
    specifications: {
      Weight: '50 lbs per bag',
      Type: 'Portland Cement Type I/II',
      'Compressive Strength': '3500 PSI at 28 days',
    },
  },
  {
    title: 'Premium Lumber Planks',
    description:
      'Premium kiln-dried lumber planks for framing, decking, furniture making, and carpentry projects.',
    price: 89.99,
    rating: 4.5,
    category: 'Wood & Lumber',
    stockQuantity: 60,
    specifications: {
      Dimensions: "2\" x 6\" x 8'",
      'Wood Type': 'Douglas Fir',
      Grade: 'Premium Select',
      'Moisture Content': '15% kiln-dried',
    },
  },
  {
    title: 'Red Clay Bricks',
    description:
      'Traditional red clay bricks for walls, patios, pathways, and architectural features.',
    price: 0.89,
    rating: 4,
    category: 'Bricks & Masonry',
    stockQuantity: 1000,
    specifications: {
      Dimensions: '8" x 4" x 2.25"',
      Material: 'Fire-hardened clay',
      'Compressive Strength': '3000+ PSI',
    },
  },
  {
    title: 'Steel I-Beams',
    description:
      'Heavy-duty structural steel I-beams for building frames and structural support.',
    price: 349.99,
    rating: 5,
    category: 'Steel & Metal',
    stockQuantity: 12,
    specifications: {
      Length: '20 feet',
      Profile: 'W10x49',
      Material: 'ASTM A992 Grade 50 Steel',
    },
  },
  {
    title: 'Ceramic Floor Tiles',
    description: 'Matte ceramic floor tiles for kitchens, hallways, and wet rooms.',
    price: 18.5,
    rating: 4.2,
    category: 'Tiles',
    stockQuantity: 300,
    specifications: { Size: '12" x 12"', Finish: 'Matte', Material: 'Ceramic' },
  },
  {
    title: 'Copper Pipe Coil',
    description: 'Flexible copper pipe coil for water supply and heating lines.',
    price: 64,
    rating: 4,
    category: 'Plumbing',
    stockQuantity: 45,
    specifications: { Diameter: '1/2 inch', Length: '50 feet', Material: 'Copper' },
  },
  {
    title: 'Fiberglass Insulation Rolls',
    description: 'Fiberglass insulation rolls for walls and attics.',
    price: 37.5,
    rating: 4.8,
    category: 'Insulation',
    stockQuantity: 70,
    specifications: { Thickness: '3.5 inch', Width: '15 inch', RValue: 'R-13' },
  },
  {
    title: 'Safety Work Gloves',
    description: 'Cut-resistant work gloves for site and warehouse use.',
    price: 12.99,
    rating: 3,
    category: 'Safety',
    stockQuantity: 150,
    specifications: { Size: 'Large', Material: 'HPPE knit', Coating: 'Nitrile palm' },
  },
  {
    title: 'Concrete Mixer',
    description: 'Portable electric concrete mixer for small pours and repair jobs.',
    price: 429,
    rating: 4.7,
    category: 'Tools',
    stockQuantity: 8,
    specifications: { Capacity: '3.5 cubic feet', Power: '120V', Drum: 'Steel' },
  },
  {
    title: 'Roofing Shingles Bundle',
    description: 'Asphalt roofing shingles bundle for residential pitched roofs.',
    price: 31.25,
    rating: 4.1,
    category: 'Roofing',
    stockQuantity: 90,
    specifications: { Coverage: '33 sq ft', Style: 'Architectural', Color: 'Charcoal' },
  },
  {
    title: 'Drywall Sheets',
    description: 'Standard gypsum drywall sheets for interior walls and ceilings.',
    price: 15.4,
    rating: 3.8,
    category: 'Drywall',
    stockQuantity: 120,
    specifications: { Dimensions: "4' x 8'", Thickness: '1/2 inch', Type: 'Regular gypsum' },
  },
  {
    title: 'LED Shop Light',
    description: 'Linkable LED shop light for garages and workbenches.',
    price: 28.75,
    rating: 4.6,
    category: 'Electrical',
    stockQuantity: 55,
    specifications: { Length: '4 feet', Brightness: '4500 lumens', Color: '5000K' },
  },
  {
    title: 'Galvanized Nails Box',
    description: 'Box of galvanized framing nails for outdoor construction.',
    price: 8.49,
    rating: 4.3,
    category: 'Fasteners',
    stockQuantity: 400,
    specifications: { Size: '3 inch', Finish: 'Hot-dip galvanized', Count: '5 lb box' },
  },
  {
    title: 'Oak Hardwood Flooring',
    description: 'Solid oak flooring planks for living rooms and bedrooms.',
    price: 120,
    rating: 4.9,
    category: 'Wood & Lumber',
    stockQuantity: 30,
    specifications: { Thickness: '3/4 inch', Width: '3.25 inch', Species: 'White oak' },
  },
  {
    title: 'Exterior Caulk Tubes',
    description: 'Paintable exterior caulk for window and siding joints.',
    price: 6.25,
    rating: 3.2,
    category: 'Paint & Coatings',
    stockQuantity: 250,
    specifications: { Volume: '10.1 oz', Base: 'Acrylic latex', Use: 'Exterior' },
  },
  {
    title: 'Rebar Stakes',
    description: 'Steel rebar stakes for concrete forms and landscape edging.',
    price: 2.15,
    rating: 4.4,
    category: 'Steel & Metal',
    stockQuantity: 600,
    specifications: { Length: '24 inch', Diameter: '3/8 inch', Material: 'Carbon steel' },
  },
];

export const productSeed = catalog.map((product) => ({
  ...product,
  images: imagesFor(product.title),
}));
