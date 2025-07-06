
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIncentives } from "@/hooks/useIncentives";
import { useDynamicIncentives } from "@/hooks/useDynamicIncentives";
import { TrendingUp, Users, Car, MapPin } from "lucide-react";

const IncentiveStats = () => {
  const { incentives } = useIncentives();
  const { dynamicIncentives } = useDynamicIncentives();

  // Helper function to check if incentive is currently active and not expired
  const isIncentiveActive = (incentive: any) => {
    const now = new Date();
    const endDate = new Date(incentive.endDate);
    // Add a small buffer to account for timezone differences and processing delays
    const bufferedNow = new Date(now.getTime() - 60000); // 1 minute buffer
    return incentive.isActive && endDate > bufferedNow;
  };

  // Filter incentives by user type and active status (including time check)
  const activeCustomerIncentives = incentives.filter(inc => 
    inc.userType === 'customer' && isIncentiveActive(inc)
  );
  const activeDriverIncentives = incentives.filter(inc => 
    inc.userType === 'driver' && isIncentiveActive(inc)
  );
  const activeDynamicIncentives = dynamicIncentives.filter(inc => 
    isIncentiveActive(inc)
  );

  // Calculate totals only for active, non-expired incentives
  const customerTotal = activeCustomerIncentives.reduce((sum, inc) => sum + inc.amount, 0);
  const driverTotal = activeDriverIncentives.reduce((sum, inc) => sum + inc.amount, 0);
  const dynamicTotal = activeDynamicIncentives.reduce((sum, inc) => sum + inc.amount, 0);

  const formatAmount = (amount: number) => {
    return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
  };

  const stats = [
    {
      title: "Customer Incentives",
      count: activeCustomerIncentives.length,
      total: customerTotal,
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Driver Incentives", 
      count: activeDriverIncentives.length,
      total: driverTotal,
      icon: Car,
      color: "text-green-600",
    },
    {
      title: "Dynamic Incentives",
      count: activeDynamicIncentives.length,
      total: dynamicTotal,
      icon: MapPin,
      color: "text-purple-600",
    },
    {
      title: "Total Value",
      count: activeCustomerIncentives.length + activeDriverIncentives.length + activeDynamicIncentives.length,
      total: customerTotal + driverTotal + dynamicTotal,
      icon: TrendingUp,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <Icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.count}</div>
              <p className="text-xs text-muted-foreground">
                Total: {formatAmount(stat.total)}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default IncentiveStats;
