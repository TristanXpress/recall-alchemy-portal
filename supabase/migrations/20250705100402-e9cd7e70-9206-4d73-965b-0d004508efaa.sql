
-- Remove the NOT NULL constraint from target_cities to allow null values
ALTER TABLE public.dynamic_incentives ALTER COLUMN target_cities DROP NOT NULL;

-- Update RLS policies to allow public creation and updates for testing
DROP POLICY IF EXISTS "Authenticated users can create dynamic incentives" ON public.dynamic_incentives;
DROP POLICY IF EXISTS "Users can update their own dynamic incentives" ON public.dynamic_incentives;
DROP POLICY IF EXISTS "Users can delete their own dynamic incentives" ON public.dynamic_incentives;

-- Create more permissive policies for dynamic incentives
CREATE POLICY "Anyone can create dynamic incentives" 
  ON public.dynamic_incentives 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can update dynamic incentives" 
  ON public.dynamic_incentives 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Anyone can delete dynamic incentives" 
  ON public.dynamic_incentives 
  FOR DELETE 
  USING (true);

-- Also update regular incentives policies for consistency
DROP POLICY IF EXISTS "Authenticated users can create incentives" ON public.incentives;
DROP POLICY IF EXISTS "Users can update their own incentives" ON public.incentives;
DROP POLICY IF EXISTS "Users can delete their own incentives" ON public.incentives;

CREATE POLICY "Anyone can create incentives" 
  ON public.incentives 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Anyone can update incentives" 
  ON public.incentives 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Anyone can delete incentives" 
  ON public.incentives 
  FOR DELETE 
  USING (true);
