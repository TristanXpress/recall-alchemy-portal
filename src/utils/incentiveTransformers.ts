
import { Incentive } from "@/types/incentive";

// Transform database row to frontend type
export const transformDbToIncentive = (dbRow: any): Incentive => ({
  id: dbRow.id,
  title: dbRow.title,
  description: dbRow.description,
  amount: dbRow.amount,
  type: dbRow.type,
  startDate: dbRow.start_date,
  endDate: dbRow.end_date,
  location: dbRow.location,
  isActive: dbRow.is_active,
  conditions: dbRow.conditions || [],
  userType: dbRow.user_type,
});

// Transform frontend type to database format
export const transformIncentiveToDb = (incentive: Omit<Incentive, "id">) => ({
  title: incentive.title,
  description: incentive.description,
  amount: incentive.amount,
  type: incentive.type,
  start_date: incentive.startDate,
  end_date: incentive.endDate,
  location: incentive.location,
  is_active: incentive.isActive,
  conditions: incentive.conditions,
  user_type: incentive.userType,
});

// Transform incentive for update (includes updated_at)
export const transformIncentiveForUpdate = (incentive: Incentive) => ({
  ...transformIncentiveToDb(incentive),
  updated_at: new Date().toISOString(),
});
