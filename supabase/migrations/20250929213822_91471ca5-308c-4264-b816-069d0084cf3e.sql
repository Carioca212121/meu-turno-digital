-- Drop existing SELECT policy on profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Create new policy that allows users to see their own profile AND allows Gerente/Empresa to see all profiles
CREATE POLICY "Users can view profiles based on role"
ON public.profiles
FOR SELECT
USING (
  auth.uid() = user_id OR 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.role IN ('Empresa', 'Gerente')
  )
);