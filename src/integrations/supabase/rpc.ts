
import { supabase } from "./client";

/**
 * Increments the activity count for a specific user and activity type
 * If no record exists, it creates one with count = 1
 */
export async function incrementUserActivity(userId: string, activityType: string) {
  return supabase.rpc('increment_user_activity', {
    user_id_param: userId,
    activity_type_param: activityType
  });
}
