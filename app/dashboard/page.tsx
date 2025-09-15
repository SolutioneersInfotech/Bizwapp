"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  Users,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useAnalytics } from "@/contexts/AnalyticsContext";
import useUser from "../../hooks/api/getuser";
import getUserStats from "../../hooks/api/getAnalytics";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";
import getLatestMessages from "../../hooks/api/getRecentConversations";

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const { analytics, refreshAnalytics } = useAnalytics();
  const [stats, setStats] = useState(null);
  const [userId, setUserId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const { data, isError } = useUser();

  useEffect(() => {
    if (data?.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }
  }, [data]);

  useEffect(() => {
    const fetchLatestMessages = async () => {
      try {
        const response = await getLatestMessages(userId);
        setMessages(response.data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchLatestMessages();
    }
  }, [userId]);

  // useEffect(() => {
  //   if (!isLoading && !isAuthenticated) {
  //     router.push("/login")
  //   }

  // Only refresh analytics on initial mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isLoading, isAuthenticated, router])

  //Add a separate effect for refreshing analytics only once

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await localStorage.getItem("user");
      const parsedUser = await JSON.parse(userData);
      const id = parsedUser.id || parsedUser.user?._id || null;
      setUserId(id);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getUserStats(userId);
        setStats(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    if (userId) {
      fetchStats();
    }
  }, [userId]);

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      refreshAnalytics();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  console.log("messages", messages);

  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 px-4 pt-4 sm:px-6 sm:pt-6 md:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <MessageSquare className="mr-2 h-4 w-4" />
            New Conversation
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="flex flex-wrap gap-2 mb-12 md:mb-0">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            {/* <TabsTrigger value="analytics">Analytics</TabsTrigger> */}
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card className="w-full overflow-hidden rounded-xl border bg-card text-card-foreground shadow transition-all hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Messages
                  </CardTitle>
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats ? (
                      stats?.overview?.totalMessages
                    ) : (
                      <Spinner size={16} className="mr-2" />
                    )}
                  </div>
                  {stats?.overview?.messagesGrowth !== undefined && (
                    <p className="text-xs text-muted-foreground">
                      <span
                        className={`${
                          stats?.overview?.messagesGrowth >= 0
                            ? "text-green-500"
                            : "text-red-500"
                        } flex items-center`}
                      >
                        {stats?.overview?.messagesGrowth >= 0 ? (
                          <ArrowUpRight className="mr-1 h-3 w-3" />
                        ) : (
                          <ArrowDownRight className="mr-1 h-3 w-3" />
                        )}
                        {stats?.overview?.messagesGrowth}% from last month
                      </span>
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow transition-all hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Active Contacts
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats ? (
                      stats?.overview?.totalContacts
                    ) : (
                      <Spinner size={16} className="mr-2" />
                    )}
                  </div>
                  {stats?.overview?.contactsGrowth !== undefined && (
                    <p className="text-xs text-muted-foreground">
                      <span
                        className={`${
                          stats?.overview?.contactsGrowth >= 0
                            ? "text-green-500"
                            : "text-red-500"
                        } flex items-center`}
                      >
                        {stats?.overview?.contactsGrowth >= 0 ? (
                          <ArrowUpRight className="mr-1 h-3 w-3" />
                        ) : (
                          <ArrowDownRight className="mr-1 h-3 w-3" />
                        )}
                        {stats?.overview?.contactsGrowth}% from last month
                      </span>
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow transition-all hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Delivery Rate
                  </CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats ? (
                      `${stats?.rates?.deliveryRate} %`
                    ) : (
                      <Spinner size={16} className="mr-2" />
                    )}
                  </div>
                  {stats?.rates?.deliveryGrowth !== undefined && (
                    <p className="text-xs text-muted-foreground">
                      <span
                        className={`${
                          stats?.rates?.deliveryGrowth >= 0
                            ? "text-green-500"
                            : "text-red-500"
                        } flex items-center`}
                      >
                        {stats?.rates?.deliveryGrowth >= 0 ? (
                          <ArrowUpRight className="mr-1 h-3 w-3" />
                        ) : (
                          <ArrowDownRight className="mr-1 h-3 w-3" />
                        )}
                        {stats?.rates?.deliveryGrowth}% from last month
                      </span>
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card className="overflow-hidden rounded-xl border bg-card text-card-foreground shadow transition-all hover:shadow-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Read Rate
                  </CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats ? (
                      `${stats?.rates?.readRate} %`
                    ) : (
                      <Spinner size={16} className="mr-2" />
                    )}
                  </div>
                  {stats?.rates?.readGrowth !== undefined && (
                    <p className="text-xs text-muted-foreground">
                      <span
                        className={`${
                          stats?.rates?.readGrowth >= 0
                            ? "text-green-500"
                            : "text-red-500"
                        } flex items-center`}
                      >
                        {stats?.rates?.readGrowth >= 0 ? (
                          <ArrowUpRight className="mr-1 h-3 w-3" />
                        ) : (
                          <ArrowDownRight className="mr-1 h-3 w-3" />
                        )}
                        {stats?.rates?.readGrowth}% from last month
                      </span>
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4 overflow-hidden rounded-xl border bg-card text-card-foreground shadow">
                <CardHeader>
                  <CardTitle>Message Analytics</CardTitle>
                  <CardDescription>
                    Message delivery and response rates over time
                  </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <div className="h-[300px] w-full">
                    <EngagementChart data={analytics.dailyStats} />
                  </div>
                </CardContent>
              </Card>

              <Card className="col-span-3 flex flex-col overflow-hidden rounded-xl border bg-card text-card-foreground shadow mb-2">
                {/* Header */}
                <CardHeader>
                  <CardTitle>Recent Conversations</CardTitle>
                  <CardDescription>
                    Your most recent customer interactions
                  </CardDescription>
                </CardHeader>

                {/* Scrollable Messages Area */}
                <CardContent className="flex-1 overflow-y-auto">
  <div className="space-y-4">
    {loading ? (
      // Loader jab API call chal rahi ho
      <div className="flex justify-center items-center py-8">
        <Spinner size={40} className="text-green-600" />
      </div>
    ) : messages.length > 0 ? (
      // Jab data mila ho
      messages.map((conversation) => (
        <div
          key={conversation.id}
          className="flex items-center gap-4"
        >
          <Avatar>
            <AvatarImage src={conversation.avatar} />
            <AvatarFallback>
              {conversation.initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium leading-none">
                {conversation.name
                  ? conversation.name
                  : conversation.phoneNumber}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(conversation.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-1">
              {conversation.message}
            </p>
          </div>
          <Badge
            variant={
              conversation.unread === true ? "default" : "outline"
            }
            className={
              conversation.unread === true
                ? "bg-primary text-primary-foreground"
                : ""
            }
          >
            New
          </Badge>
        </div>
      ))
    ) : (
      // Jab API call khatam ho gayi aur koi data nahi mila
      <p className="flex justify-center py-8">No contacts found</p>
    )}
  </div>
</CardContent>


                {/* Sticky Footer */}
                <div className="border-t px-4 py-2">
                  <Button variant="ghost" className="w-full justify-center">
                    <Link href="/conversations">View All Conversations</Link>
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// function EngagementChart({ data = [] }) {
//   // If no data, show sample data
//   const chartData =
//     data && data.length > 0
//       ? data
//       : Array.from({ length: 12 }).map((_, i) => ({
//           date: `2023-${(i + 1).toString().padStart(2, "0")}-01`,
//           sent: Math.floor(Math.random() * 100) + 50,
//           delivered: Math.floor(Math.random() * 80) + 40,
//           read: Math.floor(Math.random() * 60) + 30,
//         }))

//   return (
//     <div className="flex h-full w-full items-end gap-2 pl-4 pt-4">
//       {chartData.map((item, i) => {
//         const sentHeight = item.sent ? (item.sent / 100) * 70 + 30 : Math.floor(Math.random() * 70) + 30
//         const deliveredHeight = item.delivered ? (item.delivered / item.sent) * sentHeight : sentHeight - 10
//         const readHeight = item.read ? (item.read / item.delivered) * deliveredHeight : deliveredHeight - 20

//         return (
//           <div key={i} className="relative flex h-full flex-1 flex-col">

//             <div className="absolute bottom-0 w-full rounded-md bg-primary/30" style={{ height: `${sentHeight}%` }} />
//             <div
//               className="absolute bottom-0 w-full rounded-md bg-primary/50"
//               style={{ height: `${deliveredHeight}%` }}
//             />
//             <div className="absolute bottom-0 w-full rounded-md bg-primary" style={{ height: `${readHeight}%` }} />
//             <div className="absolute -bottom-6 w-full text-center text-xs text-muted-foreground">
//               {item.date ? new Date(item.date).toLocaleDateString("en-US", { month: "short" }) : `M${i + 1}`}
//             </div>

//           </div>

//         )
//       })}
//     </div>
//   )
// }

function EngagementChart({ data = [] }) {
  // If no data, show sample data
  const chartData =
    data && data.length > 0
      ? data
      : Array.from({ length: 12 }).map((_, i) => ({
          date: `2023-${(i + 1).toString().padStart(2, "0")}-01`,
          sent: Math.floor(Math.random() * 100) + 50,
          delivered: Math.floor(Math.random() * 80) + 40,
        }));

  // Max value for scaling
  const maxValue = Math.max(
    ...chartData.map((d) => Math.max(d.sent, d.delivered)),
    100
  );

  return (
    <div className="flex w-full flex-col">
      {/* Chart */}
      <div className="flex h-64 items-end gap-4 px-6 pt-4">
        {chartData.map((item, i) => {
          const sentHeight = (item.sent / maxValue) * 100;
          const deliveredHeight = (item.delivered / maxValue) * 100;

          return (
            <div
              key={i}
              className="relative flex h-full flex-1 flex-col items-center"
            >
              {/* Bars */}
              <div className="flex w-full items-end justify-center gap-1 h-full">
                <div
                  className="w-3 rounded-md bg-primary/70"
                  style={{ height: `${sentHeight}%` }}
                  title={`Sent: ${item.sent}`}
                />
                <div
                  className="w-3 rounded-md bg-primary"
                  style={{ height: `${deliveredHeight}%` }}
                  title={`Delivered: ${item.delivered}`}
                />
              </div>

              {/* Month Label */}
              <div className="absolute -bottom-6 w-full text-center text-xs text-muted-foreground">
                {item.date
                  ? new Date(item.date).toLocaleDateString("en-US", {
                      month: "short",
                    })
                  : `M${i + 1}`}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legends */}
      <div className="mt-8 flex justify-center gap-6 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-sm bg-primary/70" />
          Sent
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-sm bg-primary" />
          Delivered
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <div className="h-8 w-48 bg-muted rounded animate-pulse"></div>
          <div className="h-10 w-40 bg-muted rounded animate-pulse"></div>
        </div>

        <div className="h-10 w-80 bg-muted rounded animate-pulse"></div>

        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-32 bg-muted rounded animate-pulse"
              ></div>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="col-span-4 h-[400px] bg-muted rounded animate-pulse"></div>
            <div className="col-span-3 h-[400px] bg-muted rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

const recentConversations = [
  {
    id: 1,
    name: "Sarah Johnson",
    initials: "SJ",
    avatar: "/placeholder.svg?height=40&width=40",
    message: "Thanks for the quick response! The product works great.",
    time: "2m ago",
    status: "New",
  },
  {
    id: 2,
    name: "Michael Chen",
    initials: "MC",
    avatar: "/placeholder.svg?height=40&width=40",
    message: "I'm having trouble with my order #45678. Can you help?",
    time: "15m ago",
    status: "New",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    initials: "ER",
    avatar: "/placeholder.svg?height=40&width=40",
    message: "Do you have this item in blue? I only see red on the website.",
    time: "1h ago",
    status: "Replied",
  },
  {
    id: 4,
    name: "David Kim",
    initials: "DK",
    avatar: "/placeholder.svg?height=40&width=40",
    message: "When will my order ship? I placed it 2 days ago.",
    time: "3h ago",
    status: "Replied",
  },
];
