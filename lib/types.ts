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

export type MealSlot = "breakfast" | "lunch" | "snack" | "dinner";

export type WeeklyMenuMeals = Record<string, Partial<Record<MealSlot, string>>>;

export type WeeklyMenu = {
  id: string;
  user_id: string;
  title: string;
  week_start: string | null;
  meals: WeeklyMenuMeals;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type ShoppingListItem = {
  id: string;
  name: string;
  category: string;
  checked: boolean;
};

export type ShoppingList = {
  id: string;
  user_id: string;
  title: string;
  items: ShoppingListItem[];
  created_at: string;
  updated_at: string;
};

export type PantryItem = {
  id: string;
  user_id: string;
  name: string;
  category: string | null;
  quantity: string | null;
  created_at: string;
};
