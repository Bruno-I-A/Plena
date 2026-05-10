export type ChatRole = "user" | "assistant" | "system";

export type Conversation = {
  id: string;
  user_id: string;
  title: string | null;
  created_at: string;
  updated_at: string;
  last_message?: string | null;
};

export type Message = {
  id: string;
  conversation_id?: string | null;
  user_id?: string | null;
  role: ChatRole;
  content: string;
  created_at?: string;
};

export type Favorite = {
  id: string;
  user_id: string;
  conversation_id: string | null;
  message_id: string | null;
  title: string | null;
  content: string;
  created_at: string;
};
