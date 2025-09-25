-- Fix critical security vulnerability: Restrict profile access to prevent email harvesting
-- Drop the overly permissive SELECT policy
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Create a more secure SELECT policy that only allows:
-- 1. Users to view their own profile
-- 2. Admins to view all profiles (for administration purposes)
CREATE POLICY "Users can view own profile or admins can view all" 
ON public.profiles 
FOR SELECT 
USING (
  auth.uid() = user_id 
  OR 
  (
    auth.uid() IS NOT NULL 
    AND EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  )
);

-- Also add a policy to allow public viewing of basic profile info (without email) for display purposes
-- This creates a view-like policy that excludes sensitive data
CREATE POLICY "Public can view basic profile info" 
ON public.profiles 
FOR SELECT 
USING (true);

-- Actually, let's be more careful and not allow public access at all
-- Remove the above policy and only use the restricted one
DROP POLICY IF EXISTS "Public can view basic profile info" ON public.profiles;