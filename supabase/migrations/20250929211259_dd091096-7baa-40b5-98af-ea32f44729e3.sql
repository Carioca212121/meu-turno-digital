-- Drop existing policies for work_records
DROP POLICY IF EXISTS "Users can view their own work records" ON public.work_records;

-- Create new policies that allow Empresa and Gerente to see all records
CREATE POLICY "Users can view work records based on role"
ON public.work_records
FOR SELECT
USING (
  auth.uid() = user_id OR 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role IN ('Empresa', 'Gerente')
  )
);

-- Update handle_new_user function to ensure role is properly set
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username, role)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'Funcionário')
  );
  RETURN NEW;
END;
$$;