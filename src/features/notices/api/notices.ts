import { supabase } from "@/lib/supabase/client";
import type { Notice, NoticeRow } from "../types/notices";

const NOTICE_COLUMNS = "id, title, content, created_at";
const NOTICE_LIMIT = 10;

// DB 컬럼 → 화면용 타입
function toNotice(row: NoticeRow): Notice {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    createdAt: row.created_at,
  };
}

// 최신 공지부터 최대 10개
export async function fetchNotices(): Promise<Notice[]> {
  const { data, error } = await supabase
    .from("notices")
    .select(NOTICE_COLUMNS)
    .order("id", { ascending: false })
    .limit(NOTICE_LIMIT)
    .overrideTypes<NoticeRow[], { merge: false }>();

  if (error) {
    throw new Error(`[fetchNotices] ${error.message}`);
  }

  return (data ?? []).map(toNotice);
}
