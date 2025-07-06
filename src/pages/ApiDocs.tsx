
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Copy, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ApiDocs = () => {
  const { toast } = useToast();
  const baseUrl = "https://nqulgfktatzbtzicskqk.supabase.co";
  const anonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5xdWxnZmt0YXR6YnR6aWNza3FrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE3MDY5NzAsImV4cCI6MjA2NzI4Mjk3MH0.jdnzUkw1l27cvviTSLQIE_rIVM8S2aR8fCNjA_ro6i0";

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "The content has been copied to your clipboard.",
    });
  };

  // Helper function to get current time with buffer for API examples
  const getBufferedCurrentTime = () => {
    const now = new Date();
    const bufferedNow = new Date(now.getTime() - 60000); // 1 minute buffer
    return bufferedNow.toISOString();
  };

  const customerApis = [
    {
      title: "Get Customer Incentives by Location",
      method: "POST",
      url: `${baseUrl}/rest/v1/rpc/get_incentives_by_location`,
      description: "Get active customer incentives filtered by location",
      body: JSON.stringify({
        "p_location": "Manila",
        "p_user_type": "customer"
      }, null, 2)
    },
    {
      title: "Get All Active Customer Incentives",
      url: `${baseUrl}/rest/v1/incentives?select=*&is_active=eq.true&user_type=eq.customer&end_date=gte.${getBufferedCurrentTime()}&order=created_at.desc`,
      method: "GET",
      description: "Get all active customer incentives that haven't expired",
      body: null
    }
  ];

  const driverApis = [
    {
      title: "Get Driver Incentives by Location",
      method: "POST",
      url: `${baseUrl}/rest/v1/rpc/get_incentives_by_location`,
      description: "Get active driver incentives filtered by location",
      body: JSON.stringify({
        "p_location": "Quezon City",
        "p_user_type": "driver"
      }, null, 2)
    },
    {
      title: "Get All Active Driver Incentives",
      method: "GET",
      url: `${baseUrl}/rest/v1/incentives?select=*&is_active=eq.true&user_type=eq.driver&end_date=gte.${getBufferedCurrentTime()}&order=created_at.desc`,
      description: "Get all active driver incentives that haven't expired",
      body: null
    },
    {
      title: "Get Driver Incentives by Multiple Locations",
      method: "GET",
      url: `${baseUrl}/rest/v1/incentives?select=*&is_active=eq.true&user_type=eq.driver&location=in.("Manila","Makati","Quezon City")&end_date=gte.${getBufferedCurrentTime()}&order=created_at.desc`,
      description: "Get driver incentives for multiple locations that haven't expired",
      body: null
    }
  ];

  const dynamicApis = [
    {
      title: "Get Dynamic Incentives by Cities",
      method: "POST",
      url: `${baseUrl}/rest/v1/rpc/get_dynamic_incentives_by_cities`,
      description: "Get dynamic incentives filtered by specific cities",
      body: JSON.stringify({
        "p_cities": ["Manila", "Quezon City", "Makati"]
      }, null, 2)
    },
    {
      title: "Get All Active Dynamic Incentives",
      method: "GET",
      url: `${baseUrl}/rest/v1/dynamic_incentives?select=*&is_active=eq.true&end_date=gte.${getBufferedCurrentTime()}&order=created_at.desc`,
      description: "Get all active dynamic incentives that haven't expired",
      body: null
    },
    {
      title: "Get Dynamic Incentives by Location",
      method: "GET",
      url: `${baseUrl}/rest/v1/dynamic_incentives?select=*&is_active=eq.true&location=eq.Taguig&end_date=gte.${getBufferedCurrentTime()}&order=created_at.desc`,
      description: "Get dynamic incentives for a specific location that haven't expired",
      body: null
    }
  ];

  const generalApis = [
    {
      title: "Get All Active Incentives",
      method: "GET",
      url: `${baseUrl}/rest/v1/incentives?select=*&is_active=eq.true&end_date=gte.${getBufferedCurrentTime()}&order=created_at.desc`,
      description: "Get all active incentives regardless of user type that haven't expired",
      body: null
    },
    {
      title: "Get Incentives by Location (Any User Type)",
      method: "POST",
      url: `${baseUrl}/rest/v1/rpc/get_incentives_by_location`,
      description: "Get incentives by location for any user type",
      body: JSON.stringify({
        "p_location": "Manila",
        "p_user_type": null
      }, null, 2)
    }
  ];

  const ApiCard = ({ api }: { api: any }) => (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{api.title}</CardTitle>
          <Badge variant={api.method === "GET" ? "default" : "secondary"}>
            {api.method}
          </Badge>
        </div>
        <CardDescription>{api.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">URL:</label>
          <div className="flex items-center space-x-2 mt-1">
            <code className="flex-1 p-2 bg-gray-100 rounded text-xs break-all">
              {api.url}
            </code>
            <Button
              size="sm"
              variant="outline"
              onClick={() => copyToClipboard(api.url)}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        {api.body && (
          <div>
            <label className="text-sm font-medium text-gray-700">Request Body:</label>
            <div className="flex items-start space-x-2 mt-1">
              <pre className="flex-1 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
                {api.body}
              </pre>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyToClipboard(api.body)}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Incentive Manager API Documentation</h1>
          <p className="text-xl text-muted-foreground mb-6">
            Complete API reference for mobile app integration
          </p>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Base URL:</label>
                <div className="flex items-center space-x-2 mt-1">
                  <code className="flex-1 p-2 bg-gray-100 rounded text-sm">
                    {baseUrl}
                  </code>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(baseUrl)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Required Headers:</label>
                <div className="flex items-start space-x-2 mt-1">
                  <pre className="flex-1 p-2 bg-gray-100 rounded text-xs overflow-x-auto">
{`apikey: ${anonKey}
Authorization: Bearer ${anonKey}
Content-Type: application/json`}
                  </pre>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(`apikey: ${anonKey}\nAuthorization: Bearer ${anonKey}\nContent-Type: application/json`)}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="customer" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="customer">Customer APIs</TabsTrigger>
            <TabsTrigger value="driver">Driver APIs</TabsTrigger>
            <TabsTrigger value="dynamic">Dynamic APIs</TabsTrigger>
            <TabsTrigger value="general">General APIs</TabsTrigger>
          </TabsList>
          
          <TabsContent value="customer" className="mt-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mb-4">Customer Incentive APIs</h2>
              {customerApis.map((api, index) => (
                <ApiCard key={index} api={api} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="driver" className="mt-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mb-4">Driver Incentive APIs</h2>
              {driverApis.map((api, index) => (
                <ApiCard key={index} api={api} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="dynamic" className="mt-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mb-4">Dynamic Incentive APIs</h2>
              {dynamicApis.map((api, index) => (
                <ApiCard key={index} api={api} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="general" className="mt-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold mb-4">General APIs</h2>
              {generalApis.map((api, index) => (
                <ApiCard key={index} api={api} />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Testing with Postman</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Copy any URL and request body above, then use them in Postman with the required headers to test the APIs.
            </p>
            <div className="flex items-center space-x-2">
              <ExternalLink className="h-4 w-4" />
              <span className="text-sm">Ready for integration with mobile apps (React Native, Flutter, etc.)</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ApiDocs;
