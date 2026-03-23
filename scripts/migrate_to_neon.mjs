import { Pool } from "@neondatabase/serverless"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

 async function main() {
  console.log("Starting migration to Neon...")

  try {
    const migrationSql = `
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );

      ALTER TABLE users
        ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user';

      UPDATE users SET role = 'superadmin' WHERE email = 'admin@educms-szablon.pl';

      CREATE TABLE IF NOT EXISTS posts (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title TEXT NOT NULL,
        content TEXT,
        excerpt TEXT,
        type TEXT,
        status TEXT,
        published BOOLEAN DEFAULT FALSE,
        slug TEXT UNIQUE,
        image_url TEXT,
        add_to_calendar BOOLEAN DEFAULT FALSE,
        calendar_date TIMESTAMP,
        calendar_end_date TIMESTAMP,
        competition_status TEXT,
        competition_start_date TIMESTAMP,
        competition_end_date TIMESTAMP,
        group_category TEXT,
        user_id TEXT,
        published_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP
      );

      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'posts' AND column_name = 'image') THEN
          EXECUTE 'ALTER TABLE posts RENAME COLUMN image TO image_url';
        END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'posts' AND column_name = 'date')
           AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'posts' AND column_name = 'created_at') THEN
          EXECUTE 'ALTER TABLE posts RENAME COLUMN date TO created_at';
        END IF;
      END
      $$;

      ALTER TABLE posts
        ADD COLUMN IF NOT EXISTS excerpt TEXT,
        ADD COLUMN IF NOT EXISTS type TEXT,
        ADD COLUMN IF NOT EXISTS status TEXT,
        ADD COLUMN IF NOT EXISTS slug TEXT,
        ADD COLUMN IF NOT EXISTS image_url TEXT,
        ADD COLUMN IF NOT EXISTS add_to_calendar BOOLEAN DEFAULT FALSE,
        ADD COLUMN IF NOT EXISTS calendar_date TIMESTAMP,
        ADD COLUMN IF NOT EXISTS calendar_end_date TIMESTAMP,
        ADD COLUMN IF NOT EXISTS competition_status TEXT,
        ADD COLUMN IF NOT EXISTS competition_start_date TIMESTAMP,
        ADD COLUMN IF NOT EXISTS competition_end_date TIMESTAMP,
        ADD COLUMN IF NOT EXISTS group_category TEXT,
        ADD COLUMN IF NOT EXISTS published_at TIMESTAMP,
        ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP;

      CREATE TABLE IF NOT EXISTS groups (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        password TEXT,
        teacher_name TEXT,
        teacher_photo TEXT,
        meal_plan_url TEXT,
        age_group TEXT,
        hours TEXT,
        number_of_children TEXT,
        description TEXT,
        schedule JSON,
        documents JSON,
        contact_hours TEXT,
        color TEXT,
        email TEXT,
        phone TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );

      ALTER TABLE groups
        ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP;

      CREATE TABLE IF NOT EXISTS galleries (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title TEXT NOT NULL,
        description TEXT,
        category TEXT,
        cover_image_url TEXT,
        status TEXT,
        slug TEXT UNIQUE NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP,
        created_by TEXT
      );

      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'galleries' AND column_name = 'cover_image') THEN
          EXECUTE 'ALTER TABLE galleries RENAME COLUMN cover_image TO cover_image_url';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'galleries' AND column_name = 'category') THEN
          EXECUTE 'ALTER TABLE galleries ADD COLUMN category TEXT';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'galleries' AND column_name = 'status') THEN
          EXECUTE 'ALTER TABLE galleries ADD COLUMN status TEXT';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'galleries' AND column_name = 'updated_at') THEN
          EXECUTE 'ALTER TABLE galleries ADD COLUMN updated_at TIMESTAMP';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'galleries' AND column_name = 'created_by') THEN
          EXECUTE 'ALTER TABLE galleries ADD COLUMN created_by TEXT';
        END IF;
      END
      $$;

      CREATE TABLE IF NOT EXISTS gallery_categories (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        visible BOOLEAN DEFAULT TRUE,
        display_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );

      CREATE TABLE IF NOT EXISTS gallery_category_links (
        gallery_id UUID REFERENCES galleries(id) ON DELETE CASCADE,
        category_slug TEXT REFERENCES gallery_categories(slug) ON DELETE CASCADE,
        PRIMARY KEY (gallery_id, category_slug)
      );

      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM gallery_categories WHERE slug = 'wydarzenia') THEN
          INSERT INTO gallery_categories (name, slug, visible, display_order) VALUES ('Wydarzenia', 'wydarzenia', TRUE, 1);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM gallery_categories WHERE slug = 'przedszkole') THEN
          INSERT INTO gallery_categories (name, slug, visible, display_order) VALUES ('Przedszkole', 'przedszkole', TRUE, 2);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM gallery_categories WHERE slug = 'sale') THEN
          INSERT INTO gallery_categories (name, slug, visible, display_order) VALUES ('Sale', 'sale', TRUE, 3);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM gallery_categories WHERE slug = 'zajecia') THEN
          INSERT INTO gallery_categories (name, slug, visible, display_order) VALUES ('Zajęcia', 'zajecia', TRUE, 4);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM gallery_categories WHERE slug = 'zajecia-tematyczne') THEN
          INSERT INTO gallery_categories (name, slug, visible, display_order) VALUES ('Zajęcia tematyczne', 'zajecia-tematyczne', TRUE, 5);
        END IF;
        IF NOT EXISTS (SELECT 1 FROM gallery_categories WHERE slug = 'inne') THEN
          INSERT INTO gallery_categories (name, slug, visible, display_order) VALUES ('Inne', 'inne', TRUE, 99);
        END IF;
      END
      $$;

      CREATE TABLE IF NOT EXISTS gallery_images (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        gallery_id UUID REFERENCES galleries(id) ON DELETE CASCADE,
        image_url TEXT NOT NULL,
        title TEXT,
        caption TEXT,
        sort_order INT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );

      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gallery_images' AND column_name = 'url') THEN
          EXECUTE 'ALTER TABLE gallery_images RENAME COLUMN url TO image_url';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gallery_images' AND column_name = 'title') THEN
          EXECUTE 'ALTER TABLE gallery_images ADD COLUMN title TEXT';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gallery_images' AND column_name = 'caption') THEN
          EXECUTE 'ALTER TABLE gallery_images ADD COLUMN caption TEXT';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'gallery_images' AND column_name = 'sort_order') THEN
          EXECUTE 'ALTER TABLE gallery_images ADD COLUMN sort_order INT';
        END IF;
      END
      $$;

      CREATE TABLE IF NOT EXISTS meal_plans (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        week_start TIMESTAMP NOT NULL,
        week_end TIMESTAMP NOT NULL,
        pdf_url TEXT,
        image_url TEXT,
        uploaded_by TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );

      ALTER TABLE meal_plans
        ADD COLUMN IF NOT EXISTS is_current BOOLEAN DEFAULT FALSE;

      CREATE TABLE IF NOT EXISTS media (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        file_url TEXT NOT NULL,
        file_name TEXT NOT NULL,
        file_type TEXT NOT NULL,
        file_size TEXT,
        category TEXT,
        subcategory TEXT,
        uploaded_by TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );

      CREATE TABLE IF NOT EXISTS rada_rodzicow_posts (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title TEXT NOT NULL,
        content TEXT,
        date TIMESTAMP DEFAULT NOW(),
        excerpt TEXT,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );

      CREATE TABLE IF NOT EXISTS rada_rodzicow_documents (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title TEXT NOT NULL,
        url TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );

      ALTER TABLE rada_rodzicow_documents
        ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 0;

      CREATE TABLE IF NOT EXISTS admin_permissions (
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        section TEXT NOT NULL,
        PRIMARY KEY (user_id, section)
      );

      CREATE TABLE IF NOT EXISTS group_update_log (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
        updated_by UUID REFERENCES users(id),
        action TEXT NOT NULL,
        details JSON,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      );

      ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
      ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
      ALTER TABLE galleries ENABLE ROW LEVEL SECURITY;
      ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
      ALTER TABLE gallery_category_links ENABLE ROW LEVEL SECURITY;
      ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
      ALTER TABLE media ENABLE ROW LEVEL SECURITY;
      ALTER TABLE rada_rodzicow_posts ENABLE ROW LEVEL SECURITY;
      ALTER TABLE rada_rodzicow_documents ENABLE ROW LEVEL SECURITY;
      ALTER TABLE admin_permissions ENABLE ROW LEVEL SECURITY;
      ALTER TABLE group_update_log ENABLE ROW LEVEL SECURITY;

      DROP POLICY IF EXISTS public_select ON posts;
      DROP POLICY IF EXISTS admin_insert ON posts;
      DROP POLICY IF EXISTS admin_update ON posts;
      DROP POLICY IF EXISTS admin_delete ON posts;
      CREATE POLICY public_select ON posts FOR SELECT USING (true);
      CREATE POLICY admin_insert ON posts FOR INSERT WITH CHECK (current_setting('app.user_role', true) = 'admin');
      CREATE POLICY admin_update ON posts FOR UPDATE USING (current_setting('app.user_role', true) = 'admin') WITH CHECK (current_setting('app.user_role', true) = 'admin');
      CREATE POLICY admin_delete ON posts FOR DELETE USING (current_setting('app.user_role', true) = 'admin');

      DROP POLICY IF EXISTS public_select ON groups;
      DROP POLICY IF EXISTS admin_insert ON groups;
      DROP POLICY IF EXISTS admin_update ON groups;
      DROP POLICY IF EXISTS admin_delete ON groups;
      CREATE POLICY public_select ON groups FOR SELECT USING (true);
      CREATE POLICY admin_insert ON groups FOR INSERT WITH CHECK (current_setting('app.user_role', true) = 'admin');
      CREATE POLICY admin_update ON groups FOR UPDATE USING (current_setting('app.user_role', true) = 'admin') WITH CHECK (current_setting('app.user_role', true) = 'admin');
      CREATE POLICY admin_delete ON groups FOR DELETE USING (current_setting('app.user_role', true) = 'admin');

      DROP POLICY IF EXISTS public_select ON galleries;
      DROP POLICY IF EXISTS admin_insert ON galleries;
      DROP POLICY IF EXISTS admin_update ON galleries;
      DROP POLICY IF EXISTS admin_delete ON galleries;
      CREATE POLICY public_select ON galleries FOR SELECT USING (true);
      CREATE POLICY admin_insert ON galleries FOR INSERT WITH CHECK (current_setting('app.user_role', true) = 'admin');
      CREATE POLICY admin_update ON galleries FOR UPDATE USING (current_setting('app.user_role', true) = 'admin') WITH CHECK (current_setting('app.user_role', true) = 'admin');
      CREATE POLICY admin_delete ON galleries FOR DELETE USING (current_setting('app.user_role', true) = 'admin');

      DROP POLICY IF EXISTS public_select ON gallery_images;
      DROP POLICY IF EXISTS admin_insert ON gallery_images;
      DROP POLICY IF EXISTS admin_update ON gallery_images;
      DROP POLICY IF EXISTS admin_delete ON gallery_images;
      CREATE POLICY public_select ON gallery_images FOR SELECT USING (true);
      CREATE POLICY admin_insert ON gallery_images FOR INSERT WITH CHECK (current_setting('app.user_role', true) = 'admin');
      CREATE POLICY admin_update ON gallery_images FOR UPDATE USING (current_setting('app.user_role', true) = 'admin') WITH CHECK (current_setting('app.user_role', true) = 'admin');
      CREATE POLICY admin_delete ON gallery_images FOR DELETE USING (current_setting('app.user_role', true) = 'admin');

      DROP POLICY IF EXISTS public_select ON gallery_category_links;
      DROP POLICY IF EXISTS admin_insert ON gallery_category_links;
      DROP POLICY IF EXISTS admin_delete ON gallery_category_links;
      CREATE POLICY public_select ON gallery_category_links FOR SELECT USING (true);
      CREATE POLICY admin_insert ON gallery_category_links FOR INSERT WITH CHECK (current_setting('app.user_role', true) = 'admin');
      CREATE POLICY admin_delete ON gallery_category_links FOR DELETE USING (current_setting('app.user_role', true) = 'admin');

      DROP POLICY IF EXISTS public_select ON meal_plans;
      DROP POLICY IF EXISTS admin_insert ON meal_plans;
      DROP POLICY IF EXISTS admin_update ON meal_plans;
      DROP POLICY IF EXISTS admin_delete ON meal_plans;
      CREATE POLICY public_select ON meal_plans FOR SELECT USING (true);
      CREATE POLICY admin_insert ON meal_plans FOR INSERT WITH CHECK (current_setting('app.user_role', true) = 'admin');
      CREATE POLICY admin_update ON meal_plans FOR UPDATE USING (current_setting('app.user_role', true) = 'admin') WITH CHECK (current_setting('app.user_role', true) = 'admin');
      CREATE POLICY admin_delete ON meal_plans FOR DELETE USING (current_setting('app.user_role', true) = 'admin');

      DROP POLICY IF EXISTS public_select ON media;
      DROP POLICY IF EXISTS admin_insert ON media;
      DROP POLICY IF EXISTS admin_update ON media;
      DROP POLICY IF EXISTS admin_delete ON media;
      CREATE POLICY public_select ON media FOR SELECT USING (true);
      CREATE POLICY admin_insert ON media FOR INSERT WITH CHECK (current_setting('app.user_role', true) = 'admin');
      CREATE POLICY admin_update ON media FOR UPDATE USING (current_setting('app.user_role', true) = 'admin') WITH CHECK (current_setting('app.user_role', true) = 'admin');
      CREATE POLICY admin_delete ON media FOR DELETE USING (current_setting('app.user_role', true) = 'admin');

      DROP POLICY IF EXISTS public_select ON rada_rodzicow_posts;
      DROP POLICY IF EXISTS admin_insert ON rada_rodzicow_posts;
      DROP POLICY IF EXISTS admin_update ON rada_rodzicow_posts;
      DROP POLICY IF EXISTS admin_delete ON rada_rodzicow_posts;
      CREATE POLICY public_select ON rada_rodzicow_posts FOR SELECT USING (true);
      CREATE POLICY admin_insert ON rada_rodzicow_posts FOR INSERT WITH CHECK (current_setting('app.user_role', true) = 'admin');
      CREATE POLICY admin_update ON rada_rodzicow_posts FOR UPDATE USING (current_setting('app.user_role', true) = 'admin') WITH CHECK (current_setting('app.user_role', true) = 'admin');
      CREATE POLICY admin_delete ON rada_rodzicow_posts FOR DELETE USING (current_setting('app.user_role', true) = 'admin');

      DROP POLICY IF EXISTS public_select ON rada_rodzicow_documents;
      DROP POLICY IF EXISTS admin_insert ON rada_rodzicow_documents;
      DROP POLICY IF EXISTS admin_update ON rada_rodzicow_documents;
      DROP POLICY IF EXISTS admin_delete ON rada_rodzicow_documents;
      CREATE POLICY public_select ON rada_rodzicow_documents FOR SELECT USING (true);
      CREATE POLICY admin_insert ON rada_rodzicow_documents FOR INSERT WITH CHECK (current_setting('app.user_role', true) = 'admin');
      CREATE POLICY admin_update ON rada_rodzicow_documents FOR UPDATE USING (current_setting('app.user_role', true) = 'admin') WITH CHECK (current_setting('app.user_role', true) = 'admin');
      CREATE POLICY admin_delete ON rada_rodzicow_documents FOR DELETE USING (current_setting('app.user_role', true) = 'admin');

      DROP POLICY IF EXISTS public_select ON admin_permissions;
      DROP POLICY IF EXISTS admin_insert ON admin_permissions;
      DROP POLICY IF EXISTS admin_delete ON admin_permissions;
      CREATE POLICY public_select ON admin_permissions FOR SELECT USING (current_setting('app.user_role', true) = 'admin');
      CREATE POLICY admin_insert ON admin_permissions FOR INSERT WITH CHECK (current_setting('app.user_role', true) = 'admin');
      CREATE POLICY admin_delete ON admin_permissions FOR DELETE USING (current_setting('app.user_role', true) = 'admin');

      DROP POLICY IF EXISTS public_select ON group_update_log;
      DROP POLICY IF EXISTS admin_insert ON group_update_log;
      DROP POLICY IF EXISTS admin_delete ON group_update_log;
      CREATE POLICY public_select ON group_update_log FOR SELECT USING (current_setting('app.user_role', true) = 'admin');
      CREATE POLICY admin_insert ON group_update_log FOR INSERT WITH CHECK (current_setting('app.user_role', true) = 'admin');
      CREATE POLICY admin_delete ON group_update_log FOR DELETE USING (current_setting('app.user_role', true) = 'admin');

      ALTER TABLE gallery_categories ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS public_select ON gallery_categories;
      DROP POLICY IF EXISTS admin_insert ON gallery_categories;
      DROP POLICY IF EXISTS admin_update ON gallery_categories;
      DROP POLICY IF EXISTS admin_delete ON gallery_categories;
      CREATE POLICY public_select ON gallery_categories FOR SELECT USING (true);
      CREATE POLICY admin_insert ON gallery_categories FOR INSERT WITH CHECK (current_setting('app.user_role', true) = 'admin');
      CREATE POLICY admin_update ON gallery_categories FOR UPDATE USING (current_setting('app.user_role', true) = 'admin') WITH CHECK (current_setting('app.user_role', true) = 'admin');
      CREATE POLICY admin_delete ON gallery_categories FOR DELETE USING (current_setting('app.user_role', true) = 'admin');

      CREATE TABLE IF NOT EXISTS rada_rodzicow_info (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        chairperson TEXT DEFAULT '' NOT NULL,
        vice_chairperson TEXT DEFAULT '' NOT NULL,
        treasurer TEXT DEFAULT '' NOT NULL,
        secretary TEXT DEFAULT '' NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      );

      ALTER TABLE rada_rodzicow_info ENABLE ROW LEVEL SECURITY;
      DROP POLICY IF EXISTS public_select ON rada_rodzicow_info;
      DROP POLICY IF EXISTS admin_insert ON rada_rodzicow_info;
      DROP POLICY IF EXISTS admin_update ON rada_rodzicow_info;
      DROP POLICY IF EXISTS admin_delete ON rada_rodzicow_info;
      CREATE POLICY public_select ON rada_rodzicow_info FOR SELECT USING (true);
      CREATE POLICY admin_insert ON rada_rodzicow_info FOR INSERT WITH CHECK (current_setting('app.user_role', true) = 'admin');
      CREATE POLICY admin_update ON rada_rodzicow_info FOR UPDATE USING (current_setting('app.user_role', true) = 'admin') WITH CHECK (current_setting('app.user_role', true) = 'admin');
      CREATE POLICY admin_delete ON rada_rodzicow_info FOR DELETE USING (current_setting('app.user_role', true) = 'admin');

      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM rada_rodzicow_info) THEN
          INSERT INTO rada_rodzicow_info (chairperson, vice_chairperson, treasurer, secretary)
          VALUES ('', '', '', '');
        END IF;
      END
      $$;

      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_indexes WHERE tablename = 'posts' AND indexname IN ('posts_slug_key','idx_posts_slug')
        ) THEN
          EXECUTE 'CREATE UNIQUE INDEX idx_posts_slug ON posts(slug)';
        END IF;
        IF NOT EXISTS (
          SELECT 1 FROM pg_indexes WHERE tablename = 'galleries' AND indexname IN ('galleries_slug_key','idx_galleries_slug_unique')
        ) THEN
          EXECUTE 'CREATE UNIQUE INDEX idx_galleries_slug_unique ON galleries(slug)';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_posts_type') THEN
          EXECUTE 'CREATE INDEX idx_posts_type ON posts(type)';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_posts_status') THEN
          EXECUTE 'CREATE INDEX idx_posts_status ON posts(status)';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_posts_calendar_date') THEN
          EXECUTE 'CREATE INDEX idx_posts_calendar_date ON posts(calendar_date)';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_galleries_slug') THEN
          EXECUTE 'CREATE INDEX idx_galleries_slug ON galleries(slug)';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_meal_plans_is_current') THEN
          EXECUTE 'CREATE INDEX idx_meal_plans_is_current ON meal_plans(is_current)';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_group_update_log_group_id') THEN
          EXECUTE 'CREATE INDEX idx_group_update_log_group_id ON group_update_log(group_id)';
        END IF;
        IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_group_update_log_created_at') THEN
          EXECUTE 'CREATE INDEX idx_group_update_log_created_at ON group_update_log(created_at)';
        END IF;
      END
      $$;
    `

    await pool.query(migrationSql)

    console.log("Tables created successfully.")
  } catch (error) {
    console.error("Migration failed:", error)
  }
}

await main()
