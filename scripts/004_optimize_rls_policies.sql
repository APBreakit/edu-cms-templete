-- Optimize RLS policies to avoid unnecessary re-evaluation of auth.uid() and remove redundant policies

-- 1. Fix auth_rls_initplan warnings by wrapping auth.uid() in (select auth.uid())
-- Ideally, for admin tables where authenticated users have full access, we can simplify to USING (true) for authenticated role.

-- meal_plans
-- Drop redundant policies first
DROP POLICY IF EXISTS "Authenticated users can insert meal plans" ON meal_plans;
DROP POLICY IF EXISTS "Authenticated users can update meal plans" ON meal_plans;
DROP POLICY IF EXISTS "Authenticated users can delete meal plans" ON meal_plans;
DROP POLICY IF EXISTS "Meal plans access policy" ON meal_plans;

-- Create unified optimized policies
CREATE POLICY "Meal plans access policy" ON meal_plans
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public meal plans access" ON meal_plans
  FOR SELECT
  TO anon
  USING (true);

-- galleries
DROP POLICY IF EXISTS "Galleries access policy" ON galleries;
CREATE POLICY "Galleries access policy" ON galleries
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public galleries access" ON galleries
  FOR SELECT
  TO anon
  USING (true);

-- gallery_images
DROP POLICY IF EXISTS "Gallery images access policy" ON gallery_images;
CREATE POLICY "Gallery images access policy" ON gallery_images
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public gallery images access" ON gallery_images
  FOR SELECT
  TO anon
  USING (true);

-- groups
DROP POLICY IF EXISTS "Groups access policy" ON groups;
CREATE POLICY "Groups access policy" ON groups
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public groups access" ON groups
  FOR SELECT
  TO anon
  USING (true);

-- media
DROP POLICY IF EXISTS "Media access policy" ON media;
CREATE POLICY "Media access policy" ON media
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public media access" ON media
  FOR SELECT
  TO anon
  USING (true);

-- posts
DROP POLICY IF EXISTS "Posts access policy" ON posts;
CREATE POLICY "Posts access policy" ON posts
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public posts access" ON posts
  FOR SELECT
  TO anon
  USING (true);
