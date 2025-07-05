
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useIncentives } from "@/hooks/useIncentives";
import { useDynamicIncentives } from "@/hooks/useDynamicIncentives";
import { TrendingUp, Users, Car, MapPin } from "lucide-react";

const IncentiveStats = () => {
  const { incentives } = useIncentives();
  const { dynamicIncentives } = useDynamicIncentives();

  // Filter incentives by user type
  const customerIncentives = incentives.filter(inc => inc.userType === 'customer');
  const driverIncentives = incentives.filter(inc => inc.userType === 'driver');

  // Calculate totals
  const customerTotal = customerIncentives.reduce((sum, inc) => sum + inc.amount, 0);
  const driverTotal = driverIncentives.reduce((sum, inc) => sum + inc.amount, 0);
  const dynamicTotal = dynamicIncentives.reduce((sum, inc) => sum + inc.amount, 0);

  const formatAmount = (amount: number) => {
    return `₱${amount.toLocaleString('en-PH', { minimumFractionDigits: 2 })}`;
  };

  const stats = [
    {
      title: "Customer Incentives",
      count: customerIncentives.length,
      total: customerTotal,
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Driver Incentives", 
      count: driverIncentives.length,
      total: driverTotal,
      icon: Car,
      color: "text-green-600",
    },
    {
      title: "Dynamic Incentives",
      count: dynamicIncentives.length,
      total: dynamicTotal,
      icon: MapPin,
      color: "text-purple-600",
    },
    {
      title: "Total Value",
      count: customerIncentives.length + driverIncentives.length + dynamicIncentives.length,
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
