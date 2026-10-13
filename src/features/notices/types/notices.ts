// 화면용 타입
export type Notice = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
};

// DB(notices 테이블) 컬럼 타입
export type NoticeRow = {
  id: number;
  title: string;
  content: string;
  created_at: string;
};
