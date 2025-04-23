
import { supabase } from "./client";

/**
 * Increment user activity count for a specific activity type
 * @param userId The user ID
 * @param activityType The activity type to increment
 * @returns Promise with the result of the RPC call
 */
export const incrementUserActivity = async (
  userId: string, 
  activityType: string
) => {
  return supabase.rpc('increment_user_activity', {
    user_id: userId,
    activity_type: activityType
  });
};
