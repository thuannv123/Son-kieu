import { supabaseAdmin } from "@/lib/supabase-admin";
import DiningManager from "@/components/admin/DiningManager";

export const revalidate = 0;

export default async function AdminDiningPage() {
  const [{ data: dishes }, { data: restaurants }, { data: categories }] = await Promise.all([
    supabaseAdmin.from("dishes").select("*").order("sort_order").order("created_at"),
    supabaseAdmin.from("restaurants").select("*").order("sort_order").order("created_at"),
    supabaseAdmin.from("dish_categories").select("*").order("sort_order"),
  ]);

  return (
    <DiningManager
      dishes={dishes ?? []}
      restaurants={restaurants ?? []}
      categories={categories ?? []}
    />
  );
}
