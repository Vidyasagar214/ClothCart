-- Product metadata columns for catalog display (M2)
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS subcategory VARCHAR(100),
  ADD COLUMN IF NOT EXISTS material TEXT,
  ADD COLUMN IF NOT EXISTS fit TEXT,
  ADD COLUMN IF NOT EXISTS care TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS highlights TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS avg_rating DECIMAL(2,1) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS review_count INT DEFAULT 0;
