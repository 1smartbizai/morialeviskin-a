
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { getChannelLabel, getChannelIcon } from './utils/messageUtils';

interface MessageChannelBadgeProps {
  channel: 'whatsapp' | 'sms' | 'in-app';
}

export const MessageChannelBadge: React.FC<MessageChannelBadgeProps> = ({ channel }) => {
  return (
    <Badge variant="outline" className="flex items-center gap-1">
      {getChannelIcon(channel)}
      {getChannelLabel(channel)}
    </Badge>
  );
};

export default MessageChannelBadge;
