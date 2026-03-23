export interface GalleryImage {
  id: string;
  image_url: string;
  title: string;
  sort_order: number;
}

export interface Gallery {
  id: string;
  title: string;
  description: string;
  slug: string;
  cover_image_url: string;
  status: string;
  images: GalleryImage[];
}

export function getPublicPosts(type?: string, limit?: number): Promise<any[]>;
export function getPublicGalleryImages(category?: string): Promise<any[]>;
export function getPublicGalleryBySlug(slug: string): Promise<Gallery | null>;

const actions: {
  getPublicPosts: typeof getPublicPosts;
  getPublicGalleryImages: typeof getPublicGalleryImages;
  getPublicGalleryBySlug: typeof getPublicGalleryBySlug;
};

export default actions;
