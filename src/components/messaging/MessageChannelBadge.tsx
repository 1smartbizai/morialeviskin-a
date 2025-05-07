
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Smartphone } from 'lucide-react';
import { getChannelLabel } from './utils/messageUtils';

interface MessageChannelBadgeProps {
  channel: 'whatsapp' | 'sms' | 'in-app';
}

export const MessageChannelBadge: React.FC<MessageChannelBadgeProps> = ({ channel }) => {
  const channelIcons = {
    whatsapp: <MessageSquare className="h-4 w-4 text-green-600" />,
    sms: <Smartphone className="h-4 w-4" />,
    'in-app': <MessageSquare className="h-4 w-4" />
  };

  return (
    <Badge variant="outline" className="flex items-center gap-1">
      {channelIcons[channel]}
      {getChannelLabel(channel)}
    </Badge>
  );
};

export default MessageChannelBadge;
