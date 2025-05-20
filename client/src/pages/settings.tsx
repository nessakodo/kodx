import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";

const AVATAR_OPTIONS = [
  { id: 1, gradient: "from-[#9ecfff] to-[#88c9b7]", label: "Ocean Breeze" },
  { id: 2, gradient: "from-[#b166ff] to-[#9ecfff]", label: "Cosmic Violet" },
  { id: 3, gradient: "from-[#ff6b6b] to-[#ffa700]", label: "Sunset Glow" },
  { id: 4, gradient: "from-[#5cdc96] to-[#88c9b7]", label: "Emerald Mist" },
  { id: 5, gradient: "from-[#ffa700] to-[#ff6b6b]", label: "Golden Fire" },
  { id: 6, gradient: "from-[#b166ff] to-[#ff6b6b]", label: "Mystic Aura" },
];

export default function SettingsPage() {
  const { user, isAuthenticated } = useAuth();
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState(1);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-kodex-grid bg-gradient-kodex">
        <Header />
        <main className="container mx-auto px-4 py-16">
          <div className="glassmorphic p-8 rounded-2xl shadow-lg max-w-md mx-auto">
            <h1 className="text-2xl mb-4 font-orbitron text-center">Access Denied</h1>
            <p className="text-center mb-6">Please sign in to view your settings.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    toast({
      title: "Profile Updated",
      description: "Your profile information has been successfully updated.",
    });
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({
        title: "Password Error",
        description: "New passwords don't match. Please try again.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Password Updated",
      description: "Your password has been successfully changed.",
    });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleAvatarSelect = (id) => {
    setSelectedAvatar(id);
    toast({
      title: "Avatar Updated",
      description: "Your profile avatar has been updated.",
    });
  };

  return (
    <div className="min-h-screen bg-kodex-grid bg-gradient-kodex">
      <Header />
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="font-orbitron text-3xl tracking-wider">
            User <span className="bg-gradient-to-r from-[#9ecfff] to-[#88c9b7] bg-clip-text text-transparent">Settings</span>
          </h1>
          <p className="text-gray-400 mt-2">Manage your profile and account preferences</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-8 bg-[#1e2535]/30 backdrop-blur-md border border-[#9ecfff]/10">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="avatar">Avatar</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card className="glassmorphic">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal details here</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input 
                      id="username" 
                      value={username} 
                      onChange={(e) => setUsername(e.target.value)} 
                      className="border-[#9ecfff]/20 bg-[#1e2535]/20"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      className="border-[#9ecfff]/20 bg-[#1e2535]/20"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-[#9ecfff]/20 to-[#88c9b7]/20 border border-[#9ecfff]/30 hover:from-[#9ecfff]/30 hover:to-[#88c9b7]/30"
                  >
                    Update Profile
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="avatar">
            <Card className="glassmorphic">
              <CardHeader>
                <CardTitle>Avatar Selection</CardTitle>
                <CardDescription>Choose an avatar style for your profile</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-6">
                  <div className="flex justify-center">
                    <div className="relative">
                      <Avatar className="h-24 w-24 border-4 border-[#9ecfff]/30">
                        <AvatarFallback className={`bg-gradient-to-br ${AVATAR_OPTIONS[selectedAvatar-1].gradient}`}>
                          {user?.username?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute bottom-0 right-0 bg-[#5cdc96] text-xs px-2 py-1 rounded-full text-black font-semibold">
                        Level {Math.floor(user?.totalXp / 1000) + 1}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mt-6">
                    {AVATAR_OPTIONS.map((avatar) => (
                      <div 
                        key={avatar.id} 
                        className={`cursor-pointer p-4 rounded-xl text-center transition-all ${
                          selectedAvatar === avatar.id 
                            ? 'border-2 border-[#9ecfff] bg-[#9ecfff]/10' 
                            : 'border border-[#9ecfff]/20 hover:bg-[#1e2535]/40'
                        }`}
                        onClick={() => handleAvatarSelect(avatar.id)}
                      >
                        <div className="flex justify-center mb-2">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback className={`bg-gradient-to-br ${avatar.gradient}`}>
                              {user?.username?.[0]?.toUpperCase() || "U"}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <p className="text-sm">{avatar.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="security">
            <Card className="glassmorphic">
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Update your password</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpdatePassword} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input 
                      id="currentPassword" 
                      type="password" 
                      value={currentPassword} 
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="border-[#9ecfff]/20 bg-[#1e2535]/20"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input 
                      id="newPassword" 
                      type="password" 
                      value={newPassword} 
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="border-[#9ecfff]/20 bg-[#1e2535]/20"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input 
                      id="confirmPassword" 
                      type="password" 
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="border-[#9ecfff]/20 bg-[#1e2535]/20"
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-[#9ecfff]/20 to-[#88c9b7]/20 border border-[#9ecfff]/30 hover:from-[#9ecfff]/30 hover:to-[#88c9b7]/30"
                  >
                    Update Password
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}