/** Verified Unsplash image URLs for ClothCart products */

const img = (id: string, w = 800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const IMAGES = {
  // Men
  jacket: img("photo-1591047139829-d91aecb6caea"),
  jacketAlt: img("photo-1551028719-00167b16eac5"),
  jeans: img("photo-1542272604-787c3835535d"),
  linenShirt: img("photo-1596755094514-f87e34085b2c"),
  overcoat: img("photo-1539533018447-63fcce2678e3"),

  // Women
  blouse: img("photo-1515372039744-b8f02a3ae446"),
  maxiDress: img("photo-1595777457583-95e059d581b8"),
  leggings: img("photo-1544367567-0f2fcb009e0b"),
  knitSweater: img("photo-1434389677669-e08b4cac3105"),
  yogaSet: img("photo-1594381898411-846e7d193883"),
  fashion: img("photo-1490481651871-ab68de25d43d"),

  // Children
  kidsHoodie: img("photo-1503919545889-aef636e10ad4"),
  kidsPlay: img("photo-1503454537195-1dcabb73ffb9"),
  kidsSneakers: img("photo-1560769629-975ec94e6a86"),
  kidsCasual: img("photo-1556906781-9a412961c28c"),

  // Categories & hero
  categoryMen: img("photo-1617137968427-85924c800a22", 600),
  categoryWomen: img("photo-1483985988355-763728e1935b", 600),
  categoryChildren: img("photo-1503454537195-1dcabb73ffb9", 600),
  hero: img("photo-1483985988355-763728e1935b", 1920),

  // Additional products
  bomber: img("photo-1551028719-00167b16eac5"),
  cocktailDress: img("photo-1490481651871-ab68de25d43d"),
  polo: img("photo-1521572163474-6864f9cf17ab"),
  womenBlazer: img("photo-1515886657613-9f3515b0c78f"),
  menSneakers: img("photo-1608231387042-66d1773070a5"),
  womenHeels: img("photo-1543163521-1bf539c55dd2"),
  menHoodie: img("photo-1556821840-3a63f95609a7"),
  cardigan: img("photo-1472851294608-062f824d29cc"),
  kidsDress: img("photo-1587654780291-39c9404d746b"),
  chinos: img("photo-1542272604-787c3835535d"),
  activeTop: img("photo-1518611012118-696072aa579a"),
  editorial: img("photo-1522771739844-6a9f6d5f14af", 1200),
  lookbook: img("photo-1496747611176-843222e1e57c", 800),
  testimonialBg: img("photo-1441986300917-64674bd600d8", 600),

  /** Local SVG fallback when remote image fails */
  fallback: "/images/product-fallback.svg",
} as const;
