"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Users, Search, Shield, Ban, Check, X, Eye, UserPlus } from "lucide-react";

interface User {
  id: string;
  username: string;
  email: string;
  displayName: string;
  role: "admin" | "moderator" | "user";
  status: "active" | "suspended" | "banned" | "pending";
  joinDate: string;
  lastActive: string;
  postCount: number;
  reportCount: number;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      username: "alice",
      email: "alice@example.com", 
      displayName: "Alice Johnson",
      role: "admin",
      status: "active",
      joinDate: "2024-01-15",
      lastActive: "2 minutes ago",
      postCount: 342,
      reportCount: 0,
    },
    {
      id: "2",
      username: "bob",
      email: "bob@example.com",
      displayName: "Bob Smith",
      role: "moderator", 
      status: "active",
      joinDate: "2024-02-10",
      lastActive: "1 hour ago",
      postCount: 156,
      reportCount: 2,
    },
    {
      id: "3",
      username: "charlie",
      email: "charlie@example.com",
      displayName: "Charlie Brown",
      role: "user",
      status: "suspended",
      joinDate: "2024-03-05",
      lastActive: "3 days ago",
      postCount: 89,
      reportCount: 5,
    },
    {
      id: "4",
      username: "dana",
      email: "dana@example.com",
      displayName: "Dana Wilson",
      role: "user",
      status: "pending",
      joinDate: "2024-08-07",
      lastActive: "Never",
      postCount: 0,
      reportCount: 0,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.displayName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    const matchesStatus = selectedStatus === "all" || user.status === selectedStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-red-100 text-red-800">Admin</Badge>;
      case "moderator":
        return <Badge className="bg-blue-100 text-blue-800">Moderator</Badge>;
      case "user":
        return <Badge variant="secondary">User</Badge>;
      default:
        return <Badge variant="secondary">{role}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case "suspended":
        return <Badge className="bg-yellow-100 text-yellow-800">Suspended</Badge>;
      case "banned":
        return <Badge className="bg-red-100 text-red-800">Banned</Badge>;
      case "pending":
        return <Badge className="bg-gray-100 text-gray-800">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleUserAction = (userId: string, action: string) => {
    setUsers(users.map(user => {
      if (user.id === userId) {
        switch (action) {
          case "approve":
            return { ...user, status: "active" as const };
          case "suspend":
            return { ...user, status: "suspended" as const };
          case "ban":
            return { ...user, status: "banned" as const };
          case "activate":
            return { ...user, status: "active" as const };
          case "makeAdmin":
            return { ...user, role: "admin" as const };
          case "makeModerator":
            return { ...user, role: "moderator" as const };
          case "makeUser":
            return { ...user, role: "user" as const };
          default:
            return user;
        }
      }
      return user;
    }));
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      setUsers(users.filter(u => u.id !== userId));
    }
  };

  const handleBulkAction = (action: string) => {
    console.info("Bulk action:", action);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">User Management</h2>
          <p className="text-muted-foreground">Manage user accounts and permissions</p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Invite User
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filter Users</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search users..."
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="moderator">Moderator</option>
                <option value="user">User</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="suspended">Suspended</option>
                <option value="banned">Banned</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center text-white font-bold">
                        {user.displayName.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-medium">{user.displayName}</h4>
                        <p className="text-sm text-muted-foreground">@{user.username}</p>
                      </div>
                      <div className="flex gap-2">
                        {getRoleBadge(user.role)}
                        {getStatusBadge(user.status)}
                      </div>
                    </div>

                    <div className="text-sm text-muted-foreground grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                      <div>
                        <span className="font-medium">Email:</span> {user.email}
                      </div>
                      <div>
                        <span className="font-medium">Joined:</span> {user.joinDate}
                      </div>
                      <div>
                        <span className="font-medium">Posts:</span> {user.postCount}
                      </div>
                      <div>
                        <span className="font-medium">Reports:</span> 
                        <span className={user.reportCount > 0 ? "text-red-600 ml-1" : "ml-1"}>
                          {user.reportCount}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="font-medium">Last Active:</span> {user.lastActive}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    {user.status === "pending" && (
                      <>
                        <Button 
                          size="sm" 
                          onClick={() => handleUserAction(user.id, "approve")}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}

                    {user.status === "active" && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleUserAction(user.id, "suspend")}
                      >
                        <Ban className="h-4 w-4 mr-1" />
                        Suspend
                      </Button>
                    )}

                    {user.status === "suspended" && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleUserAction(user.id, "activate")}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Activate
                      </Button>
                    )}

                    <div className="relative">
                      <select
                        value={user.role}
                        onChange={(e) => handleUserAction(user.id, `make${e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)}`)}
                        className="w-full h-8 px-2 text-xs border border-input bg-background rounded-md"
                      >
                        <option value="user">User</option>
                        <option value="moderator">Moderator</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>

                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No users found matching your criteria</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {users.filter(u => u.status === "active").length}
              </div>
              <div className="text-sm text-muted-foreground">Active Users</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {users.filter(u => u.status === "pending").length}
              </div>
              <div className="text-sm text-muted-foreground">Pending Approval</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {users.filter(u => u.status === "suspended" || u.status === "banned").length}
              </div>
              <div className="text-sm text-muted-foreground">Suspended/Banned</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {users.filter(u => u.role === "admin" || u.role === "moderator").length}
              </div>
              <div className="text-sm text-muted-foreground">Staff Members</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}