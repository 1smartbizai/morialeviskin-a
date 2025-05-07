
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Message } from '@/types/messaging';
import { getStatusIcon, getStatusLabel, getStatusColor } from './utils/messageUtils';

interface MessageStatusBadgeProps {
  status: Message['status'];
}

export const MessageStatusBadge: React.FC<MessageStatusBadgeProps> = ({ status }) => {
  return (
    <Badge className={getStatusColor(status)}>
      {getStatusIcon(status)}
      <span className="mr-1">{getStatusLabel(status)}</span>
    </Badge>
  );
};

export default MessageStatusBadge;
