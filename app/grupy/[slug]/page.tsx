import { getGroupDetails, getMealPlan } from "@/app/actions/public-actions"
import GroupClient from "./group-client"

export const dynamic = "force-dynamic"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const details = await getGroupDetails(slug)
  const title = details?.group?.name 
    ? `${details.group.name} | EduCMS` 
    : "Grupa | EduCMS"
    
  return {
    title,
    description: details?.group?.description || "Strona grupy przedszkolnej",
    alternates: {
      canonical: `/grupy/${slug}`,
    },
    robots: { index: false, follow: false }, // Groups are private/protected
  }
}

export default async function GroupPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  // Fetch data on server
  const details = await getGroupDetails(slug)
  const mealPlan = await getMealPlan()
  
  const mealPlanUrl = mealPlan?.pdf_url || mealPlan?.image_url || null
  
  return (
    <GroupClient 
      initialGroupData={details?.group || null}
      initialMealPlanUrl={mealPlanUrl}
      initialGalleries={details?.galleries || []}
      slug={slug}
    />
  )
}
