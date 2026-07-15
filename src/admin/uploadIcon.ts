import { supabase } from "../lib/supabase";

export async function uploadIcon(table: string, file: File): Promise<string> {
  const dotIndex = file.name.lastIndexOf(".");
  const ext = dotIndex > 0 ? file.name.slice(dotIndex + 1) : "png";
  const path = `${table}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from("icons").upload(path, file);
  if (error) throw error;

  return supabase.storage.from("icons").getPublicUrl(path).data.publicUrl;
}
