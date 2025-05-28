
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ModernButton } from '@/components/ui/modern-button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, User, Bell, Menu } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  onProfileClick: () => void;
}

export const Header = ({ onProfileClick }: HeaderProps) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="glass-card bg-white/10 backdrop-blur-xl border-b border-white/20 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center animate-glow">
                <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
                  <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded" />
                </div>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  TimeTableMaster
                </h1>
                <div className="text-xs text-gray-600 hidden sm:block">
                  Lesson Management System
                </div>
              </div>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Notification Bell */}
            <ModernButton variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs"></span>
            </ModernButton>

            {/* User Info */}
            <div className="text-right hidden lg:block">
              <div className="text-sm font-medium text-gray-900">{user?.name}</div>
              <div className="text-xs text-gray-500">{user?.email}</div>
            </div>
            
            {/* Profile Avatar */}
            <ModernButton
              variant="ghost"
              size="sm"
              onClick={onProfileClick}
              className="flex items-center space-x-2 glass-button"
            >
              <Avatar className="h-8 w-8 ring-2 ring-blue-500/20">
                <AvatarFallback className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-600">
                  {user?.name ? getInitials(user.name) : <User className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
            </ModernButton>
            
            {/* Logout Button */}
            <ModernButton
              variant="outline"
              size="sm"
              onClick={logout}
              className="flex items-center space-x-2"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </ModernButton>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <ModernButton
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </ModernButton>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/20 mt-4 pt-4 pb-4 space-y-3 animate-fade-in">
            <div className="flex items-center space-x-3 px-2">
              <Avatar className="h-10 w-10 ring-2 ring-blue-500/20">
                <AvatarFallback className="bg-gradient-to-r from-blue-100 to-purple-100 text-blue-600">
                  {user?.name ? getInitials(user.name) : <User className="h-5 w-5" />}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                <div className="text-xs text-gray-500">{user?.email}</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <ModernButton
                variant="ghost"
                className="w-full justify-start"
                onClick={onProfileClick}
              >
                <User className="h-4 w-4 mr-3" />
                Edit Profile
              </ModernButton>
              
              <ModernButton
                variant="ghost"
                className="w-full justify-start"
              >
                <Bell className="h-4 w-4 mr-3" />
                Notifications
              </ModernButton>
              
              <ModernButton
                variant="ghost"
                className="w-full justify-start text-red-600 hover:text-red-700"
                onClick={logout}
              >
                <LogOut className="h-4 w-4 mr-3" />
                Logout
              </ModernButton>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
