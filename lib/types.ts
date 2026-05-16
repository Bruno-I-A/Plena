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

export type FoodGoal = "balanced" | "lighter" | "cutting" | "bulking" | "more_protein" | "maintain_weight";
export type CookingTime = "quick" | "medium" | "flexible";

export type ProfilePreferences = {
  dietary_restrictions: string[];
  disliked_ingredients: string[];
  food_goal: FoodGoal;
  meal_focus: string[];
  cooking_time: CookingTime;
  preference_notes: string | null;
};
