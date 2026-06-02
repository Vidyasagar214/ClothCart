import type { SupabaseClient } from "@supabase/supabase-js";
import type { SavedAddress, ShippingAddress } from "@/types";

function mapAddress(row: {
  id: string;
  label: string;
  full_name: string;
  phone: string;
  address_line1: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
}): SavedAddress {
  return {
    id: row.id,
    label: row.label ?? "home",
    name: row.full_name,
    phone: row.phone,
    line1: row.address_line1,
    city: row.city,
    state: row.state,
    pincode: row.pincode,
    isDefault: row.is_default ?? false,
  };
}

export async function listAddresses(supabase: SupabaseClient, userId: string): Promise<SavedAddress[]> {
  const { data } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", userId)
    .order("is_default", { ascending: false });
  return (data ?? []).map(mapAddress);
}

export async function createAddress(
  supabase: SupabaseClient,
  userId: string,
  input: ShippingAddress & { label?: string; isDefault?: boolean }
): Promise<SavedAddress> {
  if (input.isDefault) {
    await supabase.from("addresses").update({ is_default: false }).eq("user_id", userId);
  }

  const { data, error } = await supabase
    .from("addresses")
    .insert({
      user_id: userId,
      label: input.label ?? "home",
      full_name: input.name,
      phone: input.phone,
      address_line1: input.line1,
      city: input.city,
      state: input.state,
      pincode: input.pincode,
      is_default: input.isDefault ?? false,
    })
    .select("*")
    .single();

  if (error || !data) throw new Error(error?.message ?? "Could not save address");
  return mapAddress(data);
}

export async function deleteAddress(supabase: SupabaseClient, userId: string, addressId: string) {
  await supabase.from("addresses").delete().eq("id", addressId).eq("user_id", userId);
}

export function validatePincode(pincode: string): { serviceable: boolean; estimatedDays: number } {
  const serviceable = /^[0-9]{6}$/.test(pincode);
  return { serviceable, estimatedDays: serviceable ? 4 : 0 };
}
