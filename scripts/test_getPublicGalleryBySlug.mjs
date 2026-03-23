import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

process.env.DATABASE_URL = "postgresql://neondb_owner:npg_E7ospzV8bKfa@ep-winter-band-agzwnqdy-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require";

console.log("DATABASE_URL:", process.env.DATABASE_URL);

import pkg from "../app/actions/public-actions.mjs";

const { getPublicGalleryBySlug } = pkg;

async function testGetPublicGalleryBySlug() {
  try {
    const slug = "sale-przedszkola"; // Example slug
    const gallery = await getPublicGalleryBySlug(slug);
    console.log("Gallery Data:", gallery);
  } catch (error) {
    console.error("Error testing getPublicGalleryBySlug:", error);
  }
}

testGetPublicGalleryBySlug();