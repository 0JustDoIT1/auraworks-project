import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY 환경변수가 필요합니다.",
  );
}

// 브라우저용 클라이언트. 이 파일에서 한 번만 생성하고 재사용
export const supabase = createClient(supabaseUrl, supabaseKey);
