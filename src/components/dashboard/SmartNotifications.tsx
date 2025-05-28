
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Calendar, Gift, Package, AlertTriangle, Users, X, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface SmartNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  related_id?: string;
  is_read: boolean;
  created_at: string;
  scheduled_for?: string;
}

const SmartNotifications = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<SmartNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      fetchNotifications();
      generateSmartNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('smart_notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;

      setNotifications(data || []);
      setUnreadCount(data?.filter(n => !n.is_read).length || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSmartNotifications = async () => {
    if (!user) return;

    try {
      // בדיקת תורים לעוד 24 שעות
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      const { data: upcomingAppointments } = await supabase
        .from('appointments')
        .select('*, clients(first_name, last_name)')
        .eq('business_owner_id', user.id)
        .gte('appointment_date', new Date().toISOString())
        .lte('appointment_date', tomorrow.toISOString())
        .eq('status', 'confirmed');

      // יצירת התראות לתורים קרובים
      for (const appointment of upcomingAppointments || []) {
        const existingNotification = await supabase
          .from('smart_notifications')
          .select('id')
          .eq('user_id', user.id)
          .eq('type', 'appointment_reminder')
          .eq('related_id', appointment.id)
          .maybeSingle();

        if (!existingNotification.data) {
          await supabase
            .from('smart_notifications')
            .insert({
              user_id: user.id,
              type: 'appointment_reminder',
              title: 'תזכורת לתור מחר',
              message: `תור עם ${appointment.clients?.first_name} ${appointment.clients?.last_name} מחר`,
              related_id: appointment.id
            });
        }
      }

      // בדיקת ימי הולדת השבוע
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);

      const { data: birthdayClients } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', user.id)
        .not('birthdate', 'is', null);

      for (const client of birthdayClients || []) {
        if (client.birthdate) {
          const birthday = new Date(client.birthdate);
          const thisYear = new Date().getFullYear();
          birthday.setFullYear(thisYear);
          
          if (birthday >= new Date() && birthday <= nextWeek) {
            const existingNotification = await supabase
              .from('smart_notifications')
              .select('id')
              .eq('user_id', user.id)
              .eq('type', 'birthday')
              .eq('related_id', client.id)
              .gte('created_at', new Date().toISOString().split('T')[0])
              .maybeSingle();

            if (!existingNotification.data) {
              await supabase
                .from('smart_notifications')
                .insert({
                  user_id: user.id,
                  type: 'birthday',
                  title: 'יום הולדת השבוע',
                  message: `יום הולדת ל${client.first_name} ${client.last_name} ב-${birthday.toLocaleDateString('he-IL')}`,
                  related_id: client.id
                });
            }
          }
        }
      }

    } catch (error) {
      console.error('Error generating notifications:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('smart_notifications')
        .update({ 
          is_read: true,
          read_at: new Date().toISOString()
        })
        .eq('id', notificationId);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId 
            ? { ...n, is_read: true }
            : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
      
      if (unreadIds.length === 0) return;

      const { error } = await supabase
        .from('smart_notifications')
        .update({ 
          is_read: true,
          read_at: new Date().toISOString()
        })
        .in('id', unreadIds);

      if (error) throw error;

      setNotifications(prev => 
        prev.map(n => ({ ...n, is_read: true }))
      );
      setUnreadCount(0);

      toast({
        title: "כל ההתראות סומנו כנקראו",
        description: "כל ההתראות עודכנו בהצלחה"
      });
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'appointment_reminder':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'birthday':
        return <Gift className="h-4 w-4 text-pink-500" />;
      case 'low_stock':
        return <Package className="h-4 w-4 text-orange-500" />;
      case 'unpaid_debt':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'inactive_client':
        return <Users className="h-4 w-4 text-gray-500" />;
      default:
        return <Bell className="h-4 w-4 text-beauty-primary" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'appointment_reminder':
        return 'bg-blue-50 border-blue-200';
      case 'birthday':
        return 'bg-pink-50 border-pink-200';
      case 'low_stock':
        return 'bg-orange-50 border-orange-200';
      case 'unpaid_debt':
        return 'bg-red-50 border-red-200';
      case 'inactive_client':
        return 'bg-gray-50 border-gray-200';
      default:
        return 'bg-beauty-accent border-beauty-primary/20';
    }
  };

  if (loading) {
    return (
      <Card className="animate-fade-in">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-beauty-primary" />
            התראות חכמות
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-in hover:shadow-md transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-beauty-dark">
            <Bell className="h-5 w-5 text-beauty-primary" />
            התראות חכמות
            {unreadCount > 0 && (
              <Badge variant="destructive" className="animate-pulse">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={markAllAsRead}
              className="text-xs hover:bg-beauty-accent"
            >
              סמן הכל כנקרא
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>אין התראות חדשות</p>
              <p className="text-sm">נודיע לך על אירועים חשובים</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 rounded-lg border transition-all duration-200 hover:shadow-sm ${
                  notification.is_read 
                    ? 'bg-gray-50 border-gray-200 opacity-75' 
                    : getNotificationColor(notification.type)
                } ${!notification.is_read ? 'animate-scale-in' : ''}`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm text-beauty-dark">
                          {notification.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(notification.created_at).toLocaleDateString('he-IL', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      {!notification.is_read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => markAsRead(notification.id)}
                          className="h-6 w-6 p-0 hover:bg-white/50"
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SmartNotifications;
