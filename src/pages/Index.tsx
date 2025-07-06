
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import CustomerIncentives from "@/components/incentives/CustomerIncentives";
import DriverIncentives from "@/components/incentives/DriverIncentives";
import DynamicIncentives from "@/components/incentives/DynamicIncentives";
import IncentiveStats from "@/components/incentives/IncentiveStats";

const Index = () => {
  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Incentive Manager</h1>
          <p className="text-xl text-muted-foreground mb-6">Manage customer and driver incentives for your app</p>
        </div>

        <IncentiveStats />

        <Tabs defaultValue="customers" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="customers">Customer Incentives</TabsTrigger>
            <TabsTrigger value="drivers">Driver Incentives</TabsTrigger>
            <TabsTrigger value="dynamic">Dynamic Incentives</TabsTrigger>
          </TabsList>
          
          <TabsContent value="customers">
            <Card>
              <CardHeader>
                <CardTitle>Customer Incentives</CardTitle>
                <CardDescription>Manage incentives for your customers</CardDescription>
              </CardHeader>
              <CardContent>
                <CustomerIncentives />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="drivers">
            <Card>
              <CardHeader>
                <CardTitle>Driver Incentives</CardTitle>
                <CardDescription>Manage incentives for your drivers</CardDescription>
              </CardHeader>
              <CardContent>
                <DriverIncentives />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="dynamic">
            <Card>
              <CardHeader>
                <CardTitle>Dynamic Location-Based Incentives</CardTitle>
                <CardDescription>Create incentives available only in specific Philippine cities</CardDescription>
              </CardHeader>
              <CardContent>
                <DynamicIncentives />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
