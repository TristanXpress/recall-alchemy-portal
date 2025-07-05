
-- Create incentives table
CREATE TABLE public.incentives (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed')),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  conditions TEXT[],
  user_type TEXT NOT NULL CHECK (user_type IN ('customer', 'driver')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create dynamic incentives table
CREATE TABLE public.dynamic_incentives (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('percentage', 'fixed')),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  conditions TEXT[],
  target_cities TEXT[] NOT NULL,
  coordinates JSONB,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),  
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table for user management
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.incentives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dynamic_incentives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for incentives
CREATE POLICY "Anyone can view active incentives" 
  ON public.incentives 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Authenticated users can create incentives" 
  ON public.incentives 
  FOR INSERT 
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own incentives" 
  ON public.incentives 
  FOR UPDATE 
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own incentives" 
  ON public.incentives 
  FOR DELETE 
  USING (auth.uid() = created_by);

-- RLS Policies for dynamic incentives
CREATE POLICY "Anyone can view active dynamic incentives" 
  ON public.dynamic_incentives 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Authenticated users can create dynamic incentives" 
  ON public.dynamic_incentives 
  FOR INSERT 
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own dynamic incentives" 
  ON public.dynamic_incentives 
  FOR UPDATE 
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own dynamic incentives" 
  ON public.dynamic_incentives 
  FOR DELETE 
  USING (auth.uid() = created_by);

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to get incentives by location and user type
CREATE OR REPLACE FUNCTION public.get_incentives_by_location(
  p_location TEXT DEFAULT NULL,
  p_user_type TEXT DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  amount DECIMAL(10,2),
  type TEXT,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  location TEXT,
  conditions TEXT[],
  user_type TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    i.id,
    i.title,
    i.description,
    i.amount,
    i.type,
    i.start_date,
    i.end_date,
    i.location,
    i.conditions,
    i.user_type
  FROM public.incentives i
  WHERE i.is_active = true
    AND i.start_date <= NOW()
    AND i.end_date >= NOW()
    AND (p_location IS NULL OR i.location = p_location)
    AND (p_user_type IS NULL OR i.user_type = p_user_type);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get dynamic incentives by cities
CREATE OR REPLACE FUNCTION public.get_dynamic_incentives_by_cities(
  p_cities TEXT[] DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  description TEXT,
  amount DECIMAL(10,2),
  type TEXT,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  target_cities TEXT[],
  coordinates JSONB,
  conditions TEXT[]
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    di.id,
    di.title,
    di.description,
    di.amount,
    di.type,
    di.start_date,
    di.end_date,
    di.target_cities,
    di.coordinates,
    di.conditions
  FROM public.dynamic_incentives di
  WHERE di.is_active = true
    AND di.start_date <= NOW()
    AND di.end_date >= NOW()
    AND (p_cities IS NULL OR di.target_cities && p_cities);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
